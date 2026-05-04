import { GoogleGenerativeAI } from "@google/generative-ai";
import { Workout } from "../types";

export async function getWorkoutAdvice(workouts: Workout[]) {
  if (workouts.length === 0) {
    return "You don't have any data yet. Complete your first workout and I'll give you some advice!";
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing");
      return "AI analysis is temporarily unavailable (missing API key).";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const recentSessionsText = (workouts || []).slice(-5).map(w => {
      const sessionDate = new Date(w.timestamp).toLocaleDateString();
      const exercisesText = (w.exercises || []).map(ex => 
        `${ex.type}: ${(ex.sets || []).map(s => s.reps || `${s.time}s`).join(',')} reps`
      ).join(' | ');
      return `${sessionDate}: ${exercisesText}`;
    }).join('\n');

    const result = await model.generateContent(`You are an expert calisthenics coach. Analyze these recent workouts and give the user short,
      punchy and motivating advice in English (max 150 words). Focus on progressive overload and technique.

      Recent workout data:
      ${recentSessionsText}`);

    const response = await result.response;
    return response.text() || "I'm sorry, but the analysis failed. Please try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to connect to AI analysis. Please check your connection.";
  }
}
