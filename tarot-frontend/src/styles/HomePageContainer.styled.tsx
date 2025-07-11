import { styled } from '@mui/material/styles';
import Image from 'next/image';

export const AllModeCardContainer= styled('div')`
    display: flex;
    flex-direction: row;
    gap: 64px;
    align-items: center;
    justify-content: center;
`

export const ModeCardContainer = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 440px;
    border-radius: 16px;
    background-color: rgba(72, 81, 129, 0.5);
    :hover{
      background-color: rgba(72, 81, 129, 0.95);
        border: 2px solid #d8ab42;
        cursor: pointer;
        transform: scale(1.05);
        box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    }
`

export const ModeTextInCard = styled('h1')`
    font-size: 24px;
    font-weight: 400;
    color: #d8ab42;
`

export const ModeImage = styled(Image)`
  border-radius: 12px;
`;

export const FlipContainer = styled('div')({
  width: '200px',
  height: '310px',
  perspective: '1000px',
  borderRadius: '12px',
  position: 'relative',
});

interface FlipInnerProps {
  flipped: boolean;
}

export const FlipInner = styled('div')<FlipInnerProps>(({ flipped }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s ease',
  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
}));


export const FlipFace = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  borderRadius: '12px',
  overflow: 'hidden',
});