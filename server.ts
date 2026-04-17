import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/ai/advice", async (req, res) => {
    try {
      const { logs } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not set." });
      }

      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      if (!logs || logs.length === 0) {
        return res.json({ advice: "Zatím nemáš žádná data. Odcvič svůj první trénink a já ti poradím!" });
      }

      const recentLogsText = logs.slice(-10).map((log: any) => 
        `${new Date(log.timestamp).toLocaleDateString()}: ${log.type} - ${log.sets.map((s: any) => s.reps).join(',')} reps`
      ).join('\n');

      const prompt = `Jsi expertní kalisthenický trenér. Analyzuj tyto nedávné tréninky a dej uživateli krátké, 
      úderné a motivující rady v češtině (max 150 slov). Zaměř se na progresivní přetížení a techniku.

      Nedávné tréninky:
      ${recentLogsText}`;

      const result = await model.generateContent(prompt);
      const advice = result.response.text();

      res.json({ advice });
    } catch (error) {
      console.error("AI Route Error:", error);
      res.status(500).json({ error: "Nepodařilo se vygenerovat AI radu. Zkuste to později." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Static serving for production
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
