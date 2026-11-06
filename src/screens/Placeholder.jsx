import { motion } from 'framer-motion'
import { useApp } from '../store.js'

const titles = {
  deck: 'Колода',
  stats: 'Дашборд',
  blitz: 'Блиц',
}

// заглушки экранов — их живую начинку: колода на шаге 4, дашборд на шаге 6, блиц на шаге 7
export default function Placeholder({ screen }) {
  const cards = useApp((s) => s.cards)
  if (screen === 'upload') return null
  if (screen === 'deck') {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}
        className="flex flex-1 items-center justify-center text-lg text-muted py-24"
      >
        {cards.length || 'Нет'} карточек ждут в колоде — FlipCard появится на шаге 4
      </motion.div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="flex flex-1 flex-col items-center justify-center gap-6 py-24"
    >
      <motion.span
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
        className="size-4 rounded-full bg-primary"
      />
      <p className="text-lg text-muted">{titles[screen] || screen}</p>
    </motion.div>
  )
}
