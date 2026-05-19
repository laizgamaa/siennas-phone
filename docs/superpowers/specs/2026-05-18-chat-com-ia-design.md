# Chat com IA — Design Spec (v2)

**Data:** 2026-05-18
**Status:** Aprovado
**Anterior:** `2026-05-15-chat-iterativo-design.md`

---

## Contexto

App Vite que simula o celular da Sienna, personagem de um livro. O objetivo é tornar todos os 4 contatos (Kai, Thalia, Mãe, Ágata) interativos via IA — cada um responde dentro do seu personagem, usando Gemini 2.0 Flash como modelo. Os leitores do livro são o público-alvo.

---

## Mudanças em relação ao spec anterior

| Aspecto | Spec anterior | Este spec |
|---|---|---|
| Contatos interativos | Subset com `interactive: true` | Todos os 4 (`inputEnabled: true`) |
| Campo de controle | `interactive` (novo) | `inputEnabled` (já existe) |
| Personagens | Elena Voss, Capitão Draven (exemplos fictícios) | Kai, Thalia, Mãe, Ágata (do app real) |
| Componente | Novo `ChatInterativo.jsx` | Adaptar `ChatWindow.jsx` existente |
| Animação do Kai | Mantida (falsa) | Removida, substituída por loading real |

---

## Arquitetura

```
┌─────────────────────────────────────────┐
│           Vite App (Vercel)             │
│                                         │
│  ┌──────────────┐   ┌────────────────┐  │
│  │  ChatWindow  │──▶│  /api/chat.js  │  │
│  │  (modificado)│   │  (novo)        │  │
│  └──────────────┘   └───────┬────────┘  │
│                             │           │
└─────────────────────────────┼───────────┘
                              │ HTTPS
                              ▼
                  ┌───────────────────────┐
                  │  Google AI Studio     │
                  │  Gemini 2.0 Flash     │
                  └───────────────────────┘
```

Tudo no mesmo projeto Vite. A Vercel detecta `/api` e publica como Serverless Functions. Backend **stateless** — histórico mantido em `useState` no cliente.

---

## Componentes

### 1. Configuração de Personagens — `src/data/characters.js`

IDs iguais aos `contact.id` de `chatData.jsx` para que o `ChatWindow` passe `contact.id` como `characterId` sem mapeamento extra.

```js
export const characters = {
  "kai": {
    name: "Kai",
    systemPrompt: `[PLACEHOLDER — descreva quem é Kai, seu universo, tom de voz e regras de personagem]`,
  },
  "thalia": {
    name: "Thalia",
    systemPrompt: `[PLACEHOLDER]`,
  },
  "mom": {
    name: "Mãe",
    systemPrompt: `[PLACEHOLDER]`,
  },
  "agata": {
    name: "Ágata",
    systemPrompt: `[PLACEHOLDER]`,
  },
}
```

Adicionar ou ajustar um personagem = editar só este arquivo.

### 2. chatData.jsx — atualização mínima

Todos os 4 contatos passam a ter `inputEnabled: true`. Nenhum campo novo.

```js
{ id: "kai",    name: "Kai",    ..., inputEnabled: true },
{ id: "thalia", name: "Thalia", ..., inputEnabled: true },
{ id: "mom",    name: "Mãe",   ..., inputEnabled: true },
{ id: "agata",  name: "Ágata",  ..., inputEnabled: true },
```

### 3. Serverless Function — `api/chat.js`

Endpoint `POST /api/chat`. Recebe `characterId` e histórico de mensagens, valida, aplica rate limit e chama Gemini.

**Request:**
```json
{
  "characterId": "kai",
  "messages": [
    { "role": "user",      "content": "string" },
    { "role": "assistant", "content": "string" }
  ]
}
```

**Response (sucesso):**
```json
{ "content": "string" }
```

**Response (erro):**
```json
{ "error": "string" }
```

### 4. Frontend — `ChatWindow.jsx` (mudanças)

**Remover:**
- `useEffect` da animação falsa do Kai ("Kai's incoming message animation")
- Estado `kaiMessageShown`
- Lógica condicional `contact.id === "kai"` no header e no efeito

**Adicionar:**
- Estado `loading: boolean` — `true` enquanto aguarda resposta da IA
- `handleSend` refatorado: se `contact.inputEnabled`, chama `POST /api/chat` antes de atualizar mensagens
- `showTyping` derivado de `loading` — o `TypingIndicator` existente já serve
- Status no header: "escrevendo..." quando `loading === true` (funciona para qualquer contato)
- Input desabilitado enquanto `loading === true`
- Histórico enviado integral a cada mensagem (backend stateless)
- Em caso de erro, adiciona mensagem de erro como resposta do contato (mantém imersão)

---

## Segurança

### API Key
`GEMINI_API_KEY` como variável de ambiente na Vercel. Nunca exposta ao frontend.

### Rate Limiting
Upstash Rate Limit (free tier: 10k requests/dia) dentro da serverless function, limitando por IP: **20 requests/minuto**.

### Validações de Input
Executadas no endpoint antes de qualquer chamada à API:
- `characterId` deve existir em `characters.js`
- `messages` não pode estar vazio
- Última mensagem ≤ **300 caracteres**

### Budget Cap
Configurar limite de gasto mensal no Google AI Studio.

---

## Error Handling

Erros são exibidos como mensagem do contato no chat (mantém imersão):

| Situação | HTTP | Mensagem para o leitor |
|---|---|---|
| `characterId` inválido | 400 | — (não deve ocorrer com o flow do app) |
| Mensagem muito longa | 400 | "Sua mensagem é muito longa. Tente resumir." |
| Rate limit atingido | 429 | "Muitas mensagens seguidas. Aguarde um momento." |
| Gemini fora do ar | 500 | "[Nome] não está disponível agora." |
| Erro genérico | 500 | "Algo deu errado. Tente novamente." |

---

## Estrutura de Arquivos

```
api/
  chat.js                     ← serverless function (CRIAR)
src/
  data/
    characters.js             ← system prompts dos personagens (CRIAR)
  lib/
    chatValidation.js         ← validação isolada (CRIAR)
    chatValidation.test.js    ← testes unitários (CRIAR)
  components/chat/
    ChatWindow.jsx            ← remover lógica falsa do Kai, adicionar AI (MODIFICAR)
    chatData.jsx              ← inputEnabled: true para todos (MODIFICAR)
.env.local                    ← chaves para desenvolvimento local (CRIAR)
```

Variáveis de ambiente na Vercel:
- `GEMINI_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

---

## Provedor de IA

**Google AI Studio — Gemini 2.0 Flash**
- Free tier: 1.500 requests/dia (compartilhado entre todos os leitores)
- Migração para plano pago: ativar billing — zero mudança de código

---

## Dependências a Instalar

```bash
npm install @google/generative-ai @upstash/ratelimit @upstash/redis
npm install -D vitest
```

---

## Fora de Escopo (v1)

- Persistência do histórico entre sessões
- Streaming de resposta (texto palavra por palavra)
- Autenticação de leitores
- System prompts editáveis sem deploy
- Múltiplos idiomas de system prompt
