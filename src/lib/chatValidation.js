import { characters } from "../data/characters.js"

export function validateChatRequest({ characterId, messages }) {
  if (!characterId || !characters[characterId]) {
    return "Personagem inválido"
  }

  if (!messages?.length) {
    return "Mensagem vazia"
  }

  const lastContent = messages[messages.length - 1]?.content
  if (!lastContent || lastContent.length > 300) {
    return "Mensagem muito longa"
  }

  return null
}
