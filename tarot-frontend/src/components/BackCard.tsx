'use client';

import {
  BaseCardFace,
    CardInner,
    BackCardContainer,
} from '@/styles/CardContainer.styled';

interface BackCardProps {
    style?: React.CSSProperties;
}

export default function BackCard({ style }: BackCardProps) {

  return (
    <BackCardContainer style={style}>
      <CardInner>
        <BaseCardFace src="/assets/back.png" alt="BackCard" width={192} height={288} />
      </CardInner>
    </BackCardContainer>
  );
}
