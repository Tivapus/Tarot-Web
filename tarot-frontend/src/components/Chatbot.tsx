'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTarot } from '@/contexts/TarotContext.context';
import FooterText from '@/components/FooterText';
import { BackGround } from '@/styles/BackGround.styled';
import ReactMarkdown from 'react-markdown';
import { ChatContainer, HistoryContainer, InputWrapper, MessageBubble, MessageWrapper, StyledButton, StyledInput, Title, TypingIndicator } from '@/styles/ChatContainer.styled';
import { Message } from '@/models/Chat.model';
import { useHistory } from '@/contexts/HistoryContext.context';
import OnProcessNavBar from './OnProcessNavBar';

export default function ChatBotComponent() {
  const router = useRouter();
  const { isInitialized, predictionResult, currentSessionId } = useTarot();
  const { history,updateChatForEntry } = useHistory();

  const [localChatHistory, setLocalChatHistory] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

    const createFollowUpMessage = (questions: string[]) => {
        if (!Array.isArray(questions) || questions.length === 0) {
            return ''; 
        }

        const questionList = questions
            .map((q, index) => `${index + 1}. ${q}`)
            .join('\n'); 

        return `\n\n**คำถามที่แนะนำเพิ่มเติม:**\n${questionList}`;
    };

  useEffect(() => {
    if (!isInitialized) return;

    const currentEntry = history.find(entry => entry.id === currentSessionId);

    if (!currentEntry) {
      router.push('/home');
      return;
    }

    let initialMessages: Message[] = [];
    if (currentEntry.chatHistory && currentEntry.chatHistory.length > 0) {
      initialMessages = currentEntry.chatHistory;
    } else {
      const followUpText = createFollowUpMessage(currentEntry.predictionResult.follow_up_questions || []);
      initialMessages = [
        { role: 'model', content: `นี่คือผลคำทำนายล่าสุดของคุณค่ะ มีอะไรอยากให้ 'มาดามเจมินี่' ช่วยอธิบายเพิ่มเติม หรือมีคำถามอะไรที่สงสัยไหมคะ? ${followUpText}` }
      ];
    }
    
    setLocalChatHistory(initialMessages);

  }, [isInitialized, currentSessionId, history, router]);

  const handleSendMessage = async () => {
      if (!userInput.trim() || isChatLoading) return;

      const newUserMessage: Message = { role: 'user', content: userInput };
      setLocalChatHistory(prev => [...prev, newUserMessage]);
      setUserInput('');
      setIsChatLoading(true);

      try {
          const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    history: localChatHistory, 
                    mode: 'real_chat_ai',
                    initialResult: predictionResult,
                    message: userInput
                }), 
          });

          if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
          }

          const data = await response.json();
          const aiReply: Message = { role: 'model', content: data.reply };

          setLocalChatHistory(prev => [...prev, aiReply]);
          updateChatForEntry(currentSessionId, [...localChatHistory, newUserMessage, aiReply]);

    } catch (error) {
        console.error("Chat Error:", error);
        setLocalChatHistory(prev => [...prev, { role: 'model', content: '❌ ขออภัยค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อ' }]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localChatHistory]);

  if (!isInitialized || localChatHistory.length === 0) {
    return (
        <BackGround>
            <OnProcessNavBar />
            <div>Loading Chat...</div>
            <FooterText />
        </BackGround>
    );
  }

  return (
        <ChatContainer>
            <Title>Chat with Tarot AI</Title>
            <HistoryContainer>
                {localChatHistory.map((msg, idx) => (
                    <MessageWrapper key={idx} isModel={msg.role === 'model'}>
                        <MessageBubble isModel={msg.role === 'model'}>
                            <ReactMarkdown>
                                {msg.content}
                            </ReactMarkdown>
                        </MessageBubble>
                    </MessageWrapper>
                ))}
                {isChatLoading && <TypingIndicator>กำลังพิมพ์...</TypingIndicator>}
                <div ref={messagesEndRef} />
            </HistoryContainer>
            <InputWrapper>
                <StyledInput
                    type="text"
                    placeholder="ถามคำถามเพิ่มเติม..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isChatLoading}
                />
                <StyledButton
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={isChatLoading}
                >
                    ส่ง
                </StyledButton>
            </InputWrapper>
        </ChatContainer>
  );
}