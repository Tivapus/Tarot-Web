'use client';

import FooterText from '@/components/FooterText';
import MainNavBar from '@/components/MainNavBar';
import { CardType } from '@/models/Card.model';
import { BackGround } from '@/styles/BackGround.styled';
import { CardImage } from '@/styles/CardContainer.styled';
import { NavBarContainer } from '@/styles/NavBarContainer.styled';
import { CardDetailContainer, CardDetailYesNoContainer, ResultPickUpContainer, ShowAllCardContainer, ShowResultYesNoContainer, SummaryStockAllContainer, SummaryStockTextContainer, TextContainer } from '@/styles/ResultsCardWrapper.styled';
import { DefaultMenuWrapContainer, HeaderText, MiddleLineStyle, Paragraph, SubHeaderText } from '@/styles/Shared.styled';
import { tarotDeck } from '@/TarotDeck';
import { generateMessage, mockDataDailyLife, mockDataYesNo } from '@/TarotPromtpTemplate';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultsPage() {
    const router = useRouter();

    const [results,setResults] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [mode,setMode] = useState<string>('')
    const [ready,setReady] = useState<boolean>(false);
    const [cardSelectList, setCardSelectList] = useState<CardType[]>([]);
    const [question,setQuestion] = useState<string>('');

    useEffect(()=>{
        const cardSelect = sessionStorage.getItem("cards");
        const modeItem = sessionStorage.getItem('mode');
        const questionItem = sessionStorage.getItem('question');
        if(cardSelect){
            setCardSelectList(JSON.parse(cardSelect));
        }
        if(modeItem){
            setMode(JSON.parse(modeItem));
        }
        if(questionItem){
            setQuestion(JSON.parse(questionItem));
        }
        if(!cardSelect || !modeItem){
            router.push('/home');
            return;
        }
        setReady(true)
    },[])

    useEffect(()=>{
        if(!ready) return;
        const message = generateMessage(mode, cardSelectList, question);
        console.log(message)
        const sendReqToAI = async () =>{
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message:message,mode:mode }),
                });

                const data = await response.json();
                const aiMessage = data.reply;

                const cleanReply = aiMessage.replace(/```json|```/g, '').trim();
                const parsedData = JSON.parse(cleanReply);
                if(parsedData.status === 'invalid_question'){
                    window.alert(parsedData.message);
                    sessionStorage.setItem('question','');
                    router.push('/ask-question');
                }else{
                    setResults(parsedData);
                }
            } catch (error) {
                console.error("Error fetching or parsing AI response:", error);
                window.alert('❌ ข้อผิดพลาดในการเชื่อมต่อ AI')
                setResults('❌ ข้อผิดพลาดในการเชื่อมต่อ AI');
                router.push('/home');
            } finally{
                setLoading(false);
            }
        }
        sendReqToAI();
    },[ready])

    useEffect(()=>{
        console.log('results:', results);
        console.log(JSON.stringify(results));
        console.log('typeof results:', typeof results);
    }, [results]);

    const normalize = (name: string) => name.trim().toLowerCase().replace(/^the\s+/i, '');
    const renderDailyLife = () =>{
        const cards = results?.cards ?? [];
        const summary = results?.summary ?? '';
        const stock_recommendation = results?.stock_recommendation ?? { stocks: [] };
        const follow_up_question = results?.follow_up_question ?? '';
        return(
            <ResultPickUpContainer>
                <HeaderText>Results</HeaderText>
                <ShowAllCardContainer>
                {cards.map((aiCard: any, idx: number) => {
                    const localCard = tarotDeck.find(c => normalize(c.name) === normalize(aiCard.card_name));

                    return (
                    <CardDetailContainer key={idx}>
                        {localCard ? 
                            <CardImage src={`/assets/cards/${localCard.png}`} alt={localCard.name} width={225} height={338}/> 
                        : <Paragraph>⚠️ ไม่พบภาพของ {aiCard.card_name}</Paragraph>}
                        <TextContainer>
                            <HeaderText>{aiCard.time_frame.charAt(0).toUpperCase() + aiCard.time_frame.slice(1).toLowerCase()}</HeaderText>
                            <SubHeaderText>{aiCard.card_name}</SubHeaderText>
                            <Paragraph>{aiCard.meaning}</Paragraph>
                        </TextContainer>
                    </CardDetailContainer>
                    );
                })}
                </ShowAllCardContainer>
                <SummaryStockAllContainer>
                    <SummaryStockTextContainer>
                        <SubHeaderText>สรุปคำทำนาย</SubHeaderText>
                        <Paragraph>{summary}</Paragraph>
                    </SummaryStockTextContainer>

                    <SummaryStockTextContainer>
                        <SubHeaderText>แนะนำหุ้น</SubHeaderText>
                        {stock_recommendation.stocks.map((stock: any, idx: number) => (
                            <Paragraph key={idx}>
                                📈 {stock.stock}: {stock.reason}
                            </Paragraph>
                        ))}
                    </SummaryStockTextContainer>
                </SummaryStockAllContainer>
            </ResultPickUpContainer>
        )
    };
    
    const renderYesNo = () =>{
        const card = results?.card;
        const followUpQuestion = results?.follow_up_question
        return(
            <ResultPickUpContainer>
                <HeaderText>ผลการทำนาย (Yes / No)</HeaderText>

                <ShowResultYesNoContainer>
                    {cardSelectList.map((cardItem, key) => (
                        <CardDetailYesNoContainer>
                            <CardImage src={`/assets/cards/${cardItem.png}`} alt={cardItem.name} width={300} height={455}/>
                            <SubHeaderText>{cardItem.name}</SubHeaderText>
                        </CardDetailYesNoContainer>
                    ))}
                    <MiddleLineStyle/>
                    {card && (
                        <TextContainer>
                            <SubHeaderText>คำถาม : {question ? question : '( Your Question )'}</SubHeaderText>
                            <HeaderText>{card.answer.split(' ')[0]}</HeaderText>
                            <Paragraph>{card.answer.split('เพราะ')[1]}</Paragraph>
                        </TextContainer>
                    )}
                </ShowResultYesNoContainer>
            </ResultPickUpContainer>
        )
    };

    if (loading) {
        return (
            <BackGround>
                <NavBarContainer/>
                <DefaultMenuWrapContainer>
                    <HeaderText>กำลังประมวลผลคำทำนาย...</HeaderText>
                    <Paragraph>กรุณารอสักครู่ AI กำลังใช้พลังจิตเพื่อเปิดไพ่ให้คุณ</Paragraph>
                </DefaultMenuWrapContainer>
                <FooterText/>
            </BackGround>
        );
    }

    return (
        <BackGround>
            <MainNavBar/>
            {mode === 'daily_life' && renderDailyLife()}
            {mode === 'yes_no' && renderYesNo()}
            <FooterText/>
        </BackGround>
    );
}
