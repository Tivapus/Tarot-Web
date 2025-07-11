'use client';

import { CardWrapper, DeckTitle, DeckWrapper } from '@/styles/Deck.styled';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { CardType } from '@/models/Card.model';
import BackCard from './BackCard';
import { useRouter } from 'next/navigation';
import { Paragraph } from '@/styles/Shared.styled';

interface ArcDeckProps {
    cards: CardType[];
    numPicks: number;
}

export default function ArcDeck({ cards,numPicks }: ArcDeckProps) {
    const router = useRouter();
    const [count,setCount] = useState<number>(numPicks)
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [shuffling, setShuffling] = useState(false);

    const [question,setQuestion] = useState<string>('');
    const handleSelect = (i: number) => {
        if (selectedIndices.includes(i)) return;
        if (count<=0) return;
        setCount(count-1)
        setSelectedIndices([...selectedIndices, i]);
    };

    useEffect(()=>{
        if(count<=0){
            let cardPicks = Array(selectedIndices.length)
            for(let i =0;i<selectedIndices.length;i++){
                cardPicks[i] = cards[selectedIndices[i]]
            }
            sessionStorage.setItem("cards",JSON.stringify(cardPicks));
            router.push('/results');
        }
    },[count])

    useEffect(()=>{
        shuffle(cards)
        const questionItem = sessionStorage.getItem('question');
        if(questionItem){
            setQuestion(JSON.parse(questionItem));
        }
    },[])

    function shuffle(array:CardType[]) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    }

  return (
    <>
        <DeckWrapper>
            <DeckTitle>Thinking about your question</DeckTitle>
            {question && <DeckTitle style={{top:'155px', fontSize:'24px'}}>: {question} ?</DeckTitle>}
            <DeckTitle style={{top:'190px', fontSize:'50px'}}>Select {count} cards</DeckTitle>
            {(numPicks==count) && <Button
                onClick={() => {
                    if (shuffling) return;
                    setShuffling(true);
                    shuffle(cards)
                    setTimeout(() => setShuffling(false), 1200); // 1.2s = animation duration
                }}
                style={{top:'270px',position:'absolute',left:'50%',transform:'translateX(-50%)',background:'#FFFFFF'}}
                >
                🔁 Shuffle
            </Button>}
            {cards.map((option, i) => {
                const center = Math.floor(cards.length / 2);
                const offset = i - center;
                const half = (cards.length - 1) / 2;
                const spread = 16;
                const scale = 2.5;
                const maxOffset = Math.pow(half / 3, 2) * scale;

                const translateX = offset * spread;
                const translateY = -((Math.pow(offset / 3, 2) * scale) - maxOffset+300);

                const rotate = -offset * 1.5;
                const z = i; 

                const isSelected = selectedIndices.includes(i);
                const extraOffset = isSelected ? 40 : 0;

                const rad = (rotate * Math.PI) / 180;
                const dx = Math.sin(rad) * extraOffset;
                const dy = -Math.cos(rad) * extraOffset;

                return (
                <CardWrapper
                    key={i}
                    className={shuffling ? `orbit orbit-${i % 5}` : ''}
                    style={{
                    transform: `
                        translateX(${translateX-dx}px)
                        translateY(${translateY-dy}px)
                        rotate(${rotate}deg)
                    `,
                    zIndex: z,
                    }}
                    onClick={() => handleSelect(i)}
                >
                    <BackCard />
                </CardWrapper>
                );
            })}
        </DeckWrapper>
    </>
  );
}