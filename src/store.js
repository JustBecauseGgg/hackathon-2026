import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { requestCards } from './api/gigachat.js'
import { loginUser, registerUser } from './api/auth.js'

// свежий прогон по той же колоде (и после генерации, и по «Учить снова»)
function freshDeck(cards) {
  return {
    queue: cards.map((c) => c.id),
    streaks: {},
    stats: { answered: 0, known: 0, wrong: 0, startedAt: Date.now(), finishedAt: null },
  }
}

// shortcut: всё состояние in-memory (без БД, mock-данные); decks и user переживают
// перезагрузку через localStorage persist — остальное (очередь, экран) сессия сбрасывает
export const useApp = create(persist(
  (set, get) => ({
  screen: 'main',
  user: null,
  setScreen: (screen) => set({ screen }),
  sourceText: '',
  setSourceText: (sourceText) => set({ sourceText }),
  topic: '',
  setTopic: (topic) => set({ topic }),
  cards: [],
  // ошибка генерации (показывается на Upload) — null, когда всё ок
  genError: null,
  // ошибка генерации (показывается на Upload) — null, когда всё ок
  genError: null,
  // история завершённых прогонов — данные дашборда (mock, в памяти)
  decks: [],
  // очередь: id-шники карточек «на столе»; «Знаю» — карточка уходит, «Не знаю» — возвращается через 2
  queue: [],
  streaks: {},
  stats: { answered: 0, known: 0, wrong: 0, startedAt: null, finishedAt: null },

    async generateCards() {
      const { sourceText, topic } = get()
      set({ screen: 'loading', genError: null })
      try {
        // shortcut: VITE_USE_MOCK=1 в .env.local принудительно включает mock (демо без бэкенда)
        const cards = await requestCards(sourceText, topic, { mock: import.meta.env?.VITE_USE_MOCK === '1' })
        set({ ...freshDeck(cards), cards, screen: 'deck' })
        return cards
      } catch (e) {
        set({ screen: 'upload', genError: e.message })
        return []
      }
    },

  //.interval-логика: «Не знаю» — стрик сброс и назад через 2 карточки;
  // «Знаю» — карточка уходит (настоящее SRS нужно для длинных колод; ×1 — чтобы демо не зацикливалось)
  answer(known) {
    const { queue, streaks, stats, cards } = get()
    if (!queue.length) return
    const [id, ...rest] = queue
    const nextStreaks = { ...streaks, [id]: known ? (streaks[id] || 0) + 1 : 0 }
    let nextQueue = rest
    if (!known) {
      const at = Math.min(2, nextQueue.length)
      nextQueue = [...nextQueue.slice(0, at), id, ...nextQueue.slice(at)]
    }
    const nextStats = {
      ...stats,
      answered: stats.answered + 1,
      known: stats.known + (known ? 1 : 0),
      wrong: stats.wrong + (known ? 0 : 1),
    }
    // очередь пуста ⇔ каждая карточка набрала «Знаю» 2 подряд (или колода из 1 карточки,
  // где reinsert физически некуда ставить) → колода пройдена
    let nextDecks = get().decks
    if (!nextQueue.length && cards.length) {
      nextStats.finishedAt = Date.now()
      nextDecks = [...nextDecks, {
        id: `deck_${nextDecks.length + 1}`,
        topic: get().topic || 'Без темы',
        cards: cards.length,
        answered: nextStats.answered,
        known: nextStats.known,
        wrong: nextStats.wrong,
        timeMs: nextStats.finishedAt - stats.startedAt,
        at: nextStats.finishedAt,
      }]
    }
    set({ queue: nextQueue, streaks: nextStreaks, stats: nextStats, decks: nextDecks })
  },

  resetDeck() {
    set((s) => ({ ...freshDeck(s.cards) }))
  },

  async login(email, password) {
    const user = await loginUser(email, password)
    set({ user, screen: 'dashboard' })
    return user
  },

  async register(name, email, password) {
    const user = await registerUser(name, email, password)
    set({ user, screen: 'dashboard' })
    return user
  },

  logout: () => set({ user: null, screen: 'main' }),
  }),
  {
    name: 'studstorm_state',
    storage: createJSONStorage(() => localStorage),
    // сохраняем только историю колод и юзера — экран/очередь/текст конспекта остаются сессионными
    partialize: (s) => ({ decks: s.decks, user: s.user }),
    // user восстановлен, а экран сессионный ('main') — сразу открываем дашборд
    merge: (persisted, current) => ({
      ...current,
      ...persisted,
      screen: persisted?.user ? 'dashboard' : current.screen,
    }),
  },
))
