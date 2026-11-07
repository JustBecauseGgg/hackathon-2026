import { create } from 'zustand'
import { requestCards } from './api/gigachat.js'
import { loginUser, registerUser } from './api/auth.js'

// shortcut: всё состояние in-memory (без persist и БД, mock-данные) —
// перезагрузка страницы сбрасывает прогресс; если нужно пережить reload, вешаем zustand/middleware persist
export const useApp = create((set, get) => ({
  screen: 'login',
  user: null,
  setScreen: (screen) => set({ screen }),
  sourceText: '',
  setSourceText: (sourceText) => set({ sourceText }),
  topic: '',
  setTopic: (topic) => set({ topic }),
  cards: [],

  async generateCards() {
    const { sourceText, topic } = get()
    set({ screen: 'loading' })
    const cards = await requestCards(sourceText, topic, { mock: !import.meta.env?.VITE_ROUTERAI_KEY })
    set({ cards, screen: 'deck' })
    return cards
  },

  async login(email, password) {
    const user = await loginUser(email, password)
    set({ user, screen: 'upload' })
    return user
  },

  async register(name, email, password) {
    const user = await registerUser(name, email, password)
    set({ user, screen: 'upload' })
    return user
  },

  logout: () => set({ user: null, screen: 'login' }),
}))
