'use client';

import { NavBarContainer } from '@/styles/NavBarContainer.styled';
import HistoryComponent from './HistoryComponent';

const HomeNavBar = () => {

  return (
    <NavBarContainer style={{justifyContent: 'flex-end'}}>
        <HistoryComponent />
    </NavBarContainer>
  );
};
export default HomeNavBar;
