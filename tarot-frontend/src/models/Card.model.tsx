export interface CardType {
  name: string;
  number: number;
  arcana: string;
  suit: string | null;
  png: string;
  keywords_upright: string[];
  keywords_reversed: string[];
  meaning_upright: string;
  meaning_reversed: string;
}