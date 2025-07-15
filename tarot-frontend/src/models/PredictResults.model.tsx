export interface cardsResultsType{
  card_name: string;
  position: string;
  meaning: string;
  time_frame: string;
}

export interface PredictionResult {
  cards?: cardsResultsType[];
  summary?: string;
  stock_recommendation?: any;
  follow_up_questions?: string[];
  disclaimer?: string;
  question?: string;
  card?: any;
}