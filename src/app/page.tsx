'use client';

import { useState, useEffect } from 'react';
import { QuizMode, QuestionData, QuizResults } from '@/types/quiz';
import QuizLoader, { getCategoriesForLanguage, getFilteredQuestions } from '@/components/QuizLoader';
import ModeSelector from '@/components/ModeSelector';
import CategorySelector from '@/components/CategorySelector';
import QuizManager from '@/components/QuizManager';
import SummaryScreen from '@/components/SummaryScreen';
import { TranslationProvider, useTranslation } from '@/hooks/useTranslation';

type AppState = 'loading' | 'mode-selection' | 'category-selection' | 'quiz-active' | 'results';

function QuizApp() {
  const { t } = useTranslation();
  const [appState, setAppState] = useState<AppState>('mode-selection');
  const [selectedMode, setSelectedMode] = useState<QuizMode>();
  const [selectedLanguage] = useState<string>('en'); // Always English
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuestionData[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResults>();
  const [quizSets, setQuizSets] = useState<any[]>([]);

  const resetToSetup = () => {
    setAppState('mode-selection');
    setSelectedMode(undefined);
    setSelectedCategories([]);
    setQuizQuestions([]);
    setQuizResults(undefined);
  };

  const restartQuiz = () => {
    setAppState('quiz-active');
    setQuizResults(undefined);
  };

  const handleModeSelect = (mode: QuizMode) => {
    setSelectedMode(mode);
    setAppState('category-selection');
  };

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleStartQuiz = (quizSets: any[]) => {
    if (!selectedLanguage) return;
    
    const questions = getFilteredQuestions(quizSets, selectedLanguage, selectedCategories);
    if (questions.length === 0) {
      alert(t('errors.noQuestions'));
      return;
    }
    
    setQuizQuestions(questions);
    setAppState('quiz-active');
  };

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setAppState('results');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  {t('header.title')}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('header.subtitle')}
                </p>
              </div>
            </div>
            
            {appState !== 'loading' && (
              <button
                onClick={resetToSetup}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{t('header.startOver')}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8">
        <QuizLoader>
          {({ quizSets, availableLanguages, loading, error }) => {
            if (loading) {
              return (
                <div className="flex items-center justify-center min-h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">{t('loading.loadingQuizData')}</p>
                  </div>
                </div>
              );
            }

            if (error) {
              return (
                <div className="flex items-center justify-center min-h-96">
                  <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">{t('errors.errorLoadingQuiz')}</h2>
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t('errors.retry')}
                    </button>
                  </div>
                </div>
              );
            }

            // Handle different app states
            switch (appState) {
              case 'mode-selection':
                return (
                  <div className="container mx-auto px-6">
                    <ModeSelector
                      onModeSelect={handleModeSelect}
                      selectedMode={selectedMode}
                    />
                  </div>
                );

              case 'category-selection':
                if (!selectedLanguage) {
                  setTimeout(() => setAppState('mode-selection'), 0);
                  return null;
                }
                const availableCategories = getCategoriesForLanguage(quizSets, selectedLanguage);
                
                return (
                  <div className="container mx-auto px-6">
                    <CategorySelector
                      availableCategories={availableCategories}
                      selectedCategories={selectedCategories}
                      onCategoriesChange={handleCategoriesChange}
                      onStartQuiz={() => handleStartQuiz(quizSets)}
                    />
                  </div>
                );

              case 'quiz-active':
                if (!selectedMode || !selectedLanguage || quizQuestions.length === 0) {
                  setTimeout(() => setAppState('mode-selection'), 0);
                  return null;
                }
                
                return (
                  <QuizManager
                    questions={quizQuestions}
                    mode={selectedMode}
                    selectedLanguage={selectedLanguage}
                    selectedCategories={selectedCategories}
                    onQuizComplete={handleQuizComplete}
                    onBackToSetup={resetToSetup}
                  />
                );

              case 'results':
                if (!quizResults) {
                  setTimeout(() => setAppState('mode-selection'), 0);
                  return null;
                }
                
                return (
                  <SummaryScreen
                    results={quizResults}
                    onRestart={restartQuiz}
                    onBackToSetup={resetToSetup}
                  />
                );

              default:
                return (
                  <div className="text-center py-8">
                    <p className="text-red-600">{t('errors.unknownState')} {appState}</p>
                    <button
                      onClick={resetToSetup}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {t('errors.reset')}
                    </button>
                  </div>
                );
            }
          }}
        </QuizLoader>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <TranslationProvider>
      <QuizApp />
    </TranslationProvider>
  );
}
