import { useTranslation } from '@/hooks/useTranslation';

interface CategorySelectorProps {
  availableCategories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  onStartQuiz: () => void;
}

export default function CategorySelector({ 
  availableCategories, 
  selectedCategories, 
  onCategoriesChange,
  onStartQuiz 
}: CategorySelectorProps) {
  const { t } = useTranslation();
  const handleCategoryToggle = (category: string) => {
    if (category === "All") {
      // Toggle all categories
      if (selectedCategories.includes("All")) {
        onCategoriesChange([]);
      } else {
        onCategoriesChange(["All", ...availableCategories]);
      }
      return;
    }

    let newSelection = [...selectedCategories];
    
    if (newSelection.includes(category)) {
      // Remove category
      newSelection = newSelection.filter(c => c !== category);
      // Also remove "All" if it was selected
      newSelection = newSelection.filter(c => c !== "All");
    } else {
      // Add category
      newSelection.push(category);
      // If all categories are now selected, add "All"
      if (newSelection.length === availableCategories.length) {
        newSelection = ["All", ...availableCategories];
      }
    }
    
    onCategoriesChange(newSelection);
  };

  const isAllSelected = selectedCategories.includes("All");
  const canStartQuiz = selectedCategories.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">
        {t('categories.title')}
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        {t('categories.subtitle')}
      </p>
      
      <div className="space-y-3 mb-6">
        {/* All Categories Option */}
        <button
          onClick={() => handleCategoryToggle("All")}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center space-x-3 ${
            isAllSelected
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
          }`}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            isAllSelected 
              ? 'border-purple-500 bg-purple-500' 
              : 'border-gray-300 dark:border-gray-500'
          }`}>
            {isAllSelected && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('categories.all')}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            ({availableCategories.length} categories)
          </span>
        </button>

        {/* Individual Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableCategories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left flex items-center space-x-3 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300 dark:border-gray-500'
                }`}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Summary */}
      {selectedCategories.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">{t('categories.selected')}:</span>{' '}
            {isAllSelected 
              ? t('categories.all')
              : selectedCategories.filter(c => c !== 'All').join(', ')
            }
          </p>
        </div>
      )}

      {/* Start Quiz Button */}
      <button
        onClick={onStartQuiz}
        disabled={!canStartQuiz}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
          canStartQuiz
            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
      >
        {canStartQuiz ? t('categories.startQuiz') : t('categories.selectAtLeastOne')}
      </button>
    </div>
  );
}
