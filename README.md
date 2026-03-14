# 🤖 AI Study Topic Explainer

### A small web app where you type a topic and get a simple, student-friendly explanation back.

## 📚 Project Description

This is basically a “study helper”: enter something like “Photosynthesis” or “Binary Search” and the app generates a short explanation that’s easy to revise from.

💡 The important part is that the AI call happens on the server (not in the browser), so your API key stays private.

## 🧠 How The AI API Was Used

The app uses Google Gemini through the `@google/generative-ai` SDK.

🔄 How it works:

- The UI sends your topic to a server endpoint: `POST /api/explain`
- That endpoint lives in `src/app/api/explain/route.ts`
- The endpoint calls a server-only helper in `src/lib/aiClient.ts` (it imports `server-only`)
- The helper builds a prompt (keep it short, avoid jargon, add an example if it helps) and calls Gemini
- The model can be changed with `GEMINI_MODEL` (default: `gemini-flash-latest`)

🚨 If Gemini fails (invalid key, quota, wrong model name, etc.), the API returns a friendly error message and an appropriate HTTP status code so the UI can show a useful message.

## ✨ Features

- Type a topic and submit
- Loading state + clear error messages
- Explanation output keeps paragraphs/line breaks
- API key stays server-side

## 🛠 Tech Stack

- ⚡ **Next.js (App Router)**
- 🟦 **TypeScript**
- 🎨 **Tailwind CSS**
- 🤖 **Google Gemini AI**
- 📦 **@google/generative-ai SDK**

## 📋 Prerequisites

Make sure you have the following installed:

- 🟢 **Node.js 20+** (recommended: latest LTS)
- 🔑 **Gemini API Key from Google AI Studio**

To confirm Node is installed:

```bash
node -v
npm -v
```

## 🚀 Getting Started

### 1️⃣ Install dependencies

From the `ai-study-explainer/` folder:

```bash
npm install
```

### 2️⃣ Configure environment variables

Create a `.env.local` file in `ai-study-explainer/`:

```bash
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-flash-latest
```

Notes:

- Don’t paste your `GOOGLE_API_KEY` into client-side code or commit it to Git.
- After editing `.env.local`, restart the dev server.
- `GEMINI_MODEL` is optional. You can set either `gemini-flash-latest` or `models/gemini-flash-latest`.

### 3️⃣ Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📂 Project Structure

- UI page: `src/app/page.tsx`
- API route: `src/app/api/explain/route.ts`
- Gemini client (server-only): `src/lib/aiClient.ts`
- UI components: `src/components/*`

## 🔗 API

### `POST /api/explain`

Request body:

```json
{ "topic": "Photosynthesis" }
```

Response:

```json
{ "ok": true, "explanation": "..." }
```

Errors:

```json
{ "ok": false, "error": { "message": "...", "code": "..." } }
```

## 🛠 Troubleshooting

### ❌ “Gemini API key was rejected”

- Check `GOOGLE_API_KEY` in `.env.local`.
- Restart `npm run dev` after editing `.env.local`.
- If it still fails, create a new key in Google AI Studio and replace it.

### ❌ “Gemini model was not found”

- Your key might not have access to the model name you set.
- Run:

```bash
npm run list-models
```

- Copy one model (example: `models/gemini-2.0-flash`) and set:

```bash
GEMINI_MODEL=gemini-2.0-flash
```

- Restart the dev server.

### ❌ “Quota exceeded / rate limit”

- Wait 30–60 seconds and retry.
- Reduce how often you click Explain.

## ☁️ Deploy (Vercel)

1) Push the repo to GitHub.
2) Import the project into Vercel.
3) Set Environment Variables in Vercel:

- `GOOGLE_API_KEY`
- (optional) `GEMINI_MODEL`

4) Deploy.

## 🔒 Security

- Never put `GOOGLE_API_KEY` in client-side code.
- Only store it in `.env.local` (local dev) and in your deployment provider’s env vars.


"# ⭐ AI-Study-Topic-Explainer" 
