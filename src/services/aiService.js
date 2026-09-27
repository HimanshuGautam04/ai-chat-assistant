// AI service layer.
//
// By default the app runs in DEMO mode: it returns smart canned/heuristic
// responses locally, so the project runs and deploys with zero setup and
// without exposing any secret keys.
//
// To use a real LLM, set VITE_OPENAI_API_KEY in a .env file. The app will then
// call the OpenAI Chat Completions API instead. (Never commit your .env.)

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MODEL = import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini";

export const isDemoMode = !API_KEY;

// ---- Demo-mode canned response engine ----
const DEMO_REPLIES = [
  {
    match: /hello|hi|hey|greetings/i,
    reply:
      "Hello! 👋 I'm your AI assistant (running in demo mode). Ask me anything — try questions about JavaScript, React, or just say what's on your mind.",
  },
  {
    match: /react/i,
    reply:
      "React is a JavaScript library for building user interfaces using reusable components. Its core ideas are a component tree, one-way data flow, and a virtual DOM that makes UI updates efficient. Hooks like useState and useEffect let function components manage state and side effects.",
  },
  {
    match: /javascript|js\b/i,
    reply:
      "JavaScript is the language of the web. It's single-threaded, event-driven, and uses an event loop to handle asynchronous work via callbacks, promises, and async/await. Modern JS (ES6+) added arrow functions, destructuring, modules, and more.",
  },
  {
    match: /who are you|what are you|your name/i,
    reply:
      "I'm a demo AI assistant built with React and Tailwind CSS. In demo mode I generate responses locally. Add an API key and I'll connect to a real large language model.",
  },
  {
    match: /help|what can you do/i,
    reply:
      "I can chat with you, answer questions, and demonstrate a streaming-style typing UI. In this demo build my knowledge is limited to a few topics, but with a real API key I can answer anything.",
  },
];

function demoResponse(userText) {
  const hit = DEMO_REPLIES.find((r) => r.match.test(userText));
  if (hit) return hit.reply;
  // Generic fallback that echoes understanding.
  return `That's an interesting point about "${userText.slice(
    0,
    60
  )}". In demo mode I give simple local replies, but if you connect a real AI API key I can give a full, detailed answer. Try asking me about React or JavaScript!`;
}

// Simulate network + typing latency for a realistic feel.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send the conversation to the AI and get an assistant reply.
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Promise<string>} assistant reply text
 */
export async function sendMessage(messages) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const userText = lastUser?.content || "";

  if (isDemoMode) {
    await delay(400 + Math.random() * 500);
    return demoResponse(userText);
  }

  // Real API path (OpenAI Chat Completions).
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI request failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "(No response)";
}
