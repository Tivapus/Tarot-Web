'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, ListItemText, Button, Menu, MenuItem } from '@mui/material';
import { useHistory } from '@/contexts/HistoryContext.context';
import { useTarot } from '@/contexts/TarotContext.context';
import HistoryIcon from '@mui/icons-material/History';

export default function HistoryComponent() {
  const router = useRouter();
  const { history } = useHistory();
  const { currentSessionId, updateCurrentSessionId, updatePredictionResult, updateMode, updateQuestion } = useTarot();

  const [isOpen, setIsOpen] = useState<null | HTMLElement>(null);
  const open = Boolean(isOpen);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setIsOpen(event.currentTarget);
  };
  const handleClose = () => {
    setIsOpen(null);
  };

  const handleSelectHistory = (entry: any) => {
    updateCurrentSessionId(entry.id);
    updatePredictionResult(entry.predictionResult);
    updateMode(entry.mode);
    updateQuestion(entry.question);
    handleClose();
    router.push('/results');
  };
  
  return (
    <Box>
      <Button
        id="history-button"
        aria-controls={open ? 'history-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
        style={{backgroundColor: '#BB86FC', color: '#ffffff'}}
        startIcon={<HistoryIcon />}
      >
        ประวัติการดูดวง
      </Button>

      <Menu
        id="history-menu"
        anchorEl={isOpen}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'history-button',
        }}
      >
        {history.length === 0 ? (
          <MenuItem disabled>ไม่มีประวัติการดูดวง</MenuItem>
        ) : (
          history.map((entry) => (
            <MenuItem 
              key={entry.id} 
              onClick={() => handleSelectHistory(entry)}
              selected={currentSessionId === entry.id}
            >
              <ListItemText
                primary={entry.question ? `ถาม-ตอบ: ${entry.question}` : 'ดูดวงรายวัน'}
                secondary={`เมื่อ: ${new Date(parseInt(entry.id.split('-')[1])).toLocaleString('th-TH')}`}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
}