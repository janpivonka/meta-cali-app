import { GoogleGenAI } from "@google/genai";
import { ExerciseLog } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getWorkoutAdvice(logs: ExerciseLog[]) {
  if (logs.length === 0) {
    return "Zatím nemáš žádná data. Odcvič svůj první trénink a já ti poradím!";
  }

  const recentLogsText = logs.slice(-10).map(log => 
    `${new Date(log.timestamp).toLocaleDateString()}: ${log.type} - ${log.sets.map(s => s.reps).join(',')} reps`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Jsi expertní kalisthenický trenér. Analyzuj tyto nedávné tréninky a dej uživateli krátké, 
      úderné a motivující rady v češtině (max 150 slov). Zaměř se na progresivní přetížení a techniku.

      Nedávné tréninky:
      ${recentLogsText}`,
    });

    return response.text || "Omlouvám se, ale analýza se nepodařila. Zkus to prosím později.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Nepodařilo se připojit k AI analýze. Zkontroluj připojení.";
  }
}
