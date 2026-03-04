import { QuizResults } from '@/types/quiz';
import { useTranslation } from '@/hooks/useTranslation';
import QuestionRenderer from './QuestionRenderer';

interface SummaryScreenProps {
  results: QuizResults;
  onRestart: () => void;
  onBackToSetup: () => void;
}

export default function SummaryScreen({ results, onRestart, onBackToSetup }: SummaryScreenProps) {
  const { t } = useTranslation();
  const { totalQuestions, correctAnswers, percentage, timeSpent, answers, questions } = results;
  const timeInMinutes = Math.floor(timeSpent / 1000 / 60);
  const timeInSeconds = Math.floor((timeSpent / 1000) % 60);

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return t('results.excellent');
    if (percentage >= 80) return t('results.veryGood');
    if (percentage >= 70) return t('results.good');
    if (percentage >= 60) return t('results.fair');
    return t('results.needsImprovement');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 text-center">
        <div className="mb-6">
          <div className={`text-6xl font-bold mb-2 ${getPerformanceColor(percentage)}`}>
            {percentage}%
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {t('results.title')}
          </h1>
          <p className={`text-lg ${getPerformanceColor(percentage)}`}>
            {getPerformanceMessage(percentage)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{totalQuestions}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('results.totalQuestions')}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctAnswers}</div>
            <div className="text-sm text-green-600 dark:text-green-400">{t('results.correct')}</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{results.incorrectAnswers}</div>
            <div className="text-sm text-red-600 dark:text-red-400">{t('results.incorrect')}</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {timeInMinutes}:{timeInSeconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">{t('results.timeTaken')}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t('results.takeAnotherQuiz')}
          </button>
          <button
            onClick={onBackToSetup}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t('results.changeSettings')}
          </button>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>{t('results.reviewAnswers')}</span>
        </h2>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer?.isCorrect || false;
            
            return (
              <div 
                key={question.id} 
                className={`p-6 rounded-lg border-2 ${
                  isCorrect 
                    ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800' 
                    : 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <QuestionRenderer 
                        content={question.question.content}
                        className="font-medium"
                      />
                      
                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {question.categories.map((category) => (
                          <span 
                            key={category}
                            className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Result Icon */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Answer Details */}
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  {/* Your Answer */}
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('results.yourAnswer')}</h4>
                    <div className="space-y-1">
                      {userAnswer?.selectedAnswers.length > 0 ? (
                        userAnswer.selectedAnswers.map((answerIndex) => (
                          <div key={answerIndex} className="flex items-start space-x-2">
                            <span className={`w-5 h-5 rounded text-white text-xs font-bold flex items-center justify-center ${
                              question.correctAnswers.includes(answerIndex) ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              {String.fromCharCode(65 + answerIndex)}
                            </span>
                            <div className="flex-1 text-xs">
                              <QuestionRenderer content={question.options[answerIndex].content} />
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">{t('results.noAnswer')}</span>
                      )}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('results.correctAnswer')}</h4>
                    <div className="space-y-1">
                      {question.correctAnswers.map((answerIndex) => (
                        <div key={answerIndex} className="flex items-start space-x-2">
                          <span className="w-5 h-5 bg-green-500 rounded text-white text-xs font-bold flex items-center justify-center">
                            {String.fromCharCode(65 + answerIndex)}
                          </span>
                          <div className="flex-1 text-xs">
                            <QuestionRenderer content={question.options[answerIndex].content} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('results.explanation')}</h4>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <QuestionRenderer content={question.explanation} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
