'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

interface ResultsContextType {
  isChatOpen: boolean;
  setIsChatOpen: (t : boolean) => void;
}

const ResultsContext = createContext<ResultsContextType | null>(null);

interface ResultsProviderProps {
  children: ReactNode;
}

export function ResultsProvider({ children }: ResultsProviderProps) {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const value: ResultsContextType = {
    isChatOpen,
    setIsChatOpen,
  };

  return <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>;
}

export function useResults(): ResultsContextType {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
}