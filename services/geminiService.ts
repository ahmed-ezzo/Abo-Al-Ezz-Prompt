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
      throw new Error("VITE_API_KEY environment variable not set");
    }

    // --- THIS IS THE CORRECTED PART ---
    // 1. Correctly instantiate the main class
    const genAI = new GoogleGenerativeAI(apiKey); 
    // 2. Get the specific model from that instance
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    // --- END OF CORRECTION ---
    
    const imagePart = await fileToGenerativePart(imageFile);

    let userInstructions = `Analyze the provided image to serve as a creative assistant for a designer. The goal is to deconstruct the image's artistic elements into a structured, actionable format. The output must be a valid JSON object.
    Perform the following analysis:
    1.  **Main Prompt**: Generate a highly detailed, artistic description in English...
    2.  **Style Keywords**: Extract a list of 5-10 specific keywords...
    3.  **Color Palette**: Identify the 6 most dominant colors...
    4.  **Alternative Prompts**: Create two alternative versions...`;
    
    // (Your user instructions logic for options can be added back here if needed)

    const result = await model.generateContent([userInstructions, imagePart]);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json|```/g, "").trim();
    const jsonResponse = JSON.parse(cleanedText);
    return jsonResponse;

  } catch (error) {
    console.error("Error during Gemini API call:", error);
    throw error;
  }
};