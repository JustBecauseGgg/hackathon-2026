import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const steps = [
  'Читаем конспект…',
  'Ищем термины и определения…',
  'Ставим ссылки на источники (source_quote)…',
  'Собираем колоду…',
]

export default function Loading() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => Math.min(v + 1, steps.length - 1)), 500)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
      className="flex flex-1 flex-col items-center justify-center gap-10 py-24"
    >
      {/* три карты веером с пульсацией */}
      <div className="relative h-40 w-56">
        {[-8, 0, 8].map((r, k) => (
          <motion.div
            key={r}
            className="absolute inset-x-0 top-3 h-32 w-56 rounded-lg border border-line bg-white shadow-sm"
            style={{ transformOrigin: '50% 100%' }}
            animate={{ rotate: r, y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 + k * 0.2, ease: 'easeInOut' }}
          />
        ))}
        <motion.span
          className="absolute inset-0 m-auto size-3 rounded-full bg-primary"
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      </div>

      <div className="w-[320px]">
        <h2 className="text-center font-semibold tracking-tight">{steps[i]}</h2>
        {/* градиентный прогресс — заполняется по «шагам» */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line/60">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #720a18, #b14a3a)' }}
            animate={{ width: `${((i + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
