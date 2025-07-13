'use client';

import { Fab, Drawer, Box, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ChatBotComponent from './Chatbot';
import { useResults } from '@/contexts/ResultsContext.context';

export default function ChatDrawer() {
  const { isChatOpen, setIsChatOpen } = useResults();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsChatOpen(open);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={toggleDrawer(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        style={{backgroundColor:'rgba(72, 81, 129)'}}
      >
        <ChatIcon/>
      </Fab>

      <Drawer
        anchor="right"
        open={isChatOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#121212',
            color: '#E1E1E1',
          },
        }}
      >
        <Box
          sx={{
            width: 'clamp(320px, 90vw, 600px)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <ChatBotComponent />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}