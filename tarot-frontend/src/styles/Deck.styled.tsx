import { styled } from '@mui/material/styles';

export const DeckWrapper = styled('div')`
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const DeckTitle = styled('div')`
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 25px;
    color: #fff;
    pointer-events: none;
`;

export const CardWrapper = styled('div')`
  position: absolute;
  width: 120px;
  height: 200px;
  transform-origin: center;
  transition: transform 0.3s;

  &.orbit {
    animation: orbitAnim 1.4s ease-in-out forwards;
  }

  @keyframes orbitAnim {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    25% {
      transform: translate(30px, -60px) rotate(45deg) scale(1.05);
    }
    75% {
      transform: translate(-30px, 60px) rotate(-45deg) scale(1.05);
    }
    100% {
      transform: translate(0px, 0px) rotate(0deg) scale(1);
    }
  }
`;
