'use client';

import { BackGround } from "@/styles/BackGround.styled";
import { AskQuestionPage, GetQuestionButton, PackSearchContainer, QuestionBoxStyle, QuestionWithDetail } from "@/styles/SearchPageContainer.styled";
import { DefaultMenuWrapContainer, HeaderText, Paragraph } from "@/styles/Shared.styled";
import { generateMessage } from "@/TarotPromtpTemplate";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FooterText from "./FooterText";
import { NavBarContainer } from "@/styles/NavBarContainer.styled";

export default function QuestionTextField(){
    const router = useRouter();
    const [input, setInput] = useState<string>('');
    const [lenQuestion,setLenQuestion] = useState<number>(0)
    const [error,setError] = useState<boolean>(false);

    const [click, setClick] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [mode,setMode] = useState<string>('')
    useEffect(()=>{
        const modeItem = sessionStorage.getItem('mode');
        if(modeItem){
            setMode(JSON.parse(modeItem));
        }
        if(!modeItem){
            router.push('/home');
            return;
        }
    },[])

    const sendReqToAI = async () =>{
        try {
            const message = generateMessage(mode, [], input);
            console.log(message)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message:message,mode:mode }),
            });

            const data = await response.json();
            const aiMessage = data.reply;

            const cleanReply = aiMessage.replace(/```json|```/g, '').trim();
            const parsedData = JSON.parse(cleanReply);

            sessionStorage.setItem('num-card',JSON.stringify(parsedData.num_card_pick));
            sessionStorage.setItem('mode',JSON.stringify(parsedData.mode));
        } catch (error) {
            console.error("Error fetching or parsing AI response:", error);
            window.alert('❌ ข้อผิดพลาดในการเชื่อมต่อ AI')
            router.push('/home');
        } finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(!loading && click){
            router.push('/pick-card');
        }
    },[loading])


    const handleOnClick = async ()=>{
        if(lenQuestion === 0){
            setError(true);
        }
        else{
            setClick(true)
            if(mode === 'chat_ai'){
                setLoading(true);
                sessionStorage.setItem('question',JSON.stringify(input));
                await sendReqToAI();
            }else{
                sessionStorage.setItem('question',JSON.stringify(input));
                router.push('/pick-card');
            }
        }
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        setError(false);
    }

    useEffect(()=>{
        setLenQuestion(input.length);
    },[input])
    
    if(loading){
        return(
            <BackGround>
                <NavBarContainer/>
                <DefaultMenuWrapContainer>
                    <HeaderText>กำลังประมวลคำถาม...</HeaderText>
                    <Paragraph>กรุณารอสักครู่ AI กำลังใช้พลังจิตเพื่อประมวลคำถามให้คุณ</Paragraph>
                </DefaultMenuWrapContainer>
                <FooterText/>
            </BackGround>
        );
    }
    return(
        <AskQuestionPage>
            <HeaderText style={{WebkitTextStroke: '1px #d5a127',fontSize:'60px'}}>- Ask me anything -</HeaderText>
            <QuestionWithDetail>
                {error && <Paragraph style={{color:'red'}}>Enter your question !!!</Paragraph>}
                <PackSearchContainer>
                    <QuestionBoxStyle
                        type="text"
                        placeholder="Ask your question..."
                        value={input}
                        onChange={handleOnChange}
                        maxLength={200}
                        style={{border: error ? '2px solid red' : '2px solid #61619e'}}
                    />
                </PackSearchContainer>
                <Paragraph>{lenQuestion}/200</Paragraph>
            </QuestionWithDetail>
            <GetQuestionButton onClick={handleOnClick}>Get an answer</GetQuestionButton>
        </AskQuestionPage>
    );
}   