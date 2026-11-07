import { useEffect, useState } from 'react'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { sound } from '../utils/sound.js'
import { BookmarkMuted } from './icons.jsx'

const SWIPE = 84 // px, после которых свайп считается ответом

// отклик на свайп: наклон + красная/зелёная тень + «печати» Знаю/Не знаю
function useSwipeFeedback(x) {
  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14])
  const boxShadow = useTransform(
    x,
    [-220, -50, 0, 50, 220],
    [
      '0 30px 74px -18px rgba(179, 38, 30, 0.55)',
      '0 24px 60px -24px rgba(179, 38, 30, 0.30)',
      '0 24px 60px -24px rgba(32, 37, 31, 0.28)',
      '0 24px 60px -24px rgba(47, 125, 79, 0.30)',
      '0 30px 74px -18px rgba(47, 125, 79, 0.55)',
    ],
  )
  const nahOpacity = useTransform(x, [-130, -55], [1, 0])
  const knowOpacity = useTransform(x, [55, 130], [0, 1])
  return { rotate, boxShadow, nahOpacity, knowOpacity }
}

// карточка: клик → 3D-флип, свайп → ответ; exit улетает в сторону последнего ответа
// fast=true — блиц: втрое короче пружины, карточки летят быстрее
// wide=true — раскладка макета 50:797: во весь контейнер, bookmark, подсказка снизу
export default function FlipCard({ card, stackDepth = 0, shakeKey = 0, flipKey = 0, fast = false, wide = false, onAnswer }) {
  const [flipped, setFlipped] = useState(false)
  const x = useMotionValue(0)
  const { rotate, boxShadow, nahOpacity, knowOpacity } = useSwipeFeedback(x)
  const controls = useAnimation()

  useEffect(() => { controls.start('center') }, [])

  // «Не знаю» — карточка трясётся и лишь потом улетает (задержку держит Deck)
  useEffect(() => {
    if (!shakeKey) return
    controls.start({
      x: [x.get(), -22, 22, -16, 16, -6, 0],
      transition: { duration: 0.42, ease: 'easeInOut' },
    })
  }, [shakeKey])

  useEffect(() => { if (flipKey) { sound.flip(); setFlipped((f) => !f) } }, [flipKey])

  function handleDragEnd(_, info) {
    if (info.offset.x > SWIPE) onAnswer({ known: true, swipe: true })
    else if (info.offset.x < -SWIPE) onAnswer({ known: false, swipe: true })
  }

  const radius = wide ? '12px' : '12px_120px_12px_12px'

  return (
    <motion.div
      className="absolute inset-0 cursor-grab select-none active:cursor-grabbing"
      data-card={card.id}
      initial={{ x: 0, y: 70, scale: 0.92, opacity: 0 }}
      variants={{
        center: { x: 0, y: 0, scale: 1, opacity: 1, transition: { duration: fast ? 0.18 : 0.4, ease: [0.22, 1, 0.36, 1] } },
      }}
      animate={controls}
      exit={(dir) => ({
        x: dir * 560, y: 80, opacity: 0, scale: 0.95,
        transition: { duration: fast ? 0.16 : 0.3, ease: 'easeIn' },
      })}
      drag="x"
      dragElastic={0.3}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, boxShadow, zIndex: 20 - stackDepth, transformStyle: 'preserve-3d' }}
      onClick={() => { if (Math.abs(x.get()) > 12) return; sound.flip(); setFlipped((f) => !f) }}
    >
      {/* внутренняя 3D-начинка */}
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: fast ? 0.26 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* лицо: вопрос */}
        <div
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-[12px] border border-[#dedfd6] bg-white p-10 ${wide ? 'items-center' : ''}`}
          style={{ backfaceVisibility: 'hidden', borderRadius: radius, boxShadow: '0px 8px 28px 0px rgba(36,39,32,0.04)' }}
        >
          <div className={`flex w-full items-center ${wide ? 'justify-between' : 'justify-start gap-2.5'}`}>
            <span className="flex items-center gap-2.5">
              <span className="size-1.5 bg-primary" />
              <span className="text-[10px] uppercase tracking-[1.2px] text-primary">Вопрос</span>
            </span>
            {wide && <BookmarkMuted className="size-[18px] text-[#85857d]" />}
          </div>
          <div className={`flex w-full flex-1 flex-col items-center justify-center ${wide ? 'text-center' : ''}`}>
            <p className={wide
              ? 'max-w-[650px] text-[36px] font-medium leading-[1.28] tracking-[-1.1px]'
              : 'mt-6 text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] break-words'}
            >
              {card.question}
            </p>
          </div>
          <p className={`w-full text-xs text-[#85857d] ${wide ? 'text-center' : 'mt-auto'}`}>
            {wide ? 'Попробуй ответить мысленно, прежде чем смотреть ответ.' : 'нажми на карточку или пробел — перевернётся'}
          </p>
        </div>

        {/* изнанка: ответ + source_quote */}
        <div
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-[12px] border border-[#dedfd6] bg-white p-10 ${wide ? 'items-center' : ''}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: radius, boxShadow: '0px 8px 28px 0px rgba(36,39,32,0.04)' }}
        >
          <div className={`flex w-full items-center ${wide ? 'justify-between' : 'justify-start gap-2.5'}`}>
            <span className="flex items-center gap-2.5">
              <span className="size-1.5 bg-primary" />
              <span className="text-[10px] uppercase tracking-[1.2px] text-primary">Ответ</span>
            </span>
            {wide && <BookmarkMuted className="size-[18px] text-[#85857d]" />}
          </div>
          <div className={`flex w-full flex-1 flex-col justify-center ${wide ? 'items-center text-center' : ''}`}>
            <p className={wide
              ? 'max-w-[650px] text-[28px] font-medium leading-[1.3] tracking-[-0.7px]'
              : 'mt-6 text-[22px] leading-[1.35] tracking-[-0.3px] break-words'}
            >
              {card.answer}
            </p>
          </div>
          <div className={`w-full ${wide ? 'text-center' : 'mt-auto border-t border-line pt-4'}`}>
            <p className="font-serif text-xs italic leading-[1.5] text-[#85857d]">«{card.source_quote}»</p>
            {card.topic && <p className="mt-2 text-[10px] uppercase tracking-[1px] text-[#85857d]/70">{card.topic}</p>}
          </div>
        </div>
      </motion.div>

      {/* печати-отклики поверх (вне флипа) */}
      <motion.span
        style={{ opacity: nahOpacity }}
        className="absolute left-8 top-8 -rotate-12 rounded border-[3px] border-[#b3261e] px-2 py-0.5 text-sm font-bold uppercase text-[#b3261e]"
      >
        Не знаю
      </motion.span>
      <motion.span
        style={{ opacity: knowOpacity }}
        className="absolute right-8 top-8 rotate-12 rounded border-[3px] border-[#2f7d4f] px-2 py-0.5 text-sm font-bold uppercase text-[#2f7d4f]"
      >
        Знаю
      </motion.span>
    </motion.div>
  )
}
