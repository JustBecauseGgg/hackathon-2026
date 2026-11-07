// Контракт карточек: { id, type: 'term-definition', question, answer, source_quote, topic }

export const SYSTEM_PROMPT =
  "Ты — строгий ассистент по конспектам. Извлеки карточки строго из предоставленного текста. " +
  "Не используй внешние знания. Формат ответа: строгий JSON массив объектов. " +
  "Шаблоны: 1) 'term' -> 'definition', 2) 'entity' -> 'property'. " +
  "Каждая карточка должна содержать поле 'source_quote' — цитату из текста, откуда взят ответ. " +
  "Если не можешь составить карточку без выдумывания — пропусти этот фрагмент."

const MAX_CARDS = 20
const MIN_TERM = 3
const MIN_ANSWER = 10

// ключ кладём в .env.local (он в .gitignore через *.local), имя — VITE_ROUTERAI_KEY
const API_URL = 'https://routerai.ru/api/v1/chat/completions'
const MODEL = 'openai/'
const API_KEY = import.meta.env?.VITE_ROUTERAI_KEY

export async function requestCards(text, topic, { mock = true } = {}) {
  if (!mock) {
    const r = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Тема: ${topic}\n\nТекст:\n${text}` },
        ],
      }),
    })
    if (!r.ok) throw new Error(`RouterAI ${r.status}: ${await r.text()}`)
    const raw = (await r.json()).choices[0].message.content
    return JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ''))
  }

  const cards = extractFromText(text, topic)
  return new Promise((res) =>
    setTimeout(() => res(cards), 1500 + Math.random() * 500),
  )
}

// Honest mock: как и настоящий ИИ по промпту, извлекает ТОЛЬКО из текста —
// если во фрагменте нет шаблона «определение», карточка не делается (без выдумок).
export function extractFromText(text, topic = '') {
  const sentences = text.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/)
  const seen = new Set()
  const cards = []
  for (const s of sentences.slice(0, 400)) {
    const m = s.match(new RegExp(
      `^(.{${MIN_TERM},60}?)\\s+(?:[-–—]\\s+|это\\s+(?:—\\s+)?|называется\\s+|обозначает\\s+)(.{${MIN_ANSWER},300})$`,
    ))
    if (!m) continue
    const question = m[1].trim().replace(/[«"'.,]+$/, '')
    const answer = m[2].trim().replace(/^(?:это|т\. е\.)\s+/i, '').replace(/[.]$/, '')
    if (answer.split(' ').length < 2 || question.toLowerCase() === answer.toLowerCase()) continue
    const key = question.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    cards.push({
      id: `card_${cards.length + 1}`,
      type: 'term-definition',
      question,
      answer,
      source_quote: s.replace(/[.]$/, ''),
      topic,
    })
    if (cards.length >= MAX_CARDS) break
  }
  return cards
}
