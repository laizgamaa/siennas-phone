# Chat com IA — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar todos os 4 contatos do app (Kai, Thalia, Mãe, Ágata) interativos via IA, integrando Vercel Serverless Functions com Gemini 2.0 Flash.

**Architecture:** O `ChatWindow` existente detecta `contact.inputEnabled` para decidir se chama `POST /api/chat` ou apenas registra a mensagem localmente. O backend é stateless — o histórico da sessão é mantido em `useState` no cliente e enviado integralmente a cada request. Rate limiting por IP via Upstash protege o endpoint público.

**Tech Stack:** Vite + React + JavaScript, Vercel Serverless Functions, `@google/generative-ai`, `@upstash/ratelimit`, `@upstash/redis`, Vitest

---

## File Map

| Arquivo | Status | Responsabilidade |
|---|---|---|
| `src/data/characters.js` | Criar | System prompts e metadados dos 4 personagens |
| `src/lib/chatValidation.js` | Criar | Validação pura isolada (testável sem API) |
| `src/lib/chatValidation.test.js` | Criar | Testes unitários da validação |
| `api/chat.js` | Criar | Serverless function: valida, aplica rate limit, chama Gemini |
| `src/components/chat/ChatWindow.jsx` | Modificar | Remover animação falsa do Kai; adicionar lógica de resposta AI |
| `src/components/chat/chatData.jsx` | Modificar | `inputEnabled: true` para todos os 4 contatos |
| `vite.config.js` | Modificar | Adicionar config `test` para Vitest |
| `package.json` | Modificar | Instalar dependências; adicionar script `test` |
| `.env.local` | Criar | Chaves de API para desenvolvimento local |

---

### Task 1: Instalar dependências e configurar ambiente

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `vite.config.js`
- Create: `.env.local`

- [ ] **Step 1: Instalar dependências de produção**

```bash
npm install @google/generative-ai @upstash/ratelimit @upstash/redis
```

Expected: packages adicionados em `node_modules` e `package.json`.

- [ ] **Step 2: Instalar Vitest**

```bash
npm install -D vitest
```

Expected: `vitest` aparece em `devDependencies` no `package.json`.

- [ ] **Step 3: Adicionar script de test ao `package.json`**

Abrir `package.json`. Dentro de `"scripts"`, adicionar as duas linhas abaixo logo após `"preview"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

O resultado do bloco `"scripts"` deve ficar:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint . --quiet",
  "lint:fix": "eslint . --fix",
  "typecheck": "tsc -p ./jsconfig.json",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
},
```

- [ ] **Step 4: Adicionar config de test ao `vite.config.js`**

Abrir `vite.config.js`. Substituir o conteúdo completo por:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 5: Verificar que `.env.local` está no `.gitignore`**

O `.gitignore` já contém `.env.*` e `*.local`, que cobrem `.env.local`. Nenhuma ação necessária.

- [ ] **Step 6: Criar `.env.local` na raiz do projeto**

Criar o arquivo com os placeholders abaixo. Os valores reais serão preenchidos nas Tasks 4 e 5:

```
GEMINI_API_KEY=sua_chave_aqui
UPSTASH_REDIS_REST_URL=sua_url_aqui
UPSTASH_REDIS_REST_TOKEN=seu_token_aqui
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js
git commit -m "feat: instalar dependências e configurar Vitest"
```

---

### Task 2: Configuração dos personagens

**Files:**
- Create: `src/data/characters.js`

- [ ] **Step 1: Criar o diretório `src/data/`**

Se não existir:

```bash
mkdir src/data
```

- [ ] **Step 2: Criar `src/data/characters.js`**

```js
export const characters = {
  "kai": {
    name: "Kai",
    systemPrompt: `[PLACEHOLDER — descreva quem é Kai, seu universo, tom de voz e regras de personagem.
Exemplo: "Você é Kai, personagem do livro X. Fale de forma direta e provocadora. Nunca quebre o personagem."]`,
  },
  "thalia": {
    name: "Thalia",
    systemPrompt: `[PLACEHOLDER — descreva quem é Thalia, seu universo, tom de voz e regras de personagem.]`,
  },
  "mom": {
    name: "Mãe",
    systemPrompt: `[PLACEHOLDER — descreva quem é a Mãe da Sienna, seu relacionamento, tom de voz e regras de personagem.]`,
  },
  "agata": {
    name: "Ágata",
    systemPrompt: `[PLACEHOLDER — descreva quem é Ágata, seu universo, tom de voz e regras de personagem.]`,
  },
}
```

