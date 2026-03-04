import { useTranslation } from '@/hooks/useTranslation';

interface LanguageSelectorProps {
  availableLanguages: string[];
  selectedLanguage?: string;
  onLanguageSelect: (language: string) => void;
}

const languageNames: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
};

export default function LanguageSelector({ 
  availableLanguages, 
  selectedLanguage, 
  onLanguageSelect 
}: LanguageSelectorProps) {
  const { t } = useTranslation();
  
  // If only one language available, auto-select it
  if (availableLanguages.length === 1 && !selectedLanguage) {
    setTimeout(() => onLanguageSelect(availableLanguages[0]), 0);
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        {t('language.title')}
      </h2>
      
      <div className="space-y-3">
        {availableLanguages.map((language) => (
          <button
            key={language}
            onClick={() => onLanguageSelect(language)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center justify-between ${
              selectedLanguage === language
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedLanguage === language 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300 dark:border-gray-500'
              }`}>
                {selectedLanguage === language && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
              <span className="text-lg font-medium text-gray-800 dark:text-white">
                {languageNames[language] || language.toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">
              {language}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
