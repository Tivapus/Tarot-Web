'use client';

import { BackGround } from '@/styles/BackGround.styled';
import Deck from '@/components/Deck';
import { tarotDeck } from '@/TarotDeck';
import { DefaultMenuWrapContainer, HeaderText } from '@/styles/Shared.styled';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FooterText from '@/components/FooterText';
import MainNavBar from '@/components/MainNavBar';
import { useTarot } from '@/contexts/TarotContext';

export default function HomePage() {
  const DeckTarot = tarotDeck;
  const router = useRouter();

  const { isInitialized, mode, numCard } = useTarot();

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (!mode || numCard === 0) {
      router.push('/home');
    }
  }, [isInitialized, mode, numCard, router]);

  if (!isInitialized) {
      return (
          <BackGround>
            <DefaultMenuWrapContainer>
              <HeaderText>Loading...</HeaderText>
            </DefaultMenuWrapContainer>
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