> Preencha os `[PLACEHOLDER]` com as descrições reais dos personagens do livro antes do deploy em produção. A estrutura é: quem o personagem é, como ele fala, o universo do livro, o que nunca deve fazer (ex: "nunca quebre o personagem" ou "nunca mencione o mundo real").

- [ ] **Step 3: Commit**

```bash
git add src/data/characters.js
git commit -m "feat: adicionar configuração dos personagens"
```

---

### Task 3: Lógica de validação (TDD)

**Files:**
- Create: `src/lib/chatValidation.test.js`
- Create: `src/lib/chatValidation.js`

- [ ] **Step 1: Escrever os testes**

Criar `src/lib/chatValidation.test.js`:

```js
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
```

- [ ] **Step 2: Rodar os testes — esperar falha**

```bash
npm test
```

Expected: FAIL com `Cannot find module './chatValidation'`

- [ ] **Step 3: Criar `src/lib/chatValidation.js`**

```js
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
```

- [ ] **Step 4: Rodar os testes — esperar sucesso**

```bash
npm test
```

Expected: `4 tests passed`

- [ ] **Step 5: Commit**

```bash
git add src/lib/chatValidation.js src/lib/chatValidation.test.js
git commit -m "feat: adicionar validação do chat com testes"
```

---

### Task 4: Serverless Function — Gemini (sem rate limiting)

**Files:**
- Create: `api/chat.js`

- [ ] **Step 1: Obter a API Key do Gemini**

1. Acesse [aistudio.google.com](https://aistudio.google.com)
2. Clique em **"Get API key"** → **"Create API key"**
3. Copie a chave gerada
4. Substitua o placeholder em `.env.local`:
   ```
   GEMINI_API_KEY=AIza...
   ```

- [ ] **Step 2: Criar o diretório `api/` na raiz do projeto**

Se não existir:

```bash
mkdir api
```

- [ ] **Step 3: Criar `api/chat.js`**

```js
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
```

- [ ] **Step 4: Instalar a Vercel CLI (se não tiver)**

Verificar se já existe:

```bash
vercel --version
```

Se o comando não existir:

```bash
npm install -g vercel
vercel login
```

Siga o fluxo de login no browser.

- [ ] **Step 5: Iniciar servidor local com Vercel dev**

```bash
vercel dev
```

Na primeira execução, o CLI pode perguntar sobre setup do projeto — confirme as opções padrão (framework: Vite, output directory: dist). Expected: servidor rodando em `http://localhost:3000`.

- [ ] **Step 6: Testar o endpoint — request válido**

Em outro terminal (com `vercel dev` rodando), executar via PowerShell:

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/chat" `
  -ContentType "application/json" `
  -Body '{"characterId":"kai","messages":[{"role":"user","content":"Oi!"}]}'
```

Expected: objeto com propriedade `content` contendo a resposta da IA.

- [ ] **Step 7: Testar o endpoint — request inválido**

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/chat" `
  -ContentType "application/json" `
  -Body '{"characterId":"nao-existe","messages":[{"role":"user","content":"oi"}]}' `
  -ErrorAction SilentlyContinue
```

Expected: erro com `{ "error": "Personagem inválido" }` e status 400.

- [ ] **Step 8: Commit**

```bash
git add api/chat.js
git commit -m "feat: criar serverless function /api/chat com Gemini"
```

---

### Task 5: Rate limiting com Upstash

**Files:**
- Modify: `api/chat.js`

- [ ] **Step 1: Criar conta e banco de dados no Upstash**

1. Acesse [console.upstash.com](https://console.upstash.com) e crie uma conta gratuita
2. Clique em **"Create Database"** → dê um nome (ex: `siennas-phone`) → escolha a região mais próxima → **"Create"**
3. Na tela do banco criado, copie:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Substitua os placeholders em `.env.local`:
   ```
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=AXxx...
   ```

- [ ] **Step 2: Substituir o conteúdo completo de `api/chat.js`**

```js
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

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] ?? "anonymous"
  const { success } = await ratelimit.limit(ip)

  if (!success) {
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
    if (err.status === 429) {
      return res.status(429).json({ error: "Muitas mensagens seguidas. Aguarde um momento." })
    }
    console.error("Erro Gemini:", err)
    res.status(500).json({ error: `${character.name} não está disponível agora.` })
  }
}
```

- [ ] **Step 3: Verificar que `vercel dev` ainda está rodando e testar um request normal**

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/chat" `
  -ContentType "application/json" `
  -Body '{"characterId":"kai","messages":[{"role":"user","content":"Oi!"}]}'
```

