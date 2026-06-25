/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Ensure the API key is present
const apiKey = process.env.GEMINI_API_KEY;

// Instantiate the GoogleGenAI client securely
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

/**
 * Helper to call generateContent with automatic model fallback if the primary model is busy or overloaded.
 */
async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
}) {
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[AI SDK] Attempting generateContent with model: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: params.contents,
        config: params.config,
      });
      console.log(`[AI SDK] Successfully completed generation with model: ${model}`);
      return response;
    } catch (err: any) {
      console.warn(`[AI SDK Warning] Model ${model} failed. Error:`, err.message || err);
      lastError = err;
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Tutor Chat proxy
  app.post("/api/chat", async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured in the workspace secrets." });
      }

      const { message, history, currentTopic, studentInfo } = req.body;

      const studentDetails = studentInfo ? `
STUDENT DETAILS:
- Name: ${studentInfo.name || 'Beta'}
- Roll Number: ${studentInfo.rollNumber || 'N/A'}
- Stream: ${studentInfo.stream || 'B.pharm'}
CRITICAL: You MUST address this student directly by their name ("${studentInfo.name || 'Beta'}") frequently in your responses. You must support, teach, and encourage them according to their pharmaceutical study stream (${studentInfo.stream || 'B.pharm'}).
` : '';

      // Construct a system instruction with deep personal teacher persona
      const systemInstruction = `You are Mr. Pawan Pandey, an exceptionally warm, friendly, encouraging, and highly interactive Python Tutor specializing in Pharmaceutical Science.
You teach Python programming from absolute zero level (absolute beginners).

Follow these rules perfectly:
1. SENDER IDENTITY: Act as a wise and caring Indian coding teacher named Mr. Pawan Pandey (Pawan Sir). Use terms of endearment like "Beta", "Bacha", "Arey Waah!", or "My dear student" along with the student's name if known.
2. LANGUAGE STYLE: Speak in Hinglish (a natural conversational blend of Hindi and English, written in English script) and English. For example: "Variables are like empty glass vials or dabbas beta, jisme aap tablet count, concentration or patient name store karte ho. Jaise: dosage = 250."
3. FORMATTING: Since this is a WhatsApp simulation, make your responses look exactly like friendly WhatsApp messages:
   - Use bold for emphasis (*word* or **word**).
   - Use emojis liberally (🐍, 💻, 🧪, 💊, 🔬, 🎯, 💡, 👍).
   - Keep messages structured with clear bullet points.
   - Limit the length of any single message to 2-3 short, highly readable paragraphs so it feels like a real chat.
4. SYLLABUS ALIGNMENT: Align your response to the user's current topic if specified: ${currentTopic || 'general queries'}.
   Our complete syllabus is:
   - Basics: Variables, Data types, Input Output, Operators.
   - Intermediate: Conditions, Loops, Functions, Modules, Libraries.
   - Advanced: File handling, Exception handling, OOP, Database, API.
   - Applications: Pharmaceutical science, Data analysis, Research, Automation.
5. CODE SHARING: When you share code, use clear, simple code snippets. Keep comments short and in Hinglish/English.
6. CALL TO ACTION: Always end your explanation with a short, highly engaging question, a mini-quiz challenge, or a prompt to try the code in the "Playground" panel on the right.
7. QUIZZES: If the student asks for a quiz, send a short 1-question quiz with multiple choice options (A, B, C, D) and ask them to select an option.
8. WRITING CODE FOR STUDENT: If the student asks you to write code for a specific problem or pharmaceutical utility (e.g. dilution ratio, tablet weight checker, prescription system), write it for them in a clear code block, explain how to run it in the Code Playground, and encourage them to test it there!

${studentDetails}`;

      // Structure the messages for generateContent
      const contents = [];
      
      // Append history if provided
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          contents.push({
            role: turn.sender === 'student' ? 'user' : 'model',
            parts: [{ text: turn.text }]
          });
        }
      }

      // Add the final student message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await generateContentWithFallback({
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const textOutput = response.text || "Sorry beta, I couldn't understand that. Please try again! 🙏";
      res.json({ text: textOutput });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred." });
    }
  });

  // API Route: Line-by-line Code Explanation
  app.post("/api/explain-code", async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
      }

      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Code is required for explanation." });
      }

      const response = await generateContentWithFallback({
        contents: `You are an expert Python educator. Analyze this Python code and explain it line-by-line in Hinglish (blend of Hindi and English in Roman letters). 
Keep explanations clear, easy to understand for beginners, and friendly.

Code to explain:
${code}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              lineByLine: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    line: { type: Type.STRING, description: "The exact line of code." },
                    index: { type: Type.INTEGER, description: "0-based line index." },
                    explanation: { type: Type.STRING, description: "A simple, clear explanation of what this line does, in friendly Hinglish." }
                  },
                  required: ["line", "index", "explanation"]
                }
              }
            },
            required: ["lineByLine"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        const parsed = JSON.parse(resultText);
        res.json(parsed);
      } else {
        res.status(500).json({ error: "Failed to generate line explanation." });
      }
    } catch (error: any) {
      console.error("Error in /api/explain-code:", error);
      res.status(500).json({ error: error.message || "An error occurred during explanation." });
    }
  });

  // API Route: Code Debugger
  app.post("/api/debug-code", async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
      }

      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Code is required for debugging." });
      }

      const response = await generateContentWithFallback({
        contents: `You are Mr. Pawan Pandey, an expert Python debugging assistant. Analyze the buggy Python code below. Identify syntax errors, naming bugs, or logical errors. Provide the corrected/fixed code and a friendly, encouraging explanation in Hinglish.

Buggy Code:
${code}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              originalCode: { type: Type.STRING },
              fixedCode: { type: Type.STRING, description: "The complete corrected Python code." },
              issues: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of bugs found in the code."
              },
              explanation: { type: Type.STRING, description: "A friendly, encouraging explanation of the fixes in Hinglish." }
            },
            required: ["originalCode", "fixedCode", "issues", "explanation"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        res.json(JSON.parse(resultText));
      } else {
        res.status(500).json({ error: "Failed to debug code." });
      }
    } catch (error: any) {
      console.error("Error in /api/debug-code:", error);
      res.status(500).json({ error: error.message || "An error occurred during debugging." });
    }
  });

  // API Route: Code Execution Simulation
  app.post("/api/run-code", async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
      }

      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Code is required for execution." });
      }

      const response = await generateContentWithFallback({
        contents: `Act as a precise Python execution environment. Simulate executing this script and return the exact standard output (stdout) and standard error/traceback (stderr), along with an exit code (0 if success, 1 if crashed).
Do not try to interpret or explain, just act as a computer terminal console.
If there are infinite loops or inputs, simulate a typical output.

Python Code:
${code}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              stdout: { type: Type.STRING, description: "The standard print/terminal output." },
              stderr: { type: Type.STRING, description: "The Python Traceback error message if there is an exception or crash. Empty string if successful." },
              exitCode: { type: Type.INTEGER, description: "0 for successful completion, 1 for crash." },
              summary: { type: Type.STRING, description: "A one-sentence human friendly result summary in Hinglish." }
            },
            required: ["stdout", "stderr", "exitCode", "summary"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        res.json(JSON.parse(resultText));
      } else {
        res.status(500).json({ error: "Failed to simulate code execution." });
      }
    } catch (error: any) {
      console.error("Error in /api/run-code:", error);
      res.status(500).json({ error: error.message || "An error occurred during code run." });
    }
  });

  // Vite development vs. production static serving setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
