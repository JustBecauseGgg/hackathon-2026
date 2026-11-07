import { useState } from 'react'
import { motion } from 'framer-motion'
import MagneticButton from '../components/MagneticButton.jsx'
import { ArrowUpRight, Check } from '../components/icons.jsx'
import { useApp } from '../store.js'
import { extractText } from '../utils/parseFile.js'

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Upload() {
  const { setSourceText, sourceText, topic, setTopic, generateCards, screen, genError } = useApp()
  const [dragging, setDragging] = useState(false)
  const [fileInfo, setFileInfo] = useState('')

  const wordCount = sourceText.trim().split(/\s+/).filter(Boolean).length
  const tooShort = wordCount > 0 && wordCount < 4

  async function takeFile(f) {
    const text = await extractText(f)
    setSourceText((sourceText + '\n\n' + text).trim())
    setFileInfo(`${f.name} · ${text.split(/\s+/).length} слов`)
  }

  async function submit() {
    if (!sourceText.trim()) return
    generateCards() // Шаг 3: GigaChat (mock) → карточки → экран колоды
  }

  return (
    <motion.section
      variants={rise} initial="hidden" animate="show" exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
      className="flex flex-1 flex-col gap-8 px-16 py-16 md:flex-row"
    >
      <div className="flex w-full max-w-[720px] flex-col gap-7">
        {/* Название раздела — маркер + рубрика, как в макете */}
        <motion.div variants={rise} custom={0} className="flex items-center gap-2.5">
          <span className="size-1.5 bg-primary" />
          <span className="text-xs tracking-[1.2px] text-primary uppercase">Шаг 1 · Материал</span>
        </motion.div>

        <motion.h1 variants={rise} custom={1} className="text-[52px] font-medium leading-[1.03] tracking-[-2px] md:text-[64px]">
          Вставь конспект —<br />
          <span className="font-serif italic tracking-normal text-primary">получи карточки.</span>
        </motion.h1>

        <motion.p variants={rise} custom={2} className="max-w-[530px] text-lg leading-[1.6] text-muted">
          Пришли текст конспекта, вставь его вручную или загрузи файл. ИИ вытащит из текста
          термины и определения — без выдумок, только то, что написано у тебя.
        </motion.p>

        <motion.div variants={rise} custom={3} className="flex flex-col gap-4">
          <motion.div
            variants={rise} custom={3}
            className="rounded-md border border-line bg-white p-6 focus-within:border-primary transition-colors"
          >
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Вставь текст конспекта сюда… чем больше конкретных определений, тем честнее будут карточки"
              className="h-52 w-full resize-none bg-transparent text-[15px] leading-[1.6] outline-none placeholder:text-muted/60"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-muted">
              <span>{fileInfo || 'или загрузи файл ниже'}</span>
              <span>{sourceText.trim().split(/\s+/).filter(Boolean).length} слов</span>            </div>
          </motion.div>

          {/* Dropzone .txt / .docx */}
          <label
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) takeFile(f) }}
            className={`flex cursor-pointer items-center justify-center gap-3 rounded-md border border-dashed p-8 text-sm transition-all ${
              dragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-line hover:border-muted'
            }`}
          >
            <input
              type="file" accept=".txt,.docx" className="sr-only"
              onChange={(e) => e.target.files[0] && takeFile(e.target.files[0])}
            />
            <span className="font-medium text-ink">Перетащи файл .txt / .docx</span>
            <span className="text-muted">или выбери кликом</span>
          </label>

          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Тема / дисциплина — необязательно, например «Анатомия · тест wildfires»"
            className="rounded-md border border-line bg-transparent px-[18px] py-[13px] text-sm outline-none transition-colors focus:border-primary"
          />
        </motion.div>

        <motion.div variants={rise} custom={4} className="flex items-center gap-6 pt-1">
          <MagneticButton
            onClick={submit}
            disabled={!sourceText.trim() || tooShort}
            className="flex h-14 w-auto cursor-pointer items-center gap-6 rounded-md bg-primary px-6 text-base text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {screen === 'loading' ? 'Генерация…' : 'Сделать карточки'}
            <ArrowUpRight className="size-5" />
          </MagneticButton>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Check className="size-4" />
            <span>ИИ вытащит только то, что написано в тексте</span>
          </div>
        </motion.div>

        {genError && (
          <motion.p
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="text-sm text-[#b3261e]"
          >
            {genError}
          </motion.p>
        )}
        {tooShort && !genError && (
          <p className="text-sm text-muted">Добавь ещё текст — нужно хотя бы пара предложений с определениями.</p>
        )}
      </div>

      {/* Правая колонка — живой превью карточки */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.6 } }}
        className="hidden flex-1 items-center justify-center md:flex"
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 1.2, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="w-[360px] rounded-lg border border-line bg-white p-8 shadow-[0_24px_60px_-24px_rgba(32,37,31,0.25)]"
          style={{ borderRadius: '8px 120px 8px 8px' }}
        >
          <div className="flex items-center gap-2.5">
            <span className="size-1.5 bg-primary" />
            <span className="text-xs tracking-[1.2px] text-primary uppercase">Так выглядит</span>
          </div>
          <p className="mt-5 text-[24px] font-semibold tracking-tight">Термин</p>
          <p className="mt-3 text-sm leading-[1.6] text-muted">Переверни — увидишь определение и цитату из твоего конспекта внизу мелким шрифтом.</p>
          <p className="mt-8 border-t border-line pt-4 font-serif text-xs italic text-muted">«это будет цитата из твоего текста»</p>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
