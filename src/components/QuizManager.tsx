import { useState, useEffect } from 'react';
import { QuestionData, QuizMode, UserAnswer, QuizResults } from '@/types/quiz';
import { useTranslation } from '@/hooks/useTranslation';
import QuestionRenderer from './QuestionRenderer';
import AnswerInput from './AnswerInput';
import FeedbackPanel from './FeedbackPanel';

interface QuizManagerProps {
  questions: QuestionData[];
  mode: QuizMode;
  selectedLanguage: string;
  selectedCategories: string[];
  onQuizComplete: (results: QuizResults) => void;
  onBackToSetup: () => void;
}

export default function QuizManager({ 
  questions, 
  mode, 
  selectedLanguage,
  selectedCategories,
  onQuizComplete,
  onBackToSetup 
}: QuizManagerProps) {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswered = currentAnswer.length > 0;

  // Shuffle questions on mount
  const [shuffledQuestions] = useState(() => {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const checkAnswerCorrectness = (selectedAnswers: number[], correctAnswers: number[]): boolean => {
    if (selectedAnswers.length !== correctAnswers.length) {
      return false;
    }
    const sortedSelected = [...selectedAnswers].sort();
    const sortedCorrect = [...correctAnswers].sort();
    return sortedSelected.every((answer, index) => answer === sortedCorrect[index]);
  };

  const handleAnswerSubmit = () => {
    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = checkAnswerCorrectness(currentAnswer, currentQuestion.correctAnswers);
    
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswers: currentAnswer,
      isCorrect,
      timeSpent
    };

    const newAnswers = [...answers, userAnswer];
    setAnswers(newAnswers);

    if (mode === 'practice') {
      setShowFeedback(true);
    } else {
      // Exam mode - go directly to next question
      proceedToNext(newAnswers);
    }
  };

  const proceedToNext = (currentAnswers = answers) => {
    if (isLastQuestion) {
      // Quiz completed
      const totalTime = Date.now() - startTime;
      const correctCount = currentAnswers.filter(a => a.isCorrect).length;
      
      const results: QuizResults = {
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        incorrectAnswers: questions.length - correctCount,
        percentage: Math.round((correctCount / questions.length) * 100),
        timeSpent: totalTime,
        answers: currentAnswers,
        questions: shuffledQuestions
      };
      
      onQuizComplete(results);
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer([]);
      setShowFeedback(false);
    }
  };

  const handleNextQuestion = () => {
    proceedToNext();
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 dark:text-red-400">
          {t('errors.noQuestionsAvailable')}
        </div>
        <button 
          onClick={onBackToSetup}
          className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {t('quiz.backToSetup')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Quiz Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBackToSetup}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              ← {t('quiz.backToSetup')}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {mode === 'practice' ? t('quiz.practiceMode') : t('quiz.examMode')} • {selectedLanguage.toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('quiz.question')} {currentQuestionIndex + 1} {t('quiz.of')} {questions.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        {/* Question */}
        <div className="mb-8">
          <div className="flex items-start space-x-3 mb-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              Q
            </span>
            <div className="flex-1">
              <QuestionRenderer 
                content={currentQuestion.question.content}
                className="text-lg"
              />
            </div>
          </div>
          
          {/* Question Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {currentQuestion.categories.map((category) => (
              <span 
                key={category}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Answer Options */}
        <div className="mb-8">
          <AnswerInput
            options={currentQuestion.options}
            selectedAnswers={currentAnswer}
            multiple={currentQuestion.multiple}
            onAnswerChange={setCurrentAnswer}
            disabled={showFeedback}
          />
        </div>

        {/* Feedback Panel (Practice Mode) */}
        {showFeedback && mode === 'practice' && (
          <FeedbackPanel
            question={currentQuestion}
            userAnswer={currentAnswer}
            onNext={handleNextQuestion}
            isLastQuestion={isLastQuestion}
          />
        )}

        {/* Action Buttons */}
        {!showFeedback && (
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleAnswerSubmit}
              disabled={!hasAnswered}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                hasAnswered
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {mode === 'practice' ? t('quiz.submitAnswer') : (isLastQuestion ? t('quiz.finishQuiz') : t('quiz.nextQuestion'))}
            </button>
          </div>
        )}
      </div>

      {/* Quiz Info */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex justify-between items-center">
          <span>{t('quiz.categories')}: {selectedCategories.includes('All') ? t('quiz.all') : selectedCategories.join(', ')}</span>
          <span>{t('quiz.time')}: {Math.floor((Date.now() - startTime) / 1000 / 60)}:{String(Math.floor((Date.now() - startTime) / 1000) % 60).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}
