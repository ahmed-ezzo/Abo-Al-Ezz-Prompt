import { GoogleGenerativeAI } from "@google/genai";
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
  try {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_API_KEY is not configured. Check Vercel environment variables.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = `Analyze this image in detail and provide a structured JSON output with keys: "mainPrompt", "styleKeywords", "colorPalette", and "alternativePrompts". Be artistic and descriptive.`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json|```/g, "").trim();
    const jsonResponse = JSON.parse(cleanedText);
    return jsonResponse;

  } catch (error) {
    console.error("CRITICAL ERROR in analyzeImage:", error);
    throw error;
  }
};