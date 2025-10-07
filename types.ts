export type Language = 'en' | 'ar' | 'fr';
export type Theme = 'light' | 'dark';

export interface AnalysisResult {
  mainPrompt: string;
  styleKeywords: string[];
  colorPalette: string[];
  alternativePrompts: {
    concise: string;
    poetic: string;
  };
}

export interface ImageOptionsState {
    removeText: boolean;
    whiteBackground: boolean;
    blackBackground: boolean;
    additionalInstructions: string;
}

export interface Translations {
  [key: string]: {
    headerTitle: string;
    creatorName: string;
    creatorLink: string;
    toggleTheme: string;
    pageTitle: string;
    pageSubtitle: string;
    uploadAreaTitle: string;
    uploadAreaSubtitle: string;
    uploadAreaButton: string;
    howItWorksTitle: string;
    step1Title: string;
    step1Description: string;
    step2Title: string;
    step2Description: string;
    step3Title: string;
    step3Description: string;
    analyzeButton: string;
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
    footerText: string;
    errorTitle: string;
    errorInvalidKey: string;
    errorGeneric: string;
    errorNoImage: string;
    editOptionsTitle: string;
    optionRemoveText: string;
    optionWhiteBackground: string;
    optionBlackBackground: string;
    additionalInstructionsTitle: string;
    additionalInstructionsPlaceholder: string;
    goBackButton: string;
  };
}