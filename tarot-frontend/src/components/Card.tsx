'use client';

import { CardType } from '@/models/Card.model';
import {
    CardContainer,
    CardFace,
    CardImage,
    FlipWrapper,
} from '@/styles/CardContainer.styled';
import { useState } from 'react';
import ReactCardFlip from 'react-card-flip';

interface CardProps {
    card: CardType;
}

export default function Card({ card }: CardProps) {
  const [stateFlip,setStateFlip] = useState(false);

  function handleClick(){
    if(!stateFlip){
      setStateFlip(!stateFlip);
    }
  }
  return (
    <CardContainer onClick={handleClick}>
      <FlipWrapper>
        <ReactCardFlip isFlipped={stateFlip} flipDirection="horizontal">
          <CardFace key="front">
            <CardImage
              src="/assets/back.png"
              alt="BackCard"
              fill
            />
          </CardFace>
          <CardFace key="back">
            <CardImage
              src={`/assets/cards/${card.png}`}
              alt={card.name}
              fill
            />
          </CardFace>
        </ReactCardFlip>
      </FlipWrapper>
    </CardContainer>
  );
}
