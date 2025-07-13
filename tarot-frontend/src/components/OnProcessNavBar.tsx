'use client';

import { GoBackContainer, NavBarContainer } from '@/styles/NavBarContainer.styled';
import { Paragraph } from '@/styles/Shared.styled';
import HomeIcon from './HomeIcon';
import { useRouter } from 'next/navigation';

const OnProcessNavBar = () => {

  const router = useRouter();

  const handleOnClickGoHome= ()=>{
      router.push('/home');
  }
  return (
    <NavBarContainer>
        <GoBackContainer onClick={handleOnClickGoHome}>
          <HomeIcon style={{color: 'white'}}/>
          <Paragraph style={{color: 'white'}}>Return to Home</Paragraph>
        </GoBackContainer>
    </NavBarContainer>
  );
};
export default OnProcessNavBar;
