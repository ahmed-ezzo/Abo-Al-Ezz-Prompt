import React from 'react';
import { translations } from '../constants';
import { Language } from '../types';


interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="w-full mt-auto py-8 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto text-center text-zinc-500 dark:text-zinc-500 text-sm">
        {t.footerText}{' '}
        <a
          href={t.creatorLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#0017f1] hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          {t.creatorName}
        </a>
      </div>
    </footer>
  );
};

export default Footer;