import { QuestionOption } from '@/types/quiz';
import QuestionRenderer from './QuestionRenderer';

interface AnswerInputProps {
  options: QuestionOption[];
  selectedAnswers: number[];
  multiple: boolean;
  onAnswerChange: (answerIndexes: number[]) => void;
  disabled?: boolean;
}

export default function AnswerInput({ 
  options, 
  selectedAnswers, 
  multiple, 
  onAnswerChange,
  disabled = false 
}: AnswerInputProps) {
  const handleOptionSelect = (optionIndex: number) => {
    if (disabled) return;

    if (multiple) {
      // Multiple choice logic
      let newSelection = [...selectedAnswers];
      if (newSelection.includes(optionIndex)) {
        // Remove if already selected
        newSelection = newSelection.filter(i => i !== optionIndex);
      } else {
        // Add to selection
        newSelection.push(optionIndex);
        newSelection.sort(); // Keep sorted for consistency
      }
      onAnswerChange(newSelection);
    } else {
      // Single choice logic
      onAnswerChange([optionIndex]);
    }
  };

  return (
    <div className="space-y-3">
      {multiple && (
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">
          Select all that apply
        </p>
      )}
      
      {options.map((option, index) => {
        const isSelected = selectedAnswers.includes(index);
        
        return (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            disabled={disabled}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-start space-x-4 ${
              isSelected
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            } ${
              disabled 
                ? 'opacity-60 cursor-not-allowed' 
                : 'cursor-pointer'
            }`}
          >
            {/* Selection Indicator */}
            <div className="flex-shrink-0 mt-1">
              {multiple ? (
                // Checkbox for multiple choice
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300 dark:border-gray-500'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ) : (
                // Radio button for single choice
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300 dark:border-gray-500'
                }`}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
              )}
            </div>

            {/* Option Content */}
            <div className="flex-1 min-w-0">
              <QuestionRenderer 
                content={option.content} 
                className="text-left"
              />
            </div>

            {/* Option Label */}
            <div className="flex-shrink-0">
              <span className="text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {String.fromCharCode(65 + index)} {/* A, B, C, D... */}
              </span>
            </div>
          </button>
        );
      })}
      
      {/* Selection Summary for Multiple Choice */}
      {multiple && selectedAnswers.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Selected {selectedAnswers.length} option{selectedAnswers.length !== 1 ? 's' : ''}: {' '}
            {selectedAnswers.map(i => String.fromCharCode(65 + i)).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
