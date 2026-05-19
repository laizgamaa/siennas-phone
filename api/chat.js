import { GoogleGenerativeAI } from "@google/generative-ai"
import { characters } from "../src/data/characters.js"
import { validateChatRequest } from "../src/lib/chatValidation.js"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" })
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
    if (err.status === 429) {
      return res.status(429).json({ error: "Muitas mensagens seguidas. Aguarde um momento." })
    }
    console.error("Erro Gemini:", err)
    res.status(500).json({ error: `${character.name} não está disponível agora.` })
  }
}
