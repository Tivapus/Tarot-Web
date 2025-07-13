import { Message } from "./Chat.model";
import { PredictionResult } from "./PredictResults.model";

export interface HistoryEntry {
  id: string; 
  mode: string;
  question: string;
  predictionResult: PredictionResult;
  chatHistory: Message[];
}