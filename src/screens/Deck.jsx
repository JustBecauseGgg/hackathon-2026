import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FlipCard from '../components/FlipCard.jsx'
import MagneticButton from '../components/MagneticButton.jsx'
import { ArrowUpRight, CheckPlain, MoveLeft, MoveRight, Rotate3D, XClose } from '../components/icons.jsx'
import { useApp } from '../store.js'
import { sound } from '../utils/sound.js'

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
}

export default function Deck() {
  const { cards, queue, streaks, stats, topic, answer, resetDeck, setScreen } = useApp()
  const [dir, setDir] = useState(1) // 1 = вправо («Знаю»), -1 = влево
  const [shakeKey, setShakeKey] = useState(0)
  const [flipKey, setFlipKey] = useState(0)
  const locked = useRef(false)

  const knownCount = cards.filter((c) => (streaks[c.id] || 0) >= 1).length
  const done = cards.length ? knownCount / cards.length : 0
  const completed = cards.length > 0 && !queue.length

  const currentId = queue[0]
  const current = cards.find((c) => c.id === currentId)
  const answeredCount = stats.answered

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

  /* ── финал колоды: конфетти + отсылка к дашборду ── */
  if (completed) {
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
            Вся статистика сессии — в личном кабинете.
          </motion.p>

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

  /* ── игровой экран по макету 50:797 ── */
  return (
    <motion.section
      variants={rise} initial="hidden" animate="show" exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
      className="flex flex-1 flex-col items-center gap-7 px-16 pb-12 pt-10"
    >
      <div className="flex w-full max-w-[800px] flex-col gap-5">
        {/* режимы + таймер */}
        <motion.div variants={rise} custom={0} className="flex items-center justify-between">
          <div className="flex items-start gap-1 rounded-[6px] bg-[#eeede5] p-1">
            <span className="rounded-[4px] bg-white px-4 py-[9px] text-xs font-medium text-primary">Карточки</span>
            <button
              onClick={() => setScreen('blitz')}
              className="cursor-pointer rounded-[4px] px-4 py-[9px] text-xs text-muted transition-colors hover:text-primary"
            >
              Блиц
            </button>
          </div>
          <span className="text-xs text-muted">Без таймера</span>
        </motion.div>

        {/* название подборки + счётчик */}
        <motion.div variants={rise} custom={1} className="flex items-end justify-between">
          <div className="flex flex-col gap-[7px]">
            <span className="text-[10px] tracking-[1px] text-primary uppercase">{topic || 'Конспект'}</span>
            <h1 className="text-[28px] font-medium leading-[1.2] tracking-[-0.7px]">
              {topic || 'Карточки из конспекта'}
            </h1>
          </div>
          <span className="text-[13px] text-muted">{knownCount} из {cards.length}</span>
        </motion.div>

        {/* тонкий прогресс-бар */}
        <div className="h-1 w-full overflow-hidden rounded-[2px] bg-line">
          <motion.div
            className="h-full rounded-[2px] bg-primary"
            animate={{ width: `${Math.round(done * 100)}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* карточка-вопрос (та же FlipCard: свайпы, флип, печати) */}
      <motion.div variants={rise} custom={2} className="flex w-full max-w-[800px] flex-1 items-center justify-center py-2">
        <div className="relative h-[340px] w-full" style={{ perspective: 1400 }}>
          <AnimatePresence custom={dir} mode="sync">
            {current && (
              <FlipCard
                key={currentId}
                card={current}
                wide
                shakeKey={shakeKey}
                flipKey={flipKey}
                onAnswer={handleAnswer}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* управление карточкой */}
      <motion.div variants={rise} custom={3} className="flex w-full max-w-[800px] items-center justify-center gap-4">
        <button
          onClick={() => handleAnswer({ known: false })}
          className="flex h-14 w-[240px] cursor-pointer items-center justify-center gap-[10px] rounded-[6px] border border-line bg-white text-sm font-medium transition-colors hover:border-[#b3261e] hover:text-[#b3261e]"
        >
          <XClose className="size-[18px]" />
          Не знаю
        </button>
        <MagneticButton
          onClick={() => setFlipKey((k) => k + 1)}
          className="flex h-14 w-[288px] cursor-pointer items-center justify-center gap-[10px] rounded-[6px] border border-primary bg-gradient-to-r from-primary to-[#ac1328] text-sm font-medium text-white"
        >
          <Rotate3D className="size-[18px]" />
          Показать ответ
        </MagneticButton>
        <button
          onClick={() => handleAnswer({ known: true })}
          className="flex h-14 w-[240px] cursor-pointer items-center justify-center gap-[10px] rounded-[6px] border border-line bg-white text-sm font-medium transition-colors hover:border-[#2f7d4f] hover:text-[#2f7d4f]"
        >
          <CheckPlain className="size-[18px]" />
          Знаю
        </button>
      </motion.div>

      {/* как учиться: жесты + подсказка */}
      <motion.div variants={rise} custom={4} className="flex w-full max-w-[800px] flex-col items-center gap-3">
        <div className="flex items-center gap-8 text-xs text-muted">
          <span className="flex items-center gap-[7px]">
            <MoveLeft className="size-4" /> Влево — «Не знаю»
          </span>
          <span className="flex items-center gap-[7px]">
            Вправо — «Знаю» <MoveRight className="size-4" />
          </span>
        </div>
        <p className="text-center text-xs leading-[1.65] text-muted">
          Листай карточки свайпом или используй кнопки.<br />
          Незнакомые карточки вернутся раньше для повторения.
        </p>
      </motion.div>
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
