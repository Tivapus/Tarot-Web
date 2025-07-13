import { styled } from '@mui/material/styles';
import { Button, Box, Typography } from '@mui/material';

export interface MessageProps {
  isModel: boolean;
}

export const darkColors = {
  background: '#121212',
  surface: '#1e1e1e',
  primary: '#BB86FC', 
  userBubble: '#03DAC5', 
  modelBubble: '#2e2e2e',
  textPrimary: '#E1E1E1',
  textSecondary: '#A8A8A8',
  border: '#333333',
};

export const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '8px',
  backgroundColor: darkColors.background, 
});

export const Title = styled(Typography)({
  marginBottom: '16px',
  textAlign: 'center',
  color: darkColors.textPrimary, 
});

export const HistoryContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  marginBottom: '16px',
  padding: '12px',
  backgroundColor: darkColors.surface, 
  borderRadius: '8px',
});

export const MessageWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isModel',
})(({ isModel }: MessageProps) => ({
  display: 'flex',
  marginBottom: '12px',
  justifyContent: isModel ? 'flex-start' : 'flex-end',
}));

export const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isModel',
})(({ isModel }: MessageProps) => ({
  padding: '12px',
  borderRadius: '12px',
  maxWidth: '32rem',
  backgroundColor: isModel ? darkColors.modelBubble : darkColors.userBubble,
  color: isModel ? darkColors.textPrimary : '#000000',
  '& .prose': {
    color: 'inherit',
    fontSize: '0.9rem',
  },
}));

export const TypingIndicator = styled(Typography)({
  color: darkColors.textSecondary,
  paddingLeft: '8px',
});

export const InputWrapper = styled(Box)({
  display: 'flex',
});

export const StyledInput = styled('input')({
  width: '100%',
  border: `1px solid ${darkColors.border}`,
  padding: '10px',
  borderTopLeftRadius: '8px',
  borderBottomLeftRadius: '8px',
  borderRight: 'none',
  color: darkColors.textPrimary,
  backgroundColor: darkColors.surface,
  '&:focus': {
    outline: 'none',
    borderColor: darkColors.primary,
  },
});

export const StyledButton = styled(Button)({
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  borderRadius: '0 8px 8px 0',
  backgroundColor: darkColors.primary,
  color: '#000000',
  '&:hover': {
    backgroundColor: '#9e6ed4',
  },
});