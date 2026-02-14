import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { parse } from "@babel/parser";
import { diffLines } from "diff";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "AI Code Explainer"
  }
});


let history = [];

/* -------------------- JS AST ANALYSIS -------------------- */
function analyzeJS(code) {
  try {
    const ast = parse(code, { sourceType: "module" });
    let functions = 0;
    let loops = 0;

    JSON.stringify(ast, (key, value) => {
      if (value?.type === "FunctionDeclaration") functions++;
      if (value?.type === "ForStatement" || value?.type === "WhileStatement") loops++;
      return value;
    });

    return { functions, loops };
  } catch {
    return null;
  }
}

/* -------------------- COMPLEXITY ESTIMATION -------------------- */
function estimateComplexity(code, language, structure) {
  // JS structured estimate
  if (language === "javascript" && structure) {
    if (structure.loops === 1) return "O(n)";
    if (structure.loops >= 2) return "O(n²) (estimated)";
    return "O(1)";
  }

  // Python heuristic estimate
  if (language === "python") {
    const loopCount =
      (code.match(/for\s+/g) || []).length +
      (code.match(/while\s+/g) || []).length;

    const recursion =
      (code.match(/def\s+(\w+)/) &&
        new RegExp(RegExp.$1 + "\\(").test(code));

    if (loopCount === 1) return "O(n)";
    if (loopCount >= 2) return "O(n²) (estimated)";
    if (recursion) return "O(n) (recursive estimate)";
    return "O(1)";
  }

  return "Unknown";
}


/* -------------------- LLM CALL -------------------- */
async function callLLM(prompt) {
  const response = await openai.chat.completions.create({
    // model: "gpt-4.1-mini",
    model: "mistralai/mistral-7b-instruct",

    temperature: 0.2,
    messages: [{ role: "user", content: prompt }]
  });

  return response.choices[0].message.content;
}

/* -------------------- MAIN API -------------------- */
app.post("/explain", async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code required" });
    }

    let structure = null;
    if (language === "javascript") {
      structure = analyzeJS(code);
    }

    // const complexity = estimateComplexity(structure);
    const complexity = estimateComplexity(code, language, structure);


    const explanationPrompt = `
You are a senior software engineer.

Explain the following ${language} code in 2-4 sentences.
If unsure about something, say "Context not available."

Detected structure:
${JSON.stringify(structure)}

Code:
"""
${code}
"""
`;

    const explanation = await callLLM(explanationPrompt);

    /* -------- OPTIMIZATION CALL (BONUS) -------- */
    const optimizePrompt = `
Optimize the following ${language} code.
Keep functionality identical.
Return only improved code.

Code:
"""
${code}
"""
`;

    const optimized = await callLLM(optimizePrompt);

    const diff = diffLines(code, optimized);

    const entry = {
      language,
      code,
      explanation,
      complexity,
      optimized
    };

    history.push(entry);

    res.json({
      explanation,
      complexity,
      optimized,
      diff,
      history
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
