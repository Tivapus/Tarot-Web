import { styled } from '@mui/material/styles';

export const HeaderText = styled('h1')`
    color: white;
    font-size: 40px;
    font-weight: 700;
`
export const SubHeaderText = styled('h1')`
    color: white;
    font-size: 25px;
    font-weight: 600;
`
export const Paragraph = styled('p')`
    font-size: 16px;
    color: white;
    font-weight: 400;
`;

export const DefaultMenuWrapContainer = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
`
export const MiddleLineStyle = styled('div')`
    width: 0;
    height: 450px;
    border: 1px solid #FFFFFF;
    align-items: center;
    justify-content: center;
`;

export const FooterTextStyle = styled('p')`
  color: #ffffff;
  position: fixed;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  width: 100%;
  line-height: 100%;
  bottom: 0;
  left: 0;
  padding: 16px;
  font-family: 'Inter', sans-serif;
`;
