'use client';

import Link from 'next/link';
import { GoBackContainer, NavBarContainer } from '@/styles/NavBarContainer.styled';
import { Paragraph } from '@/styles/Shared.styled';
import HomeIcon from './HomeIcon';

const MainNavBar = () => {
  return (
    <NavBarContainer>
      <Link href="/home" style={{ cursor: 'pointer' }}>
        <GoBackContainer>
          <HomeIcon style={{color: 'white'}}/>
          <Paragraph style={{color: 'white'}}>Return to Home</Paragraph>
        </GoBackContainer>
      </Link>
    </NavBarContainer>
  );
};
export default MainNavBar;
