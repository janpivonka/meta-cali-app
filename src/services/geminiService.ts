import { GoogleGenerativeAI } from "@google/generative-ai";
import { Workout } from "../types";

export async function getWorkoutAdvice(workouts: Workout[]) {
  if (workouts.length === 0) {
    return "Zatím nemáš žádná data. Odcvič svůj první trénink a já ti poradím!";
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing");
      return "AI analýza je dočasně nedostupná (chybí API klíč).";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const recentSessionsText = workouts.slice(-5).map(w => {
      const sessionDate = new Date(w.timestamp).toLocaleDateString();
      const exercisesText = w.exercises.map(ex => 
        `${ex.type}: ${ex.sets.map(s => s.reps || `${s.time}s`).join(',')} reps`
      ).join(' | ');
      return `${sessionDate}: ${exercisesText}`;
    }).join('\n');

    const result = await model.generateContent(`Jsi expertní kalisthenický trenér. Analyzuj tyto nedávné tréninky a dej uživateli krátké, 
      úderné a motivující rady v češtině (max 150 slov). Zaměř se na progresivní přetížení a techniku.

      Nedávná tréninková data:
      ${recentSessionsText}`);

    const response = await result.response;
    return response.text() || "Omlouvám se, ale analýza se nepodařila. Zkus to prosím později.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Nepodařilo se připojit k AI analýze. Zkontroluj připojení.";
  }
}