Expected: resposta com `content` (igual ao antes do rate limiting).

- [ ] **Step 4: Commit**

```bash
git add api/chat.js
git commit -m "feat: adicionar rate limiting por IP com Upstash"
```

---

### Task 6: Atualizar `chatData.jsx`

**Files:**
- Modify: `src/components/chat/chatData.jsx`

- [ ] **Step 1: Definir `inputEnabled: true` para todos os contatos**

Abrir `src/components/chat/chatData.jsx`. Substituir o array `contacts` completo por:

```js
export const contacts = [
  {
    id: "kai",
    name: "Kai",
    avatar: "K",
    color: "from-blue-500 to-indigo-600",
    status: "online",
    inputEnabled: true,
  },
  {
    id: "thalia",
    name: "Thalia",
    avatar: "T",
    color: "from-rose-400 to-pink-600",
    status: "offline",
    inputEnabled: true,
  },
  {
    id: "mom",
    name: "Mãe",
    avatar: "M",
    color: "from-amber-400 to-orange-500",
    status: "offline",
    inputEnabled: true,
  },
  {
    id: "agata",
    name: "Ágata",
    avatar: "A",
    color: "from-emerald-400 to-teal-600",
    status: "offline",
    inputEnabled: true,
  },
];
```

O array `staticMessages` não muda — continua exportado abaixo desta linha.

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/chatData.jsx
git commit -m "feat: habilitar input interativo para todos os contatos"
```

---

### Task 7: Modificar `ChatWindow.jsx`

**Files:**
- Modify: `src/components/chat/ChatWindow.jsx`

- [ ] **Step 1: Substituir o conteúdo completo de `ChatWindow.jsx`**

```jsx
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ChatWindow({
  contact,
  messages: initialMessages,
  onBack,
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages(initialMessages);
    setHistory([]);
    setLoading(false);
  }, [contact.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (text) => {
    const displayMsg = {
      id: Date.now(),
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, displayMsg]);

    if (!contact.inputEnabled) return;

    const apiMessage = { role: "user", content: text };
    const updatedHistory = [...history, apiMessage];

    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: contact.id,
          messages: updatedHistory,
        }),
      });
      const data = await response.json();
      const replyText = data.content ?? data.error ?? "Algo deu errado.";

      setHistory([...updatedHistory, { role: "assistant", content: replyText }]);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: contact.id,
          text: replyText,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: contact.id,
          text: "Não foi possível conectar. Tente novamente.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="md:hidden p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div
          className={cn(
            "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold text-sm shrink-0",
            contact.color
          )}
        >
          {contact.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm text-foreground">
            {contact.name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {loading
              ? "escrevendo..."
              : contact.status === "online"
              ? "Online"
              : "Visto recentemente"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4"
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender === "me"}
          />
        ))}
        {loading && <TypingIndicator />}
      </div>

      {/* Input */}
      <MessageInput
        enabled={contact.inputEnabled && !loading}
        onSend={handleSend}
      />
    </div>
  );
}
```

**O que mudou em relação ao original:**
- Removido: estado `kaiMessageShown`, `showTyping`
- Removido: `useEffect` da animação falsa do Kai (linhas 26-39)
- Removido: condicional `contact.id === "kai"` no header
- Adicionado: estados `history` (histórico API) e `loading`
- Adicionado: `handleSend` async que chama `/api/chat`
- Alterado: `<MessageInput enabled={contact.inputEnabled && !loading}>` desabilita durante loading

- [ ] **Step 2: Verificar que `vercel dev` está rodando**

Se não estiver:

```bash
vercel dev
```

- [ ] **Step 3: Testar no browser — checklist manual**

Abrir `http://localhost:3000` e verificar:

