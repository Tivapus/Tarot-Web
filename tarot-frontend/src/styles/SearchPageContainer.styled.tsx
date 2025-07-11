import { styled } from '@mui/material/styles';

export const AskQuestionPage = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
`

export const QuestionWithDetail = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
`

export const PackSearchContainer= styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const QuestionBoxStyle = styled('input')`
    font-size:30px;
    padding: 24px 40px;
    background: linear-gradient(135deg, #1A132F 0%, #251A3E 70%);
    border-radius: 64px;
    width: 800px;
    height: 100px;
`

export const GetQuestionButton = styled('button')`
    font-size: 18px;
    border: 2px solid white;
    border-radius: 32px;
    width: 200px;
    height: 60px;
    cursor: pointer;
`