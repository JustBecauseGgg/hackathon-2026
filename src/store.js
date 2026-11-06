import { create } from 'zustand'

// shortcut: всё состояние держим в памяти + моки, без сервера и БД — если понадобится
// синхрон между устройствами, переезжаем на persist-подписку и API
export const useApp = create((set) => ({
  screen: 'upload',
  setScreen: (screen) => set({ screen }),
  sourceText: '',
  setSourceText: (sourceText) => set({ sourceText }),
  topic: '',
  setTopic: (topic) => set({ topic }),
}))
