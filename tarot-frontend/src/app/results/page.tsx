'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTarot } from '@/contexts/TarotContext.context';
import { generateMessage } from '@/TarotPromtpTemplate';
import { tarotDeck } from '@/TarotDeck';

import FooterText from '@/components/FooterText';
import { BackGround } from '@/styles/BackGround.styled';
import { CardImage } from '@/styles/CardContainer.styled';
import { NavBarContainer } from '@/styles/NavBarContainer.styled';
import { CardDetailContainer, CardDetailYesNoContainer, ResultPickUpContainer, ShowAllCardContainer, ShowResultYesNoContainer, SummaryStockAllContainer, SummaryStockTextContainer, TextContainer } from '@/styles/ResultsCardWrapper.styled';
import { DefaultMenuWrapContainer, HeaderText, MiddleLineStyle, Paragraph, SubHeaderText } from '@/styles/Shared.styled';
import ResultsNavBar from '@/components/ResultsNavBar';
import { useHistory } from '@/contexts/HistoryContext.context';

export default function ResultsPage() {
    const router = useRouter();
    const { 
        isInitialized, 
        mode, 
        question, 
        selectedCards, 
        predictionResult, 
        updatePredictionResult,
        updateQuestion,
        updateSelectedCards,
        updateCurrentSessionId
    } = useTarot();
    const { addNewHistoryEntry } = useHistory();

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!isInitialized) return;

        if (!mode || (mode !== 'daily_life' && !question)) {
            router.push('/home');
            window.alert('Empty Variables')
            return;
        }

        if (predictionResult && (predictionResult.question === question || mode === 'daily_life')) {
            setLoading(false);
            return;
        }
        
        const sendReqToAI = async () => {
            setLoading(true);
            const message = generateMessage(mode, selectedCards, question);
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, mode }),
                });

                if (!response.ok) throw new Error('API request failed');

                const data = await response.json();
                const aiMessage = data.reply;
                const parsedData = JSON.parse(aiMessage);

                if (parsedData.status === 'invalid_question') {
                    window.alert(parsedData.message);
                    updateQuestion('');
                    updateSelectedCards([]);
                    updatePredictionResult(null); 
                    router.push('/ask-question');
                } else {
                    updatePredictionResult(parsedData);
                    const newEntryId = addNewHistoryEntry(parsedData, mode, question);
                    updateCurrentSessionId(newEntryId);
                }
            } catch (error) {
                console.error("Error fetching or parsing AI response:", error);
                window.alert('❌ ข้อผิดพลาดในการเชื่อมต่อ AI');
                router.push('/home');
            } finally {
                setLoading(false);
            }
        }

        sendReqToAI();
        
    }, [isInitialized, mode, question, selectedCards, router, updatePredictionResult]);

    const normalize = (name: string) => name.trim().toLowerCase().replace(/^the\s+/i, '');

    const renderDailyLife = () => {
        const cards = predictionResult?.cards ?? [];
        const summary = predictionResult?.summary ?? '';
        const stock_recommendation = predictionResult?.stock_recommendation ?? { stocks: [] };
        
        return (
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
                                    <HeaderText>{aiCard.time_frame?.charAt(0).toUpperCase() + aiCard.time_frame?.slice(1).toLowerCase()}</HeaderText>
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
                        <SubHeaderText>แนะนำสินทรัพย์</SubHeaderText>
                        {stock_recommendation.stocks.map((stock: any, idx: number) => (
                            <Paragraph key={idx}>📈 {stock.stock}: {stock.reason}</Paragraph>
                        ))}
                    </SummaryStockTextContainer>
                </SummaryStockAllContainer>
            </ResultPickUpContainer>
        );
    };
    
    const renderYesNo = () => {
        const card = predictionResult?.card;
        const localCard = tarotDeck.find(c => normalize(c.name) === normalize(card.card_name));

        return (
            <ResultPickUpContainer>
                <HeaderText>ผลการทำนาย (Yes / No)</HeaderText>
                <ShowResultYesNoContainer>
                    <CardDetailYesNoContainer>
                        <CardImage src={`/assets/cards/${localCard?.png}`} alt={localCard?.name || ""} width={300} height={455}/>
                        <SubHeaderText>{card.card_name}</SubHeaderText>
                    </CardDetailYesNoContainer>
                    <MiddleLineStyle/>
                    {card && (
                        <TextContainer>
                            <SubHeaderText>คำถาม : {predictionResult?.question ?? '( Your Question )'}</SubHeaderText>
                            <HeaderText>{card.answer}</HeaderText>
                            <Paragraph>{card.reasoning}</Paragraph>
                        </TextContainer>
                    )}
                </ShowResultYesNoContainer>
            </ResultPickUpContainer>
        );
    };

    if (loading || !isInitialized) {
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
            <ResultsNavBar/>
            {mode === 'daily_life' && predictionResult && renderDailyLife()}
            {mode === 'yes_no' && predictionResult && renderYesNo()}
            {typeof predictionResult === 'string' && <HeaderText>{predictionResult}</HeaderText>}
        </BackGround>
    );
}