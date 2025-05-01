import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();

  // Language labels for display
  const languageLabels = {
    en: 'English',
    fr: 'Français'
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center cursor-pointer">
        <div className="dropdown">
          <button className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none">
            <FaGlobe className="mr-1 h-5 w-5" />
            <span className="hidden md:inline">{languageLabels[language]}</span>
          </button>
          <div className="dropdown-content absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
            <div className="py-1">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    language === lang ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {languageLabels[lang] || lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile-friendly dropdown that actually works without hover */}
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
        aria-label="Select language"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {languageLabels[lang] || lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
