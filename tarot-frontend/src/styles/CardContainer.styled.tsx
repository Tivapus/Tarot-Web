import { styled } from '@mui/material/styles';
import Image from 'next/image';

export const BackCardContainer = styled('div')`
  perspective: 1000px;
  width: 192px;
  height: 288px;
  position: absolute;
  cursor: pointer;
  :hover{
    border:5px solid #6784f8;
    border-radius: 12px;
  }
`;

export const CardContainer = styled('div')`
  perspective: 1000px;
  width: 300px;
  height: 455px;
  cursor: pointer;
  position: relative;
  margin: 15px;
`;

export const CardInner = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const BaseCardFace = styled(Image)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
`;

export const FlipWrapper = styled('div')`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const CardFace = styled('div')`
  width: 300px; 
  height: 455px; 
  position: relative; 
  border-radius: 15px;
  overflow: hidden;
  backface-visibility: hidden;
`;


export const CardImage = styled(Image)`
  border-radius: 12px;
  object-fit: cover;
`;