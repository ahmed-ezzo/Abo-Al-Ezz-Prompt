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
  // THIS IS THE CORRECT WAY TO GET THE API KEY IN VITE
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const imagePart = await fileToGenerativePart(imageFile);

    let userInstructions = `Analyze the provided image...`; // Your detailed instructions here

    // ... all your if-conditions for options ...

    const responseSchema = {
        // ... your full schema object
    };

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: { parts: [imagePart, { text: userInstructions }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
    });

    const jsonText = response.text.replace(/```json\n?/, '').replace(/```$/, '');
    const parsedResult = JSON.parse(jsonText) as AnalysisResult;

    if(parsedResult.mainPrompt){
        return parsedResult;
    } else {
        throw new Error("Received incomplete data from the AI model.");
    }

  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error('Invalid API Key');
    }
    throw new Error("Failed to get a valid response from the AI model.");
  }
};