import React from 'react';
import { Language, Theme } from '../types';
import { translations } from '../constants';
import { SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const LanguageButton: React.FC<{
  lang: Language;
  currentLang: Language;
  onClick: (lang: Language) => void;
  children: React.ReactNode;
}> = ({ lang, currentLang, onClick, children }) => (
  <button
    onClick={() => onClick(lang)}
    className={`px-3 py-1 text-sm rounded-md transition-colors ${
      currentLang === lang
        ? 'bg-[#0017f1] text-white'
        : 'text-zinc-300 dark:text-zinc-400 hover:bg-zinc-700'
    }`}
  >
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ language, setLanguage, theme, setTheme }) => {
  const t = translations[language];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
             <a
              href={t.creatorLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold text-zinc-900 dark:text-white hover:text-[#0017f1] dark:hover:text-blue-400 transition-colors"
            >
              {t.creatorName}
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-zinc-200 dark:bg-zinc-800 rounded-lg p-1 space-x-1">
                <LanguageButton lang="en" currentLang={language} onClick={setLanguage}>EN</LanguageButton>
                <LanguageButton lang="ar" currentLang={language} onClick={setLanguage}>AR</LanguageButton>
                <LanguageButton lang="fr" currentLang={language} onClick={setLanguage}>FR</LanguageButton>
            </div>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950 focus:ring-[#0017f1] transition-colors"
                aria-label={t.toggleTheme}
              >
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;