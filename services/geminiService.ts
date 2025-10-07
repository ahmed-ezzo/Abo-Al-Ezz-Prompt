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
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = await fileToGenerativePart(imageFile);

  let userInstructions = `Analyze the provided image to serve as a creative assistant for a designer. The goal is to deconstruct the image's artistic elements into a structured, actionable format. The output must be a valid JSON object.

  Perform the following analysis:
  1.  **Main Prompt**: Generate a highly detailed, artistic description in English suitable for a text-to-image AI generator. This is the primary, comprehensive prompt. It must be a single paragraph capturing the original image's essence with the highest possible quality and photorealistic detail. Meticulously describe every visual aspect including: art style, subject, composition, framing, lighting, color palette, mood, and camera angle. The description must reflect the original color scheme. Do not generate a black and white description unless the source image is monochrome or specifically requested.
  2.  **Style Keywords**: Extract a list of 5-10 specific keywords and short phrases that define the image's artistic style. Examples: "Impressionism", "Cinematic Lighting", "Shallow Depth of Field", "Matte Painting", "by Greg Rutkowski".
  3.  **Color Palette**: Identify the 6 most dominant and representative colors from the image. Provide them as an array of HEX color codes (e.g., "#FFFFFF").
  4.  **Alternative Prompts**: Create two alternative versions of the main prompt:
      a.  **Concise**: A shorter, more direct prompt (1-2 sentences) that captures the core subject and style.
      b.  **Poetic**: A more evocative, artistic, and abstract description (1-2 sentences) focusing on the mood and feeling of the image.
  `;

  if (options.removeText) {
    userInstructions += "\n- USER OPTION: The description must not include any text, letters, or numbers. Describe the scene as if no text exists in the image.";
  }
  if (options.whiteBackground) {
    userInstructions += "\n- USER OPTION: The description must portray the subject against a solid, clean, pure white background, completely ignoring the original background.";
  } else if (options.blackBackground) {
    userInstructions += "\n- USER OPTION: The description must portray the subject against a solid, deep, pure black background, completely ignoring the original background.";
  }
  if (options.additionalInstructions) {
    userInstructions += `\n- USER INSTRUCTIONS: The user has provided the following specific instructions that you must follow carefully and integrate into all generated prompts: "${options.additionalInstructions}".`;
  }

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      mainPrompt: { 
        type: Type.STRING, 
        description: 'The main, highly detailed artistic description for a text-to-image AI.' 
      },
      styleKeywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'An array of 5-10 keywords defining the image\'s artistic style.'
      },
      colorPalette: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'An array of 6 dominant HEX color codes from the image.'
      },
      alternativePrompts: {
        type: Type.OBJECT,
        properties: {
          concise: {
            type: Type.STRING,
            description: 'A short, direct (1-2 sentences) version of the prompt.'
          },
          poetic: {
            type: Type.STRING,
            description: 'A more evocative and abstract (1-2 sentences) version of the prompt.'
          }
        },
        required: ['concise', 'poetic']
      }
    },
    required: ['mainPrompt', 'styleKeywords', 'colorPalette', 'alternativePrompts'],
  };

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: userInstructions }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
    });
    
    const jsonText = response.text.replace(/```json\n?/, '').replace(/```$/, '');
    const parsedResult = JSON.parse(jsonText) as AnalysisResult;
    
    if(parsedResult.mainPrompt && parsedResult.styleKeywords && parsedResult.colorPalette && parsedResult.alternativePrompts){
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