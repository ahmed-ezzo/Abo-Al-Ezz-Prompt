const App: React.FC = () => {
  // --- BEGIN: CODE TO FIX HYDRATION ERROR ---
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  // --- END: CODE TO FIX HYDRATION ERROR ---

  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('dark');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageOptions, setImageOptions] = useState<ImageOptionsState>({
    removeText: false,
    whiteBackground: false,
    blackBackground: false,
    additionalInstructions: '',
  });
  const [generatedResult, setGeneratedResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setGeneratedResult(null);
    setError(null);
    setIsLoading(false);
    setImageOptions({
      removeText: false,
      whiteBackground: false,
      blackBackground: false,
      additionalInstructions: '',
    });
  };

  const handleImageSelect = useCallback((file: File) => {
    handleReset();
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!imageFile) {
      setError(t.errorNoImage);
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedResult(null);
    try {
      const result = await analyzeImage(imageFile, imageOptions);
      setGeneratedResult(result);
    } catch (err) {
        if (err instanceof Error) {
            if (err.message.includes('Invalid API Key')) {
                setError(t.errorInvalidKey);
            } else {
                setError(t.errorGeneric);
            }
        } else {
            setError(t.errorGeneric);
        }
    } finally {
      setIsLoading(false);
    }
  };

  const showLandingContent = !imageFile && !generatedResult && !isLoading;

  return (
    <>
      {isClient && (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 flex flex-col">
          <Header language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            
            {showLandingContent && (
                 <div className="text-center">
                   <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
                       {t.pageTitle}
                   </h1>
                   <p className="mt-4 max-w-3xl mx-auto text-lg text-zinc-600 dark:text-zinc-300">
                       {t.pageSubtitle}
                   </p>
                 </div>
            )}
            
            <div className={`mt-8 grid transition-all duration-500 ${generatedResult ? 'grid-cols-1 lg:grid-cols-2 gap-12 items-start' : 'grid-cols-1'}`}>
                <div className="w-full max-w-2xl mx-auto">
                     <ImageUploader 
                       onImageSelect={handleImageSelect}
                       imagePreview={imagePreview}
                       translations={t}
                     />
                     {imageFile && !generatedResult && !error && (
                          <>
                           <ImageOptions 
                             options={imageOptions}
                             setOptions={setImageOptions}
                             language={language}
                             disabled={isLoading}
                           />
                           <div className="mt-8 text-center">
                               <button
                                   onClick={handleAnalyzeClick}
                                   disabled={isLoading}
                                   className="inline-flex items-center gap-x-2 px-8 py-4 bg-[#0017f1] text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 disabled:bg-zinc-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                               >
                                   {isLoading ? (
                                       <>
                                         <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                                         {t.analyzing}
                                       </>
                                   ) : (
                                       <>
                                         <SparklesIcon className="w-6 h-6" />
                                         {t.analyzeButton}
                                       </>
                                   )}
                               </button>
                           </div>
                         </>
                     )}
                </div>

                {(isLoading || error || generatedResult) && (
                     <div className="mt-8 lg:mt-0">
                       <ResultDisplay 
                         result={generatedResult}
                         isLoading={isLoading}
                         error={error}
                         translations={t}
                       />
                       {(generatedResult || error) && !isLoading && (
                         <div className="mt-8 text-center">
                           <button
                             onClick={handleReset}
                             className="inline-flex items-center gap-x-2 px-6 py-3 bg-zinc-600 dark:bg-zinc-700 text-white font-bold rounded-lg shadow-lg hover:bg-zinc-700 dark:hover:bg-zinc-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-zinc-500 focus:ring-opacity-50"
                           >
                             <ArrowLeftIcon className="w-5 h-5" />
                             {t.goBackButton}
                           </button>
                         </div>
                       )}
                     </div>
                )}
            </div>
            
            {showLandingContent && <HowItWorks translations={t} />}

          </main>
          <Footer language={language} />
        </div>
      )}
    </>
  );
};
export default App;