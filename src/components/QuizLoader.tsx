import { useState, useEffect } from 'react';
import { QuizMetadata } from '@/types/quiz';

interface QuizLoaderProps {
  children: (data: {
    quizSets: QuizMetadata[];
    availableLanguages: string[];
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

export default function QuizLoader({ children }: QuizLoaderProps) {
  const [quizSets, setQuizSets] = useState<QuizMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizData();
  }, []);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load both English and German questions
      const languagesToLoad = ['en', 'de'];
      
      const loadPromises = languagesToLoad.map(async (language) => {
        try {
          const response = await fetch(`questions/questions-${language}.json`);
          if (!response.ok) {
            throw new Error(`Failed to load ${language} questions: ${response.status}`);
          }
          const data: QuizMetadata = await response.json();
          return data;
        } catch (err) {
          console.warn(`Failed to load questions for language: ${language}`, err);
          return null;
        }
      });

      const results = await Promise.all(loadPromises);
      const validQuizSets = results.filter((set): set is QuizMetadata => set !== null);

      if (validQuizSets.length === 0) {
        throw new Error('No quiz data could be loaded');
      }

      setQuizSets(validQuizSets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz data';
      setError(errorMessage);
      console.error('QuizLoader error:', err);
    } finally {
      setLoading(false);
    }
  };

  const availableLanguages = quizSets.map(set => set.language);

  return (
    <>
      {children({
        quizSets,
        availableLanguages,
        loading,
        error
      })}
    </>
  );
}

// Utility functions that can be used by other components
export function getAvailableLanguages(quizSets: QuizMetadata[]): string[] {
  return [...new Set(quizSets.map(set => set.language))];
}

export function getCategoriesForLanguage(quizSets: QuizMetadata[], language: string): string[] {
  const set = quizSets.find(qs => qs.language === language);
  return set ? set.categories : [];
}

export function getFilteredQuestions(
  quizSets: QuizMetadata[], 
  selectedLanguage: string, 
  selectedCategories: string[]
) {
  const set = quizSets.find(qs => qs.language === selectedLanguage);
  if (!set) return [];
  
  if (!selectedCategories.length || selectedCategories.includes("All")) {
    return set.questions;
  }
  
  return set.questions.filter(q =>
    q.categories.some(cat => selectedCategories.includes(cat))
  );
}
