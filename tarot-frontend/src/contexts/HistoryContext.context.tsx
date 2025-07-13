'use client';

import { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Message } from '@/models/Chat.model';
import { PredictionResult } from '@/models/PredictResults.model';
import { HistoryEntry } from '@/models/History.model';

interface HistoryContextType {
  history: HistoryEntry[];
  addNewHistoryEntry: (newResult: PredictionResult, mode: string, question: string) => string;
  updateChatForEntry: (historyId: string, newChatHistory: Message[]) => void;
}

const HistoryContext = createContext<HistoryContextType | null>(null);

interface HistoryProviderProps {
  children: ReactNode;
}

export function HistoryProvider({ children }: HistoryProviderProps) {
  const HISTORY_KEY = 'tarotHistoryLog'; 

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
        console.error("Error reading history from localStorage:", error);
    }
  }, []);

  const addNewHistoryEntry = useCallback((newResult: PredictionResult, mode: string, question: string) => {
    const newEntry: HistoryEntry = {
        id: `tarot-${Date.now()}`,
        mode,
        question,
        predictionResult: newResult,
        chatHistory: [],
    };
    
    setHistory(prevHistory => {
      const updatedHistory = [newEntry, ...prevHistory].slice(0, 3);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    });

    return newEntry.id;
  }, []);

  const updateChatForEntry = useCallback((historyId: string, newChatHistory: Message[]) => {
    setHistory(prevHistory => {
      const updatedHistory = prevHistory.map(entry => {
        if (entry.id === historyId) {
          return { ...entry, chatHistory: newChatHistory };
        }
        return entry;
      });
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, []);

  const value: HistoryContextType = {
    history,
    addNewHistoryEntry,
    updateChatForEntry,
  };

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory(): HistoryContextType {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}