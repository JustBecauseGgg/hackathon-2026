import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FlipCard from '../components/FlipCard.jsx'
import MagneticButton from '../components/MagneticButton.jsx'
import { ArrowUpRight } from '../components/icons.jsx'
import { useApp } from '../store.js'
import { sound } from '../utils/sound.js'

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
}

function fmtTime(ms) {
  const s = Math.max(1, Math.round(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function Deck() {
  const { cards, queue, streaks, stats, topic, answer, resetDeck, setScreen } = useApp()
  const [dir, setDir] = useState(1) // 1 = вправо («Знаю»), -1 = влево
  const [shakeKey, setShakeKey] = useState(0)
  const [flipKey, setFlipKey] = useState(0)
  const locked = useRef(false)

  const knownCount = cards.filter((c) => (streaks[c.id] || 0) >= 1).length
  const done = knownCount / cards.length
  const completed = cards.length > 0 && !queue.length

  const currentId = queue[0]
  const current = cards.find((c) => c.id === currentId)
  const behind = queue.slice(1, 3).map((id) => cards.find((c) => c.id === id))

  function handleAnswer({ known, swipe = false }) {
    if (locked.current || !currentId) return
    setDir(known ? 1 : -1)
    known ? sound.know() : sound.nah()
    // по кнопке «Не знаю» — сначала трясём, потом улетает; свайп уходит сразу
    if (!known && !swipe) {
      locked.current = true
      setShakeKey((k) => k + 1)
      setTimeout(() => { locked.current = false; answer(false) }, 430)
      return
    }
    answer(known)
  }

  useEffect(() => { if (sound.enabled()) sound.fanfare() }, [completed])
  // клавиатура: пробел — флип, ←/→ — ответы
  useEffect(() => {
    const h = (e) => {
      if (e.key === ' ') { e.preventDefault(); setFlipKey((k) => k + 1) }
      if (e.key === 'ArrowRight') handleAnswer({ known: true, swipe: true })
      if (e.key === 'ArrowLeft') handleAnswer({ known: false, swipe: true })
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  /* ── финал колоды: конфетти + статистика сессии ── */
  if (completed) {
    const ms = stats.finishedAt - stats.startedAt
    const errPct = stats.answered ? Math.round((stats.wrong / stats.answered) * 100) : 0
    return (
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-16 py-16">
        <Confetti />
        <motion.div
          variants={rise} initial="hidden" animate="show" exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
          className="flex max-w-[620px] flex-col items-center text-center"
        >
          <motion.div variants={rise} custom={0} className="flex items-center gap-2.5">
            <span className="size-1.5 bg-primary" />
            <span className="text-xs uppercase tracking-[1.2px] text-primary">Колода пройдена</span>
          </motion.div>
          <motion.h1 variants={rise} custom={1} className="mt-5 text-[52px] font-medium leading-[1.05] tracking-[-2px]">
            Каждая карточка — <span className="font-serif italic tracking-normal text-primary">знаешь.</span>
          </motion.h1>
          <motion.p variants={rise} custom={2} className="mt-4 text-lg text-muted">
            Каждая карточка закрыта «Знаю». Ошибки вернулись в очередь — интервалы сработали.
          </motion.p>

          <motion.div variants={rise} custom={3} className="mt-10 grid w-full grid-cols-4 gap-px overflow-hidden rounded-md border border-line bg-line">
            {[['Время', fmtTime(ms)], ['Ответов', stats.answered], ['Ошибок', `${errPct}%`], ['Карточек', cards.length]].map(([k, v]) => (
              <div key={k} className="flex flex-col items-center gap-1 bg-white px-3 py-5">
                <span className="text-[22px] font-semibold tracking-tight">{v}</span>
                <span className="text-[10px] uppercase tracking-[1px] text-muted">{k}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={rise} custom={4} className="mt-10 flex items-center gap-4">
            <MagneticButton
              onClick={() => setScreen('stats')}
              className="flex h-14 items-center gap-5 rounded-md bg-primary px-6 text-base text-white"
            >
              К дашборду
              <ArrowUpRight className="size-5" />
            </MagneticButton>
            <button
              onClick={resetDeck}
              className="rounded-md border border-line px-6 py-4 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              Учить снова
            </button>
          </motion.div>
        </motion.div>
      </section>
    )
  }

  /* ── игровой экран ── */
  return (
    <motion.section
      variants={rise} initial="hidden" animate="show" exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
      className="flex flex-1 flex-col px-16 py-10"
    >
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-2.5">
          <span className="size-1.5 bg-primary" />
          <span className="text-xs uppercase tracking-[1.2px] text-primary">Колода{topic ? ` · ${topic}` : ''}</span>
        </div>
        <span className="text-xs text-muted">выучено {knownCount} / {cards.length} · в очереди {queue.length}</span>
      </div>

      {/* градиентный прогресс: доля закрытых «Знаю» карточек */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line/60">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #720a18, #b14a3a)' }}
          animate={{ width: `${Math.round(done * 100)}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </div>

      <div className="flex flex-1 items-center justify-center py-6">
        <div className="relative h-[540px] w-[420px]" style={{ perspective: 1400 }}>
          {/* стек: следующие карты позади, мельче и ниже */}
          {behind.map((c, i) => {
            if (!c) return null
            const depth = i + 1
            return (
              <div
                key={c.id}
                className="absolute inset-0 rounded-[12px_120px_12px_12px] border border-line bg-white p-8"
                style={{
                  transform: `scale(${1 - depth * 0.045}) translateY(${depth * 18}px)`,
                  opacity: 1 - depth * 0.3,
                  zIndex: 10 - depth,
                  boxShadow: '0 18px 40px -24px rgba(32, 37, 31, 0.25)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="size-1.5 bg-primary/50" />
                  <span className="text-[10px] uppercase tracking-[1.2px] text-muted">Термин</span>
                </div>
                <p className="mt-5 text-[20px] font-semibold tracking-tight text-muted/80">{c.question}</p>
              </div>
            )
          })}

          {/* верхняя карта, живёт между экранами встречи через AnimatePresence */}
          {current && (
            <AnimatePresence custom={dir} mode="sync">
              <FlipCard
                key={currentId}
                card={current}
                shakeKey={shakeKey}
                flipKey={flipKey}
                onAnswer={handleAnswer}
              />
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* кнопки */}
      <div className="flex items-center justify-center gap-4 pb-2">
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
          onClick={() => handleAnswer({ known: false })}
          className="flex h-14 items-center rounded-md border-2 border-[#b3261e] px-8 text-base font-medium text-[#b3261e] transition-colors hover:bg-[#b3261e]/5"
        >
          Не знаю
        </motion.button>
        <button
          onClick={() => setFlipKey((k) => k + 1)}
          className="rounded-md px-4 py-2 text-sm text-muted transition-colors hover:text-primary"
        >
          Показать ответ
        </button>
        <MagneticButton
          onClick={() => handleAnswer({ known: true })}
          className="flex h-14 items-center rounded-md bg-[#2f7d4f] px-8 text-base font-medium text-white"
        >
          Знаю
        </MagneticButton>
      </div>
      <p className="pb-2 text-center text-[11px] text-muted/70">
        свайп ← не знаю · свайп → знаю · пробел — перевернуть
      </p>
    </motion.section>
  )
}

/* конфетти без библиотек: двадцать плёнок падают циклом */
function Confetti() {
  const colors = ['#720a18', '#20251f', '#2f7d4f', '#d9a13b']
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-[2px]"
          style={{
            left: `${(i * 4.5 + (i * 37) % 11) % 97}%`,
            width: 8,
            height: 14,
            background: colors[i % colors.length],
          }}
          initial={{ y: '-10vh', opacity: 0 }}
          animate={{ y: '106vh', rotate: i % 2 ? 320 : -280, opacity: [0, 1, 1, 0.9] }}
          transition={{
            duration: 1.8 + (i % 5) * 0.35,
            delay: (i % 8) * 0.12,
            repeat: Infinity,
            repeatDelay: 1 + (i % 3) * 0.4,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}
