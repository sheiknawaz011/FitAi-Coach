import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FitnessPlan {
  workoutPlan: {
    day: string;
    exercises: string[];
  }[];
  dietPlan: {
    meal: string;
    items: string[];
  }[];
  tips: string[];
  motivation: string;
}

export async function generateFitnessPlan(
  age: number,
  weight: number,
  goal: string,
  experience: string
): Promise<FitnessPlan> {
  const prompt = `You are a professional fitness trainer. Create a personalized fitness plan for a user with the following details:
Age: ${age}
Weight: ${weight}kg
Goal: ${goal}
Experience Level: ${experience}

Provide:
1. Weekly workout plan (day-wise, 7 days)
2. Simple Indian diet plan (Breakfast, Lunch, Evening Snack, Dinner)
3. 3 fitness tips
4. Motivation message like a gym trainer

Return the response in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["workoutPlan", "dietPlan", "tips", "motivation"],
        properties: {
          workoutPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["day", "exercises"],
              properties: {
                day: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            }
          },
          dietPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["meal", "items"],
              properties: {
                meal: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            }
          },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          motivation: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text);
}
