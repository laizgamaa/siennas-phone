import { GoogleGenerativeAI } from "@google/generative-ai"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { characters } from "../src/data/characters.js"
import { validateChatRequest } from "../src/lib/chatValidation.js"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" })
  }

  if (!req.body) {
    return res.status(400).json({ error: "Body inválido" })
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() ?? "anonymous"
  const { success, reset } = await ratelimit.limit(ip)

  if (!success) {
    const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000)
    res.setHeader("Retry-After", retryAfterSeconds)
    return res.status(429).json({ error: "Muitas mensagens seguidas. Aguarde um momento." })
  }

  const { characterId, messages } = req.body
  const validationError = validateChatRequest({ characterId, messages })

  if (validationError) {
    return res.status(400).json({ error: validationError })
  }

  const character = characters[characterId]

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: character.systemPrompt,
    })

    const result = await model.generateContent({
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    })

    res.status(200).json({ content: result.response.text() })
  } catch (err) {
    if (err.statusCode === 429) {
      return res.status(429).json({ error: "Muitas mensagens seguidas. Aguarde um momento." })
    }
    console.error("Erro Gemini:", err.message ?? err)
    res.status(500).json({ error: `${character?.name ?? "O personagem"} não está disponível agora.` })
  }
}
