'use client';

import { GoBackContainer, NavBarContainer } from '@/styles/NavBarContainer.styled';
import { Paragraph } from '@/styles/Shared.styled';
import HomeIcon from './HomeIcon';
import { useRouter } from 'next/navigation';
import AssistantIcon from '@mui/icons-material/Assistant';
import ChatDrawer from './ChatDrawer';
import { useResults } from '@/contexts/ResultsContext.context';

const ResultsNavBar = () => {
    const router = useRouter();
    const {isChatOpen, setIsChatOpen} = useResults();

    const handleOnClickGoHome= ()=>{
        router.push('/home');
    }

    const handleOnClickChat = () =>{
        setIsChatOpen(!isChatOpen)
    }
    return (
        <NavBarContainer>
            <GoBackContainer onClick={handleOnClickGoHome} style={{cursor:'pointer'}}>
                <HomeIcon style={{color: 'white'}}/>
                <Paragraph style={{color: 'white'}}>Return to Home</Paragraph>
            </GoBackContainer>
            <GoBackContainer onClick={handleOnClickChat} style={{justifyContent:'right'}}>
                <AssistantIcon/>
                <Paragraph style={{color: 'white'}}>Chat for more information</Paragraph>
            </GoBackContainer>
            <ChatDrawer />
        </NavBarContainer>
    );
};

export default ResultsNavBar;