1. Abrir o chat do **Kai** → input de texto aparece habilitado
2. Enviar uma mensagem → input desabilita durante loading, "escrevendo..." aparece no header, `TypingIndicator` aparece na lista de mensagens
3. Resposta da IA aparece como mensagem do Kai
4. Enviar 2-3 mensagens em sequência → a IA responde com contexto da conversa (histórico mantido)
5. Trocar para **Thalia** → conversa reinicia limpa, input aparece, IA responde como Thalia
6. Repetir para **Mãe** e **Ágata**
7. Voltar para **Kai** → histórico resetado (comportamento esperado — sem persistência)

- [ ] **Step 4: Commit**

```bash
git add src/components/chat/ChatWindow.jsx
git commit -m "feat: integrar ChatWindow com /api/chat"
```

---

### Task 8: Deploy na Vercel

- [ ] **Step 1: Configurar variáveis de ambiente na Vercel**

1. Acesse [vercel.com](https://vercel.com) → seu projeto → **Settings → Environment Variables**
2. Adicionar as três variáveis abaixo, selecionando os ambientes **Production**, **Preview** e **Development**:

| Nome | Valor |
|---|---|
| `GEMINI_API_KEY` | Chave do Google AI Studio |
| `UPSTASH_REDIS_REST_URL` | URL do banco Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Token do banco Upstash |

- [ ] **Step 2: Configurar budget cap no Google AI Studio**

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Navegue até **Billing → Budgets & Alerts**
3. Criar um alerta com o valor máximo mensal que você aceita (ex: $5,00)

- [ ] **Step 3: Fazer o deploy para produção**

```bash
vercel --prod
```

Expected: URL de produção exibida no terminal (ex: `https://siennas-phone.vercel.app`)

- [ ] **Step 4: Verificar em produção**

1. Acessar a URL de produção no browser
2. Abrir qualquer chat e enviar uma mensagem
3. Confirmar que a IA responde
4. Verificar no painel do Upstash que os requests aparecem no dashboard

---

## Self-Review

**Cobertura do spec:**
- [x] Todos os 4 contatos com `inputEnabled: true` — Task 6
- [x] `characters.js` com IDs iguais aos `contact.id` — Task 2
- [x] Serverless function `/api/chat` — Task 4
- [x] Backend stateless, histórico no cliente — Task 7 (`history` state)
- [x] Rate limiting por IP (20 req/min) com Upstash — Task 5
- [x] Validação: characterId, messages vazio, 300 chars — Task 3
- [x] `GEMINI_API_KEY` nunca exposta ao frontend — garantido pela arquitetura
- [x] Budget cap — Task 8
- [x] Erro exibido como mensagem do personagem — Task 7 (`replyText = data.content ?? data.error`)
- [x] Animação falsa do Kai removida — Task 7
- [x] `TypingIndicator` durante loading — Task 7
- [x] Input desabilitado durante loading — Task 7 (`enabled={contact.inputEnabled && !loading}`)
- [x] System prompts placeholder — Task 2

**Consistência de tipos:**
- `validateChatRequest` definida em Task 3, usada em Task 4 ✓
- `characters` definido em Task 2 com keys `"kai"`, `"thalia"`, `"mom"`, `"agata"` ✓
- `contact.id` em Task 7 corresponde às keys de `characters` em Task 2 ✓
- `history` enviado como `{ role, content }[]` em Task 7 corresponde ao que a validação e a API esperam ✓
- `character.name` usado em `err.status === 500` em Task 4 — propriedade definida em Task 2 ✓
