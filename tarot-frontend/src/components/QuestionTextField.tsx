'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTarot } from '@/contexts/TarotContext.context';
import { generateMessage } from '@/TarotPromtpTemplate';

import { BackGround } from "@/styles/BackGround.styled";
import { AskQuestionPage, GetQuestionButton, PackSearchContainer, QuestionBoxStyle, QuestionWithDetail } from "@/styles/SearchPageContainer.styled";
import { DefaultMenuWrapContainer, HeaderText, Paragraph } from "@/styles/Shared.styled";
import FooterText from "./FooterText";
import { NavBarContainer } from "@/styles/NavBarContainer.styled";

export default function QuestionTextField() {
    const router = useRouter();
    const { mode, question, updateMode, updateQuestion, updateNumCard } = useTarot();

    const [input, setInput] = useState<string>(question || '');
    const [lenQuestion, setLenQuestion] = useState<number>(0);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const sendReqToAI = async (currentQuestion: string): Promise<boolean> => {
        try {
            const message = generateMessage('chat_ai', [], currentQuestion);
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, mode: 'chat_ai' }),
            });

            if (!response.ok) throw new Error("API request failed");

            const data = await response.json();
            const aiMessage = data.reply;
            const parsedData = JSON.parse(aiMessage);

            updateMode(parsedData.mode);
            updateNumCard(parsedData.num_card_pick);
            return true;
        } catch (err) {
            console.error("Error in chat_ai mode selection:", err);
            window.alert('❌ ข้อผิดพลาดในการเชื่อมต่อ AI');
            return false;
        }
    };

    const handleOnClick = async () => {
        if (input.length === 0) {
            setError(true);
            return;
        }
        
        setLoading(true);
        updateQuestion(input);

        let navigate = false;

        if (mode === 'chat_ai') {
            const success = await sendReqToAI(input);
            if (success) {
                navigate = true;
            }
        } else {
            navigate = true;
        }

        if (navigate) {
            router.push('/pick-card');
        } else {
            setLoading(false);
        }
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        setError(false);
    };

    useEffect(() => {
        setLenQuestion(input.length);
    }, [input]);
    
    if (loading) {
        return (
            <BackGround>
                <NavBarContainer />
                <DefaultMenuWrapContainer>
                    <HeaderText>กำลังประมวลคำถาม...</HeaderText>
                    <Paragraph>กรุณารอสักครู่ AI กำลังใช้พลังจิตเพื่อประมวลคำถามให้คุณ</Paragraph>
                </DefaultMenuWrapContainer>
                <FooterText />
            </BackGround>
        );
    }

    return (
        <AskQuestionPage>
            <HeaderText style={{ WebkitTextStroke: '1px #d5a127', fontSize: '60px' }}>- Ask me anything -</HeaderText>
            <QuestionWithDetail>
                {error && <Paragraph style={{ color: 'red' }}>Enter your question !!!</Paragraph>}
                <PackSearchContainer>
                    <QuestionBoxStyle
                        type="text"
                        placeholder="Ask your question..."
                        value={input}
                        onChange={handleOnChange}
                        maxLength={200}
                        style={{ border: error ? '2px solid red' : '2px solid #61619e' }}
                    />
                </PackSearchContainer>
                <Paragraph>{lenQuestion}/200</Paragraph>
            </QuestionWithDetail>
            <GetQuestionButton onClick={handleOnClick}>Get an answer</GetQuestionButton>
        </AskQuestionPage>
    );
}