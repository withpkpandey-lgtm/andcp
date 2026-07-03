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
  const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-flash-latest"];
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
      console.log(`[AI SDK] Model ${model} is currently busy or unavailable. Trying next options...`);
      lastError = err;
    }
  }
  throw lastError;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

export { app };

async function startServer() {

  // API Route: AI Tutor Chat proxy
  app.post("/api/chat", async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured in the workspace secrets." });
      }

      const { message, image, history, currentTopic, studentInfo } = req.body;

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
   - Basics: Introduction to Python, Variables, Data types, Input Output, Operators.
   - Intermediate: Conditions, Loops, Functions, Modules, Libraries.
   - Advanced: File handling, Exception handling, OOP, Database, API.
   - Applications: Pharmaceutical science, Data analysis, Research, Automation.
   NOTE: The student MUST start with the "Introduction to Python" topic first (what is Python, its creator, its importance, its uses in Pharmacy/Healthcare, and how it is different from other languages like C++/Java). Only after this introduction should they move to basics like Variables.
5. CODE SHARING: When you share code, use clear, simple code snippets. Keep comments short and in Hinglish/English.
6. CALL TO ACTION: Always end your explanation with a short, highly engaging question, a mini-quiz challenge, or a prompt to try the code in the "Playground" panel on the right.
7. QUIZZES: If the student asks for a quiz, send a short 1-question quiz with multiple choice options (A, B, C, D) and ask them to select an option.
8. WRITING CODE FOR STUDENT: If the student asks you to write code for a specific problem or pharmaceutical utility (e.g. dilution ratio, tablet weight checker, prescription system), write it for them in a clear code block, explain how to run it in the Code Playground, and encourage them to test it there!
9. SCREENSHOTS & IMAGES: If the student attaches an image or screenshot (of an error, code, or pharmaceutical lab sheet), carefully examine the image, tell them what you see, and guide them in Hinglish/English on how to fix the error or code!

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

      // Prepare final parts
      const finalParts: any[] = [];
      
      if (image) {
        const matches = image.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          finalParts.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          });
        }
      }
      
      finalParts.push({ text: message || "Beta is showing you this screenshot/image. Please analyze it." });

      // Add the final student message
      contents.push({
        role: 'user',
        parts: finalParts
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

  // API Route: Send WhatsApp Notification when student profile is created
  app.post("/api/notify-profile", async (req, res) => {
    try {
      const { name, rollNumber, stream, joinedDate } = req.body;
      const targetPhone = "918090066349"; // Pawan Sir's WhatsApp Number with country code 91
      
      const textMessage = `🔔 *New Student Profile Created!* 🎓\n\n*Name:* ${name || "Guest"}\n*Roll No:* ${rollNumber || "N/A"}\n*Stream:* ${stream || "B.pharm"}\n*Date:* ${joinedDate || new Date().toLocaleDateString('en-IN')}\n\nPawan Sir, ek naye student ne register kiya hai! 😊📚`;

      console.log(`[WhatsApp Notification] Attempting to notify Pawan Sir at ${targetPhone}`);
      
      let notificationStatus = "logged";
      let errorDetails = "";

      // 1. If CALLMEBOT_API_KEY is configured, call CallMeBot free WhatsApp API
      const callmebotApiKey = process.env.CALLMEBOT_API_KEY;
      if (callmebotApiKey) {
        try {
          const url = `https://api.callmebot.com/whatsapp.php?phone=${targetPhone}&text=${encodeURIComponent(textMessage)}&apikey=${callmebotApiKey}`;
          const response = await fetch(url);
          if (response.ok) {
            notificationStatus = "sent_callmebot";
            console.log("[WhatsApp Notification] Successfully sent via CallMeBot API!");
          } else {
            const errText = await response.text();
            console.warn(`[WhatsApp Notification] CallMeBot API responded with error: ${errText}`);
            errorDetails = `CallMeBot error: ${errText}`;
          }
        } catch (err: any) {
          console.error("[WhatsApp Notification] Error calling CallMeBot:", err);
          errorDetails = err.message || "Failed to fetch CallMeBot";
        }
      }

      // 2. Also try custom webhook if provided (e.g., WHATSAPP_WEBHOOK_URL)
      const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: targetPhone,
              message: textMessage,
              student: { name, rollNumber, stream, joinedDate }
            })
          });
          if (response.ok) {
            notificationStatus = "sent_webhook";
            console.log("[WhatsApp Notification] Successfully sent via Custom Webhook!");
          } else {
            console.warn(`[WhatsApp Notification] Webhook responded with status: ${response.status}`);
          }
        } catch (err: any) {
          console.error("[WhatsApp Notification] Webhook error:", err);
        }
      }

      res.json({ 
        success: true, 
        status: notificationStatus, 
        message: textMessage, 
        error: errorDetails,
        directLink: `https://wa.me/918090066349?text=${encodeURIComponent(textMessage)}`
      });
    } catch (error: any) {
      console.error("Error in /api/notify-profile:", error);
      res.status(500).json({ error: error.message || "An error occurred during WhatsApp notification." });
    }
  });

  // API Route: Send WhatsApp Notification when student makes ₹50 payment
  app.post("/api/notify-payment", async (req, res) => {
    try {
      const { name, phone, rollNumber, stream, utr, amount = 50 } = req.body;
      
      // Format student phone: ensure 91 prefix for Indian numbers if not already there
      let studentPhone = phone ? phone.trim().replace(/\D/g, "") : "";
      if (studentPhone.length === 10) {
        studentPhone = "91" + studentPhone;
      } else if (studentPhone.length === 12 && studentPhone.startsWith("91")) {
        // already has 91
      } else if (studentPhone.length > 0 && !studentPhone.startsWith("91")) {
        studentPhone = "91" + studentPhone;
      }

      const pawanPhone = "918090066349";

      const studentMessage = `💸 *PyGuru AI Python Classes* 🎓\n\n*PyGuru AI Payment Receipt* ✅\n\n*Student:* ${name || "Beta"}\n*Mobile:* +${studentPhone || "N/A"}\n*Amount:* ₹${amount} INR\n*UPI Transaction (UTR):* ${utr || "Verified UPI"}\n*Stream:* ${stream || "B.pharm"}\n*Roll No:* ${rollNumber || "N/A"}\n\n*Status:* Received Successfully! 👍\n\n_Dhanyawad beta, aapka payment successfully receive ho gaya hai! Pawan Sir jald hi aapke profile ko review karke class ke liye fully approve kar denge._ 📚🐍`;
      const adminMessage = `🔔 *New Payment Received!* 💸\n\n*Student Name:* ${name || "Beta"}\n*Mobile:* +${studentPhone || "N/A"}\n*Amount:* ₹${amount} INR\n*UTR ID:* ${utr || "N/A"}\n*Stream:* ${stream || "B.pharm"}\n*Roll:* ${rollNumber || "N/A"}\n\nSir, student ne ₹50 register payment kiya hai. Kripya Admin Panel me jaakar inka profile Approve karein! 😊📚`;

      console.log(`[WhatsApp Payment Notification] Sending receipt to student ${studentPhone} and admin ${pawanPhone}`);
      
      let notificationStatus = "logged";
      let errorDetails = "";
      const callmebotApiKey = process.env.CALLMEBOT_API_KEY;

      // 1. Send receipt to Student if they provided a phone number
      if (studentPhone && callmebotApiKey) {
        try {
          const studentUrl = `https://api.callmebot.com/whatsapp.php?phone=${studentPhone}&text=${encodeURIComponent(studentMessage)}&apikey=${callmebotApiKey}`;
          const resStudent = await fetch(studentUrl);
          if (resStudent.ok) {
            notificationStatus = "sent_student";
          } else {
            console.warn(`[WhatsApp Student Notification] Failed to notify student: ${await resStudent.text()}`);
          }
        } catch (err: any) {
          console.error("[WhatsApp Student Notification] Error calling CallMeBot:", err);
        }
      }

      // 2. Send notice to Pawan Sir (Admin)
      if (callmebotApiKey) {
        try {
          const adminUrl = `https://api.callmebot.com/whatsapp.php?phone=${pawanPhone}&text=${encodeURIComponent(adminMessage)}&apikey=${callmebotApiKey}`;
          const resAdmin = await fetch(adminUrl);
          if (resAdmin.ok) {
            notificationStatus = notificationStatus === "sent_student" ? "sent_both" : "sent_admin";
          }
        } catch (err: any) {
          console.error("[WhatsApp Admin Notification] Error calling CallMeBot:", err);
        }
      }

      // 3. Webhook fallback
      const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentPhone,
              pawanPhone,
              studentMessage,
              adminMessage,
              payment: { name, phone: studentPhone, rollNumber, stream, utr, amount }
            })
          });
          notificationStatus = "sent_webhook";
        } catch (err) {
          console.error("[WhatsApp Payment Notification] Webhook error:", err);
        }
      }

      res.json({
        success: true,
        status: notificationStatus,
        studentMessage,
        adminMessage,
        studentWaLink: studentPhone ? `https://wa.me/${studentPhone}?text=${encodeURIComponent(studentMessage)}` : null,
        adminWaLink: `https://wa.me/${pawanPhone}?text=${encodeURIComponent(adminMessage)}`
      });
    } catch (error: any) {
      console.error("Error in /api/notify-payment:", error);
      res.status(500).json({ error: error.message || "An error occurred during WhatsApp payment notification." });
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

if (process.env.NETLIFY !== "true") {
  startServer();
}
