'use client';

import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { CardType } from '@/models/Card.model';
import { PredictionResult } from '@/models/PredictResults.model';
import { Message } from '@/models/Chat.model';

export type TarotMode = 'daily_life' | 'yes_no' | 'chat_ai' | 'real_chat_ai' | null;

interface TarotContextType {
  isInitialized: boolean;
  mode: TarotMode;
  question: string;
  numCard: number;
  selectedCards: CardType[];
  predictionResult: PredictionResult | null;
  currentSessionId: string;
  updateCurrentSessionId: (id: string) => void;
  updateMode: (mode: TarotMode) => void;
  updateQuestion: (question: string) => void;
  updateNumCard: (num: number) => void;
  updateSelectedCards: (cards: CardType[]) => void;
  updatePredictionResult: (result: PredictionResult | null) => void;
  clearAllState: () => void;
}

const TarotContext = createContext<TarotContextType | null>(null);

interface TarotProviderProps {
  children: ReactNode;
}

export function TarotProvider({ children }: TarotProviderProps) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [mode, setMode] = useState<TarotMode>(null);
  const [question, setQuestion] = useState<string>('');
  const [numCard, setNumCard] = useState<number>(0);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");


  useEffect(() => {
    try {
      const savedMode = sessionStorage.getItem('mode');
      if (savedMode) setMode(JSON.parse(savedMode));
      const savedQuestion = sessionStorage.getItem('question');
      if (savedQuestion) setQuestion(JSON.parse(savedQuestion));
      const savedNumCard = sessionStorage.getItem('numCard');
      if (savedNumCard) setNumCard(JSON.parse(savedNumCard));
      const savedCards = sessionStorage.getItem('cards');
      if (savedCards) setSelectedCards(JSON.parse(savedCards));
      const savedResult = sessionStorage.getItem('predictionResult');
      if (savedResult) setPredictionResult(JSON.parse(savedResult));
    } catch (error) {
      console.error("Error initializing state from sessionStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const updateMode = useCallback((newMode: TarotMode) => {
    setMode(newMode);
    sessionStorage.setItem('mode', JSON.stringify(newMode));
  }, []);

  const updateQuestion = useCallback((newQuestion: string) => {
    setQuestion(newQuestion);
    sessionStorage.setItem('question', JSON.stringify(newQuestion));
  }, []);

  const updateNumCard = useCallback((newNum: number) => {
    setNumCard(newNum);
    sessionStorage.setItem('numCard', JSON.stringify(newNum));
  }, []);

  const updateSelectedCards = useCallback((newCards: CardType[]) => {
    setSelectedCards(newCards);
    sessionStorage.setItem('cards', JSON.stringify(newCards));
  }, []);
  
  const updatePredictionResult = useCallback((newResult: PredictionResult | null) => {
    setPredictionResult(newResult);
    sessionStorage.setItem('predictionResult', JSON.stringify(newResult));
  }, []);

  const updateCurrentSessionId = useCallback((id: string) => {
    setCurrentSessionId(id);
    sessionStorage.setItem('currentSessionId', JSON.stringify(id));
  }, []);

  const clearAllState = useCallback(() => {
    setMode(null);
    sessionStorage.removeItem('mode');
    setQuestion('');
    sessionStorage.removeItem('question');
    setNumCard(0);
    sessionStorage.removeItem('numCard');
    setSelectedCards([]);
    sessionStorage.removeItem('cards');
    setPredictionResult(null);
    sessionStorage.removeItem('predictionResult');
    setCurrentSessionId('');
    sessionStorage.removeItem('currentSessionId');
  }, []);

  const value: TarotContextType = {
    isInitialized,
    mode,
    question,
    numCard,
    selectedCards,
    predictionResult,
    currentSessionId,
    updateCurrentSessionId,
    updateMode,
    updateQuestion,
    updateNumCard,
    updateSelectedCards,
    updatePredictionResult,
    clearAllState
  };

  return <TarotContext.Provider value={value}>{children}</TarotContext.Provider>;
}

export function useTarot(): TarotContextType {
  const context = useContext(TarotContext);
  if (!context) {
    throw new Error('useTarot must be used within a TarotProvider');
  }
  return context;
}