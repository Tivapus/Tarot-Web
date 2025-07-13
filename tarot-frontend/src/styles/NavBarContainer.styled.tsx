import { styled } from '@mui/material/styles';

export const NavBarContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 40px;
  height: 60px;
  background-color: transparent;
`;

export const GoBackContainer = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
`;
