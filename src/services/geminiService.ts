import { ExerciseLog } from "../types";

export async function getWorkoutAdvice(logs: ExerciseLog[]) {
  if (logs.length === 0) {
    return "Zatím nemáš žádná data. Odcvič svůj první trénink a já ti poradím!";
  }

  try {
    const response = await fetch("/api/ai/advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ logs }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch AI advice");
    }

    const data = await response.json();
    return data.advice;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Nepodařilo se připojit k AI analýze. Zkontroluj připojení nebo nastavení klíče.";
  }
}
