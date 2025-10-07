import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './icons';
import { AnalysisResult } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  translations: {
    analyzing: string;
    resultTitle: string;
    mainPromptTitle: string;
    styleKeywordsTitle: string;
    colorPaletteTitle: string;
    alternativePromptsTitle: string;
    concisePromptTab: string;
    poeticPromptTab: string;
    copyButton: string;
    copied: string;
    errorTitle: string;
  };
}

const CopyableBlock: React.FC<{title: string, content: string, copyLabel: string, copiedLabel: string}> = ({ title, content, copyLabel, copiedLabel }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-6">
            <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-300">{title}</h4>
            <div className="relative mt-2 p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-inner">
                <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed font-mono text-sm whitespace-pre-wrap">{content}</p>
                <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-[#0017f1] text-zinc-600 dark:text-zinc-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-100 dark:focus:ring-offset-zinc-900 focus:ring-[#0017f1]"
                    aria-label={copyLabel}
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

const ColorPalette: React.FC<{ colors: string[], copyLabel: string, copiedLabel: string }> = ({ colors, copyLabel, copiedLabel }) => {
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const handleCopy = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    return (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
            {colors.map(color => (
                <div key={color} className="group relative">
                    <div
                        className="w-full h-16 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-sm"
                        style={{ backgroundColor: color }}
                    />
                    <button
                        onClick={() => handleCopy(color)}
                        className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                        aria-label={`${copyLabel} ${color}`}
                    >
                        {copiedColor === color ? (
                            <div className="text-center">
                                <CheckIcon className="w-5 h-5 text-green-400 mx-auto"/>
                                <span className="text-xs font-mono text-white">{copiedLabel}</span>
                            </div>
                        ) : (
                             <span className="text-sm font-mono text-white">{color}</span>
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
};

const AlternativePrompts: React.FC<{ prompts: AnalysisResult['alternativePrompts'], t: any }> = ({ prompts, t }) => {
    const [activeTab, setActiveTab] = useState<'concise' | 'poetic'>('concise');

    return (
        <div>
            <div className="border-b border-zinc-200 dark:border-zinc-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('concise')} className={`${activeTab === 'concise' ? 'border-[#0017f1] text-[#0017f1]' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-600'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                        {t.concisePromptTab}
                    </button>
                    <button onClick={() => setActiveTab('poetic')} className={`${activeTab === 'poetic' ? 'border-[#0017f1] text-[#0017f1]' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-600'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                        {t.poeticPromptTab}
                    </button>
                </nav>
            </div>
            <div className="relative mt-2 p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-inner">
                <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed text-sm whitespace-pre-wrap">
                    {activeTab === 'concise' ? prompts.concise : prompts.poetic}
                </p>
            </div>
        </div>
    );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading, error, translations }) => {

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white/50 dark:bg-zinc-900/50 rounded-lg">
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#0017f1]"></div>
        <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">{translations.analyzing}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 dark:bg-red-900/30 border border-red-500 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-red-600 dark:text-red-400">{translations.errorTitle}</h3>
        <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="w-full">
        <div className="space-y-8">
            <CopyableBlock 
                title={translations.mainPromptTitle} 
                content={result.mainPrompt} 
                copyLabel={translations.copyButton}
                copiedLabel={translations.copied}
            />

            <div>
                <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-300">{translations.styleKeywordsTitle}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                    {result.styleKeywords.map(keyword => (
                        <span key={keyword} className="px-3 py-1 text-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full">
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-300">{translations.colorPaletteTitle}</h4>
                 <ColorPalette colors={result.colorPalette} copyLabel={translations.copyButton} copiedLabel={translations.copied} />
            </div>
            
            <div>
                 <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-300">{translations.alternativePromptsTitle}</h4>
                <AlternativePrompts prompts={result.alternativePrompts} t={translations} />
            </div>
        </div>
    </div>
  );
};

export default ResultDisplay;