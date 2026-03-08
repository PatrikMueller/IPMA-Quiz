import { QuestionData } from '@/types/quiz';
import { useTranslation } from '@/hooks/useTranslation';
import QuestionRenderer from './QuestionRenderer';

interface FeedbackPanelProps {
  question: QuestionData;
  userAnswer: number[];
  onNext: () => void;
  isLastQuestion: boolean;
}

export default function FeedbackPanel({ 
  question, 
  userAnswer, 
  onNext, 
  isLastQuestion 
}: FeedbackPanelProps) {
  const { t } = useTranslation();
  const isCorrect = checkAnswerCorrectness(userAnswer, question.correctAnswers);
  const correctAnswerLabels = question.correctAnswers.map(i => String.fromCharCode(65 + i));
  const userAnswerLabels = userAnswer.map(i => String.fromCharCode(65 + i));

  function checkAnswerCorrectness(selectedAnswers: number[], correctAnswers: number[]): boolean {
    if (selectedAnswers.length !== correctAnswers.length) {
      return false;
    }
    const sortedSelected = [...selectedAnswers].sort();
    const sortedCorrect = [...correctAnswers].sort();
    return sortedSelected.every((answer, index) => answer === sortedCorrect[index]);
  }

  return (
    <div className={`mt-8 p-6 rounded-lg border-2 ${
      isCorrect 
        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
        : 'border-red-500 bg-red-50 dark:bg-red-900/20'
    }`}>
      {/* Result Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isCorrect ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {isCorrect ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div>
          <h3 className={`text-lg font-bold ${
            isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
          }`}>
            {isCorrect ? t('feedback.correct') : t('feedback.incorrect')}
          </h3>
          <p className={`text-sm ${
            isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
          }`}>
            {isCorrect 
              ? t('feedback.correctDescription')
              : t('feedback.incorrectDescription')
            }
          </p>
        </div>
      </div>

      {/* Answer Comparison */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Your Answer */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{t('feedback.yourAnswer')}</h4>
          <div className="space-y-2">
            {userAnswer.length > 0 ? (
              userAnswer.map((answerIndex, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <span className={`flex-shrink-0 w-6 h-6 rounded text-white text-sm font-bold flex items-center justify-center ${
                    question.correctAnswers.includes(answerIndex) ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {String.fromCharCode(65 + answerIndex)}
                  </span>
                  <div className="flex-1">
                    <QuestionRenderer 
                      content={question.options[answerIndex].content} 
                      className="text-sm"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">{t('feedback.noAnswer')}</p>
            )}
          </div>
        </div>

        {/* Correct Answer */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{t('feedback.correctAnswer')}</h4>
          <div className="space-y-2">
            {question.correctAnswers.map((answerIndex, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded text-white text-sm font-bold flex items-center justify-center">
                  {String.fromCharCode(65 + answerIndex)}
                </span>
                <div className="flex-1">
                  <QuestionRenderer 
                    content={question.options[answerIndex].content} 
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation */}
      {question.explanation && question.explanation.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('feedback.explanation')}</span>
          </h4>
          <QuestionRenderer content={question.explanation} />
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isLastQuestion ? t('feedback.viewResults') : t('feedback.nextQuestion')} →
        </button>
      </div>
    </div>
  );
}
