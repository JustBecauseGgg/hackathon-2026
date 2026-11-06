import { create } from 'zustand'
import { requestCards } from './api/gigachat.js'

// shortcut: всё состояние in-memory (без persist и БД, mock-данные) —
// перезагрузка страницы сбрасывает прогресс; если нужно пережить reload, вешаем zustand/middleware persist
export const useApp = create((set, get) => ({
  screen: 'upload',
  setScreen: (screen) => set({ screen }),
  sourceText: '',
  setSourceText: (sourceText) => set({ sourceText }),
  topic: '',
  setTopic: (topic) => set({ topic }),
  cards: [],

  async generateCards() {
    const { sourceText, topic } = get()
    set({ screen: 'loading' })
    const cards = await requestCards(sourceText, topic)
    set({ cards, screen: 'deck' })
    return cards
  },
}))
