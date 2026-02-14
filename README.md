# 🤖 AI Code Explainer

A lightweight web-based AI tool that analyzes Python and JavaScript code snippets and generates clear, plain-English explanations.

Built as an MVP within a short time frame while focusing on architecture clarity, AI grounding, and explainability.

---

## 🚀 Features

- Accepts **JavaScript** and **Python** code snippets
- Generates a concise 2–4 sentence explanation using an LLM
- Performs structural analysis (AST for JS, heuristic parsing for Python)
- Estimates time complexity (heuristic-based)
- Suggests an optimized version of the code
- Displays previous submissions
- Syntax highlighting (Prism.js)
- Copy-to-clipboard support
- Clean dark-themed UI

---

## 🏗 System Architecture

Frontend (HTML + CSS + JS)
↓
Express Backend API
↓
Code Analysis Layer
- JS: Babel AST
- Python: Regex heuristics
↓
LLM (Mistral via OpenRouter)
↓
Response Formatting
↓
Frontend Rendering


---

## 🧠 AI Model Selection

**Model Used:** `mistralai/mistral-7b-instruct` via OpenRouter

### Why?
- Free tier availability
- OpenAI-compatible API format
- Good balance of latency and reasoning quality
- Suitable for explanation-style tasks

Temperature is set to **0.2** to reduce hallucination and increase determinism.

---

## 🛡 Handling Hallucinations & Accuracy

To improve reliability:

- Structured prompts with role definition
- Explicit instruction to avoid guessing
- AST-based grounding for JavaScript
- Low temperature (0.2)
- Clear context boundaries in prompt
- Heuristic structural extraction before LLM call

In production, this could be further improved with:
- Static analysis validation
- Execution sandbox verification
- Multiple model comparison
- Response consistency checks

---

## 📊 Complexity Estimation

- JavaScript: Based on AST loop detection
- Python: Regex-based loop and recursion detection
- Heuristic estimates:
  - 1 loop → O(n)
  - Nested loops → O(n²)
  - No loops → O(1)
  - Recursion → O(n) (estimated)

This is intentionally heuristic-based for MVP scope.

---

## ⚡ Optimization & Diff

The system:
1. Calls the LLM to suggest an optimized version
2. Generates a line-level diff using the `diff` package
3. Displays optimized output in UI

---

## 🧪 How to Run Locally

### 1️⃣ Clone the repo

git clone https://github.com/mkhan321-dev/ai-code-explainer.git

cd ai-code-explainer


### 2️⃣ Install Dependencies

npm install

### 3️⃣ Create a `.env` File

OPENAI_API_KEY=your_openrouter_api_key

### 4️⃣ Start the Server

node server.js

Visit:

http://localhost:5000


---

## 📦 Tech Stack

- Node.js
- Express.js
- Babel Parser (JavaScript AST)
- OpenRouter (Mistral 7B)
- Prism.js (syntax highlighting)
- Vanilla HTML/CSS/JavaScript

---

## 🔐 Security Considerations

- API keys are stored in `.env`
- `.env` is excluded via `.gitignore`
- No code execution occurs server-side
- Input is treated as plain text for analysis only

---

## 📈 Future Enhancements

- Full Python AST parsing
- Monaco Editor integration
- Side-by-side visual diff viewer
- Persistent database storage
- Streaming LLM responses
- Rate limiting & caching
- Multi-language support

---

## 👨‍💻 Discussion Topics

## 📜 License

For demonstration and evaluation purposes.


