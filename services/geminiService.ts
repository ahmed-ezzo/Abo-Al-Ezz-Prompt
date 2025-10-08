import { GoogleGenerativeAI } from "@google/genai";
import { AnalysisResult, ImageOptionsState } from "../types";

// This function converts the file to a format Google's API can understand
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
  // Log to confirm the correct function is running
  console.log("Running the definitive, final version of analyzeImage function...");

  try {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_API_KEY was not found. Check Vercel environment variables.");
    }

    // 1. Correctly create the GoogleGenerativeAI instance
    const genAI = new GoogleGenerativeAI(apiKey);

    // 2. Specify the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // 3. Prepare the image and a simple prompt for the final test
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = "Describe this image in detail for an artist.";

    // 4. Call the API
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log("SUCCESS! Received response from Gemini:", text);

    // 5. Return a simplified result to avoid any other errors
    return {
      mainPrompt: text,
      styleKeywords: ["Success", "Final Test"],
      colorPalette: ["#00FF00"],
      alternativePrompts: {
        concise: "It worked.",
        poetic: "The journey is finally over."
      }
    };

  } catch (error) {
    console.error("!!! THIS IS THE ABSOLUTE FINAL ERROR CATCH:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
    }
    throw error;
  }
};