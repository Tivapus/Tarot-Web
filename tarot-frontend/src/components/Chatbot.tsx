'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTarot } from '@/contexts/TarotContext';
import MainNavBar from '@/components/MainNavBar';
import FooterText from '@/components/FooterText';
import { BackGround } from '@/styles/BackGround.styled';
import ReactMarkdown from 'react-markdown';
import { ChatContainer, HistoryContainer, InputWrapper, MessageBubble, MessageWrapper, StyledButton, StyledInput, Title, TypingIndicator } from '@/styles/ChatContainer.styled';
import { Message } from '@/models/Chat.model';

export default function ChatBotComponent() {
  const router = useRouter();
  const { isInitialized, predictionResult, chatHistory, updateChatHistory } = useTarot();

  const [userInput, setUserInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInitialized) return;
    
    if (!predictionResult) {
        router.push('/home');
        return;
    }
    const createFollowUpMessage = (questions: string[]) => {
        if (!Array.isArray(questions) || questions.length === 0) {
            return ''; 
        }

        const questionList = questions
            .map((q, index) => `${index + 1}. ${q}`)
            .join('\n'); 

        return `\n\n**คำถามที่แนะนำเพิ่มเติม:**\n${questionList}`;
    };

    const followUpText = createFollowUpMessage(predictionResult?.follow_up_questions || []);

    if (chatHistory.length === 0) {
        updateChatHistory(
            { role: 'model', content: `นี่คือผลคำทำนายล่าสุดของคุณค่ะ มีอะไรอยากให้ 'มาดามเจมินี่' ช่วยอธิบายเพิ่มเติม หรือมีคำถามอะไรที่สงสัยไหมคะ? ${followUpText}` }
        );
    }
  }, [isInitialized, predictionResult, router, chatHistory.length]);

  const handleSendMessage = async () => {
      if (!userInput.trim() || isChatLoading) return;

      const newUserMessage: Message = { role: 'user', content: userInput };
      updateChatHistory(newUserMessage);
      setUserInput('');
      setIsChatLoading(true);

      try {
          const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    history: chatHistory, 
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

          updateChatHistory(aiReply);

    } catch (error) {
        console.error("Chat Error:", error);
        updateChatHistory({ role: 'model', content: '❌ ขออภัยค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    } finally {
        setIsChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  if (!isInitialized || chatHistory.length === 0) {
    return (
        <BackGround>
            <MainNavBar />
            <div>Loading Chat...</div>
            <FooterText />
        </BackGround>
    );
  }

  return (
        <ChatContainer>
            <Title>Chat with Tarot AI</Title>
            <HistoryContainer>
                {chatHistory.map((msg, idx) => (
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