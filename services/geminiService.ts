import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ImageOptionsState } from "../types";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeImage = async (imageFile: File, options: ImageOptionsState): Promise<AnalysisResult> => {
  // --- FINAL DEBUG LINE ---
  // This will show us exactly what the API key value is on the live site.
  console.log("Attempting to use API Key:", import.meta.env.VITE_API_KEY);

  try {
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey || apiKey === "") {
      throw new Error("VITE_API_KEY is not defined or is empty in the environment.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const imagePart = await fileToGenerativePart(imageFile);

    // Using a shorter, simpler prompt for final debugging
    let userInstructions = `Describe this image in detail.`;
    
    const genAI = new GoogleGenAI({ apiKey: apiKey });
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const result = await model.generateContent([userInstructions, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // For this final test, we'll just return the raw text
    // This simplifies things and removes JSON parsing as a source of error
    const dummyResult: AnalysisResult = {
        mainPrompt: text,
        styleKeywords: ["debug"],
        colorPalette: ["#000000"],
        alternativePrompts: {
            concise: "debug",
            poetic: "debug"
        }
    };
    return dummyResult;

  } catch (error) {
    // This will now catch ANY error that happens in the function
    console.error("!!! FINAL DEBUG - ERROR CAUGHT:", error);
    throw error;
  }
};