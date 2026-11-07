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

// shortcut: пока нет VITE_USE_MOCK=1 — сначала пробуем Laravel-прокси (/api/gigachat),
// при недоступном бэкенде падаем на честный mock, чтобы демо не умирало.
// 422 (валидация текста) — НЕ фолбэким на mock: показываем ошибку как есть.
async function requestCardsViaBackend(text, topic) {
  const r = await fetch('/api/gigachat/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, topic }),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) {
    const err = new Error(data.error || `Backend ${r.status}`)
    err.status = r.status
    throw err
  }
  return data.cards
}

export async function requestCards(text, topic, { mock = false } = {}) {
  if (mock) {
    const cards = extractFromText(text, topic)
    return new Promise((res) =>
      setTimeout(() => res(cards), 1500 + Math.random() * 500),
    )
  }
  try {
    return await requestCardsViaBackend(text, topic)
  } catch (e) {
    // ошибка валидации (422) — отдаём пользователю, не маскируем mock'ом
    if (e.status === 422) throw e
    // бэкенд не поднят / сеть / 5xx — mock-фолбэк (честное извлечение из текста)
    console.warn('GigaChat через бэкенд недоступен, mock:', e.message)
    const cards = extractFromText(text, topic)
    if (!cards.length) throw e
    return cards
  }
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
