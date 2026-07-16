export type ArticleCat = "bien-etre" | "mindset" | "methode";

export interface DayForecast {
  date: Date;
  code: number;
  maxTemp: number;
  minTemp: number;
  precipProb: number;
  windMax: number;
  hourlyTemps?: number[];
}

export interface WeatherData {
  currentTemp: number;
  currentCode: number;
  windSpeed: number;
  cityName: string;
  lat?: number;
  lon?: number;
  forecast7: DayForecast[];
}

export interface NewsArticle {
  id?: string;
  img: string | null;
  imgAlt: string;
  emoji: string;
  date: string;
  dateSort: number;
  title: string;
  desc: string;
  cat: ArticleCat;
  catLabel: string;
  likes: number;
  readMin: number;
  paragraphs: { text: string; imgEmoji?: string; imgLabel?: string }[];
}
