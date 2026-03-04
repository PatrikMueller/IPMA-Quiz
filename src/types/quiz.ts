// Core data types for IPMA-Quiz application

export interface RichTextContent {
  type: 'text' | 'image' | 'video';
  value?: string;
  src?: string;
  alt?: string;
  caption?: string;
}

export interface RichTextQuestion {
  type: 'rich-text';
  content: RichTextContent[];
}

export interface TextQuestion {
  type: 'text';
  content: RichTextContent[];
}

export interface QuestionOption {
  type: 'rich-text' | 'text';
  content: RichTextContent[];
}

export interface QuestionData {
  id: string;
  categories: string[];
  question: RichTextQuestion | TextQuestion;
  options: QuestionOption[];
  multiple: boolean;
  correctAnswers: number[];
  explanation: RichTextContent[];
}

export interface QuizMetadata {
  language: string;
  categories: string[];
  title: string;
  questions: QuestionData[];
}

export interface UserAnswer {
  questionId: string;
  selectedAnswers: number[];
  isCorrect: boolean;
  timeSpent?: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: UserAnswer[];
  mode: 'practice' | 'exam';
  selectedLanguage: string;
  selectedCategories: string[];
  questions: QuestionData[];
  isCompleted: boolean;
  startTime: number;
}

export interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  timeSpent: number;
  answers: UserAnswer[];
  questions: QuestionData[];
}

export type QuizMode = 'practice' | 'exam';
