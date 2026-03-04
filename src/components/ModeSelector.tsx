import { QuizMode } from '@/types/quiz';
import { useTranslation } from '@/hooks/useTranslation';

interface ModeSelectorProps {
  onModeSelect: (mode: QuizMode) => void;
  selectedMode?: QuizMode;
}

export default function ModeSelector({ onModeSelect, selectedMode }: ModeSelectorProps) {
  const { t } = useTranslation();
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        {t('modes.title')}
      </h2>
      
      <div className="space-y-4">
        <button
          onClick={() => onModeSelect('practice')}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
            selectedMode === 'practice'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
          }`}
        >
          <div className={`flex items-start ${selectedMode === 'practice' ? 'space-x-3' : ''}`}>
            {selectedMode === 'practice' && (
              <div className="w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center border-blue-500 bg-blue-500">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t('modes.practice.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {t('modes.practice.description')}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onModeSelect('exam')}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
            selectedMode === 'exam'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-900/10'
          }`}
        >
          <div className={`flex items-start ${selectedMode === 'exam' ? 'space-x-3' : ''}`}>
            {selectedMode === 'exam' && (
              <div className="w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center border-green-500 bg-green-500">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t('modes.exam.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {t('modes.exam.description')}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
