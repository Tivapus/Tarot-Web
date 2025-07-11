'use client';

import { BackGround } from '@/styles/BackGround.styled';
import Deck from '@/components/Deck';
import { tarotDeck } from '@/TarotDeck';
import { DefaultMenuWrapContainer, HeaderText } from '@/styles/Shared.styled';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FooterText from '@/components/FooterText';
import MainNavBar from '@/components/MainNavBar';

export default function HomePage() {
  const DeckTarot = tarotDeck;
  const router = useRouter();

  const [mode,setMode] = useState<string>('')
  const [numCard,setNumCard] = useState<number>(0);
  useEffect(()=>{
    const modeItem = sessionStorage.getItem('mode');
    const numCardItem = sessionStorage.getItem('num-card');
    if(modeItem){
      setMode(JSON.parse(modeItem));
    }
    if(numCardItem){
      setNumCard(JSON.parse(numCardItem));
    }
    if(!numCardItem || !modeItem){
        router.push('/home');
        return;
    }
  },[])

  if (mode === '' || numCard === 0) {
      return (
          <BackGround>
              <h1>Loading...</h1>
          </BackGround>
      );
  }
  return (
    <BackGround style={{height:'100vh'}}>
      <MainNavBar/>
      <DefaultMenuWrapContainer>
        <HeaderText style={{paddingTop:'64px'}}>🔮 Tarot 🔮</HeaderText>
        <Deck cards={DeckTarot} numPicks={numCard}/>
      </DefaultMenuWrapContainer>
      <FooterText/>
    </BackGround>
  );
}
