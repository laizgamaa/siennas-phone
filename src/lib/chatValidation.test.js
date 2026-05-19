import { describe, it, expect } from "vitest"
import { validateChatRequest } from "./chatValidation"

describe("validateChatRequest", () => {
  it("retorna erro para characterId desconhecido", () => {
    const result = validateChatRequest({
      characterId: "nao-existe",
      messages: [{ role: "user", content: "oi" }],
    })
    expect(result).toBe("Personagem inválido")
  })

  it("retorna erro para messages vazio", () => {
    const result = validateChatRequest({
      characterId: "kai",
      messages: [],
    })
    expect(result).toBe("Mensagem vazia")
  })

  it("retorna erro quando última mensagem excede 300 caracteres", () => {
    const result = validateChatRequest({
      characterId: "kai",
      messages: [{ role: "user", content: "a".repeat(301) }],
    })
    expect(result).toBe("Mensagem muito longa")
  })

  it("retorna null para request válido", () => {
    const result = validateChatRequest({
      characterId: "kai",
      messages: [{ role: "user", content: "Oi, tudo bem?" }],
    })
    expect(result).toBeNull()
  })
})
