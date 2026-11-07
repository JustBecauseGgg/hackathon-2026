import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FlipCard from '../components/FlipCard.jsx'
import MagneticButton from '../components/MagneticButton.jsx'
import { ArrowUpRight } from '../components/icons.jsx'
import { useApp } from '../store.js'
import { sound } from '../utils/sound.js'

const BLITZ_MS = 5 * 60 * 1000
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function fmt(ms) {
  const s = Math.ceil(ms / 1000)
  return `${String(Math.floor(s / 60))}:${String(s % 60).padStart(2, '0')}`
}

export default function Blitz() {
  const { cards, topic, setScreen, resetDeck } = useApp()

  // блиц живёт в локальном стейте: без возвратов и стриков — отвечай и дальше
  const [run, setRun] = useState(0)
  const list = useMemo(() => shuffle(cards), [cards, run])
  const [i, setI] = useState(0)
  const [results, setResults] = useState({ answered: 0, known: 0 })
  const [left, setLeft] = useState(BLITZ_MS)
  const timeUp = left <= 0

  useEffect(() => {
    const t = setInterval(() => setLeft((v) => Math.max(0, v - 1000)), 1000)
    return () => clearInterval(t)
  }, [])

  if (!cards.length) {
    return (
      <motion.section variants={rise} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.2 } }}
        className="flex flex-1 flex-col items-center justify-center gap-6 px-16">
        <div className="flex items-center gap-2.5">
          <span className="size-1.5 bg-primary" />
          <span className="text-xs uppercase tracking-[1.2px] text-primary">Блиц</span>
        </div>
        <p className="text-lg text-muted">Нет карточек для блица — сначала сделай колоду.</p>
        <MagneticButton onClick={() => setScreen('upload')}
          className="flex h-14 items-center gap-5 rounded-md bg-primary px-6 text-base text-white">
          К загрузке <ArrowUpRight className="size-5" />
        </MagneticButton>
      </motion.section>
    )
  }

  /* ── время вышло: итог блица ── */
  if (timeUp) {
    // cards уже все «знаем» ×? блиц не трогает очередь — колода остаётся как была
    const acc = results.answered ? Math.round((results.known / results.answered) * 100) : 0
    return (
      <motion.section variants={rise} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.2 } }}
        className="flex flex-1 flex-col items-center justify-center overflow-hidden px-16">
        <motion.div variants={rise} initial="show" animate="show" className="flex flex-col items-center text-center">
          <motion.div custom={0} variants={rise} className="flex items-center gap-2.5">
            <span className="size-1.5 bg-primary" />
            <span className="text-xs uppercase tracking-[1.2px] text-primary">Блиц закончен</span>
          </motion.div>
          <motion.h1 custom={1} variants={rise} className="mt-5 text-[52px] font-medium leading-[1.05] tracking-[-2px]">
            За 5 минут — <span className="font-serif italic tracking-normal text-primary">{results.answered} ответов.</span>
          </motion.h1>
          <motion.p custom={2} variants={rise} className="mt-4 text-lg text-muted">
            «Знаю»: {results.known} · точность {acc}%
          </motion.p>
          <motion.div custom={3} variants={rise} className="mt-10 flex items-center gap-4">
            <MagneticButton onClick={() => setScreen('dashboard')}
              className="flex h-14 items-center gap-5 rounded-md bg-primary px-6 text-base text-white">
              К дашборду <ArrowUpRight className="size-5" />
            </MagneticButton>
            <button
              onClick={() => { setI(0); setResults({ answered: 0, known: 0 }); setLeft(BLITZ_MS); setRun((r) => r + 1) }}
              className="rounded-md border border-line px-6 py-4 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              Ещё блиц
            </button>
            <button onClick={resetDeck} className="text-sm text-muted transition-colors hover:text-primary">
              Переучить колоду
            </button>
          </motion.div>
        </motion.div>
      </motion.section>
    )
  }

  /* ── живой блиц ── */
  const card = list[i % list.length]

  function handle({ known }) {
    known ? sound.know() : sound.nah()
    setResults((r) => ({ answered: r.answered + 1, known: r.known + (known ? 1 : 0) }))
    setI((v) => v + 1)
  }

  const urgency = left < BLITZ_MS * 0.3 // последние 1.5 минуты — красный таймер

  return (
    <motion.section
      variants={rise} initial="hidden" animate="show" exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
      className="flex flex-1 flex-col px-16 py-10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="size-1.5 bg-primary" />
          <span className="text-xs uppercase tracking-[1.2px] text-primary">Блиц{topic ? ` · ${topic}` : ''}</span>
        </div>
        <div className="flex items-center gap-6">
          <motion.span
            animate={urgency ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ repeat: urgency ? Infinity : 0, duration: 1, ease: 'easeInOut' }}
            className={`text-2xl font-semibold tabular-nums tracking-tight ${urgency ? 'text-primary' : ''}`}
          >
            {fmt(left)}
          </motion.span>
          <span className="text-sm text-muted">ответов: <b className="tabular-nums">{results.answered}</b> · «знаю»: <b className="tabular-nums">{results.known}</b></span>
        </div>
      </div>

      {/* градиентный бар падает вместо заполнения */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line/60">
        <motion.div
          className="h-full rounded-full"
          style={{ background: urgency ? '#720a18' : 'linear-gradient(90deg, #720a18, #b14a3a)' }}
          animate={{ width: `${(left / BLITZ_MS) * 100}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>

      <div className="flex flex-1 items-center justify-center py-6">
        <div className="relative h-[540px] w-[420px]" style={{ perspective: 1400 }}>
          <AnimatePresence custom={1} mode="sync">
            <FlipCard
              key={`${card.id}·${i}`}
              card={card}
              fast
              onAnswer={handle}
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 pb-2">
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
          onClick={() => handle({ known: false })}
          className="flex h-12 cursor-pointer items-center rounded-md border-2 border-[#b3261e] px-7 text-base font-medium text-[#b3261e] transition-colors hover:bg-[#b3261e]/5"
        >
          Не знаю
        </motion.button>
        <MagneticButton onClick={() => handle({ known: true })}
          className="flex h-12 cursor-pointer items-center rounded-md bg-[#2f7d4f] px-7 text-base font-medium text-white">
          Знаю
        </MagneticButton>
      </div>
      <p className="pb-2 text-center text-[11px] text-muted/70">
        блиц: карточки не возвращаются, успей максимум за 5 минут
      </p>
    </motion.section>
  )
}
