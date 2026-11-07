import { useState } from 'react'
import {
  BookmarkLg, Check, FlaskConical, FileText, Focus, Landmark, Microscope,
  Minus, Panda, Plus, RotateCcw, SlidersHorizontal, Sparkles, VeritasLogo,
} from '../components/icons.jsx'
import { useApp } from '../store.js'

const ArrowUpRight = (props) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.7494 12.7494V5.2506H5.2506M12.7494 5.2506L5.2506 12.7494" strokeWidth="1.6" strokeLinecap="round" stroke="currentColor" />
  </svg>
)

// рубрика «маркер + капс» — повторяется на всех секциях
function Rubric({ children, marker = 'bg-primary', text = 'text-primary' }) {
  return (
    <div className="flex items-center gap-[9px]">
      <span className={`size-[5px] shrink-0 ${marker}`} />
      <span className={`text-[11px] uppercase tracking-[1px] ${text}`}>{children}</span>
    </div>
  )
}

const steps = [
  ['01', 'Загрузи конспект', 'Добавь документ или вставь текст лекции.'],
  ['02', 'GigaChat подготовит карточки', 'Получи вопросы и ответы по материалу.'],
  ['03', 'Учись и возвращайся к сложному', 'Вспоминай ответы, анализируй пробелы в знаниях.'],
]

const batches = [
  [Microscope, 'Биология', 'Клетка и её строение', 'Органоиды, мембрана и обмен веществ', '24 карточки'],
  [Landmark, 'История', 'Эпоха Петра I', 'Реформы, события и ключевые даты', '30 карточек'],
  [FlaskConical, 'Химия', 'Химическая связь', 'Ионная, ковалентная и металлическая', '20 карточек'],
]

const perks = [
  [Focus, 'Фокус на вопросе', 'Короткий вопрос помогает сосредоточиться на главном, а не на объёме конспекта.'],
  [RotateCcw, 'Сложное не теряется', 'Карточки с отметкой «Не знаю» возвращаются раньше для повторения.'],
  [SlidersHorizontal, 'Ты управляешь материалом', 'Уточняй вопросы, дополняй ответы и собирай подборки под свои учебные задачи.'],
]

const faq = [
  ['Какие материалы можно добавить?', 'Загрузи текстовый документ или вставь фрагмент конспекта. Для начала выбери одну тему: так будет проще проверить вопросы и ответы.'],
  ['Можно ли исправить ответ GigaChat?', null],
  ['Что происходит с незнакомыми карточками?', null],
  ['Чем обычный режим отличается от «Блица»?', null],
]

export default function Main() {
  const { user, setScreen } = useApp()
  const [openFaq, setOpenFaq] = useState(0)
  const toApp = () => setScreen(user ? 'upload' : 'login')

  return (
    <div className="min-h-screen">
      {/* Шапка лендинга */}
      <header className="flex h-[100px] w-full items-center justify-between border-b border-line px-16">
        <div className="flex items-center gap-[10px]">
          <VeritasLogo />
          <span className="text-xl font-semibold leading-[1.05] tracking-[-0.6px]">Veritas</span>
        </div>
        <nav className="flex items-center gap-8 text-sm">
          {[['Как это работает', '#how'], ['Подборки', '#collections'], ['Вопросы', '#faq']].map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-primary">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <button onClick={() => setScreen('register')} className="cursor-pointer text-sm transition-colors hover:text-primary">
            Регистрация
          </button>
          <button
            onClick={() => setScreen('login')}
            className="h-11 cursor-pointer rounded-md border border-line px-4 text-[13px] font-medium transition-colors hover:border-primary hover:text-primary"
          >
            Войти
          </button>
        </div>
      </header>

      {/* Первый экран */}
      <section className="flex w-full flex-col gap-14 bg-white px-16 pb-12 pt-16">
        <div className="flex items-center gap-12 max-lg:flex-col">
          <div className="flex w-[666px] shrink-0 flex-col gap-7 max-lg:w-auto">
            <Rubric>Твоя среда для знаний</Rubric>
            <h1 className="text-[80px] font-medium leading-[1.04] tracking-[-4.5px] max-lg:text-[56px]">
              Превращай
              <br />
              конспекты
              <br />
              <span className="font-serif italic text-primary">в знания</span>
            </h1>
            <p className="max-w-[515px] text-lg leading-[1.65] text-muted">
              Загрузи свои записи — GigaChat поможет сделать карточки. Вспоминай главное, проверяй себя
              и возвращайся к тому, что пока не запомнилось.
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={toApp}
                className="flex h-[54px] cursor-pointer items-center gap-4 rounded-md bg-gradient-to-r from-[#720a18] to-[#d8132e] px-6 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Создать карточки
                <ArrowUpRight className="text-white" />
              </button>
              <a href="#how" className="text-sm transition-colors hover:text-primary">Как это работает ↓</a>
            </div>
          </div>

          {/* Парящие учебные карточки */}
          <div className="relative h-[560px] w-[598px] shrink-0 overflow-hidden rounded-[8px] rounded-tl-[120px] bg-[#eeede5] max-lg:h-auto max-lg:w-full max-lg:pb-16 max-lg:pt-16">
            <div className="absolute left-[22%] top-0 w-[68%] -rotate-[8deg] rounded-xl border border-line bg-[#f3e9e7] p-7 text-primary max-lg:relative max-lg:left-0 max-lg:w-[88%]">
              <p className="text-[11px] tracking-[1px]">ПРОГРАММИРОВАНИЕ / ОСНОВЫ</p>
              <p className="mt-5 font-serif text-[36px] italic">Вспоминай.</p>
            </div>
            <div className="absolute left-[24%] top-[161px] w-[68%] rotate-4 rounded-xl bg-white p-8 shadow-[0_16px_48px_rgba(36,39,32,0.07)] max-lg:relative max-lg:left-0 max-lg:top-2 max-lg:w-[88%]">
              <div className="flex w-full items-start justify-between">
                <p className="text-[10px] tracking-[1px] text-primary">ВОПРОС</p>
                <p className="text-[11px] text-muted">07 / 24</p>
              </div>
              <p className="mt-8 text-[30px] font-medium leading-[1.25] tracking-[-0.7px]">
                Что такое функциональное программирование?
              </p>
              <p className="mt-8 text-xs text-muted">Вспомни ответ. Затем проверь себя ↗</p>
            </div>

            {/* Вырезка панды из фрейма */}
            <Panda className="absolute -bottom-1 right-2 h-auto w-[37%] max-lg:hidden" />

            <div className="absolute left-10 top-[463px] flex items-center gap-2.5 rounded-md bg-gradient-to-r from-[#18f93d] via-[#15e79a] to-[#12d7ed] px-4 py-[13px] max-lg:relative max-lg:left-0 max-lg:top-6 max-lg:w-fit">
              <Sparkles />
              <span className="text-base font-bold text-white">собрано GigaChat</span>
            </div>
          </div>
        </div>

        {/* Принципы обучения */}
        <div className="flex w-full items-start gap-12 border-t border-line pt-7 max-lg:flex-col">
          <p className="w-[290px] shrink-0 text-sm leading-[1.6] text-muted max-lg:w-auto">
            Не перечитывать бесконечно.
            <br />
            А вспоминать осмысленно.
          </p>
          {[
            ['Свои записи', 'В основе — твой учебный материал'],
            ['Один вопрос', 'Одна понятная мысль на карточке'],
            ['Свой ритм', 'Повторение без лишней спешки'],
          ].map(([t, s]) => (
            <div key={t} className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="text-[28px] font-medium tracking-[-0.8px] whitespace-nowrap text-primary">{t}</p>
              <p className="text-xs text-muted whitespace-nowrap">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 01 / Знакомство с продуктом */}
      <section id="how" className="flex w-full flex-col gap-12 bg-[#eeede5] px-16 py-[88px]">
        <Rubric>01 / От записей к пониманию</Rubric>
        <div className="flex w-full items-start gap-[100px] max-lg:flex-col max-lg:gap-12">
          <div className="flex w-[566px] shrink-0 flex-col gap-8 max-lg:w-auto">
            <h2 className="text-[50px] font-medium leading-[1.12] tracking-[-2.2px]">
              Всё начинается
              <br />
              <span>с твоего </span>
              <span className="font-serif italic text-primary">конспекта.</span>
            </h2>
            <div className="flex w-full flex-col gap-6 rounded-xl bg-white p-8 shadow-[0_8px_28px_rgba(36,39,32,0.04)]">
              <div className="flex w-full items-center gap-[14px]">
                <div className="flex h-[50px] w-11 shrink-0 items-center justify-center rounded-md bg-[#f3e9e7]">
                  <FileText />
                </div>
                <p className="flex-1 text-[15px] font-medium">Строение клетки</p>
                <Check className="size-5 shrink-0 text-[#526143]" />
              </div>
              <span className="h-px w-full bg-line" />
              <p className="font-serif text-[22px] leading-[1.65]">
                «Митохондрии участвуют в клеточном дыхании. При этом энергия питательных веществ
                используется для синтеза АТФ…»
              </p>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {steps.map(([n, t, d]) => (
              <div key={n} className="flex w-full items-start gap-6 border-t border-line pb-7 pt-6">
                <p className="w-[30px] shrink-0 text-[13px] text-primary">{n}</p>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <p className="text-2xl font-medium leading-[1.25] tracking-[-0.6px]">{t}</p>
                  <p className="text-sm leading-[1.7] text-muted">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 / Подборки */}
      <section
        id="collections"
        className="flex w-full flex-col gap-8 bg-gradient-to-b from-[#eeede5] from-37% to-[#94081b] px-16 py-[88px]"
      >
        <Rubric>02 / Знания по полочкам</Rubric>
        <h2 className="max-w-[700px] text-[50px] font-medium leading-[1.12] tracking-[-2.2px]">
          От слова до параграфа.
          <br />
          У каждой темы — своё место.
        </h2>
        <p className="max-w-[660px] text-[15px] leading-[1.65] text-[#474743]">
          Собирай карточки по предметам и возвращайся к нужной теме. Вот как могут выглядеть твои подборки.
        </p>
        <div className="flex w-full items-start gap-6 max-lg:flex-col">
          {batches.map(([Icon, subject, title, sub, meta]) => (
            <div key={title} className="flex min-w-0 flex-1 flex-col gap-5 rounded-xl border border-line bg-white p-7">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Icon />
                  <p className="text-[11px] uppercase tracking-[0.8px] text-primary">{subject}</p>
                </div>
                <ArrowUpRight className="text-muted" />
              </div>
              <div className="flex w-full flex-col gap-2.5">
                <p className="min-h-[60px] text-[26px] font-medium leading-[1.2] tracking-[-0.8px]">{title}</p>
                <p className="text-sm leading-[1.6] text-muted">{sub}</p>
              </div>
              <div className="flex w-full items-center border-t border-line pt-[18px]">
                <p className="text-xs text-muted">{meta} · Пример подборки</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 03 / Осознанное повторение */}
      <section className="flex w-full flex-col gap-10 bg-gradient-to-b from-[#93071b] to-[#d8132e] px-16 py-20">
        <div className="flex w-full items-start gap-[100px] max-lg:flex-col max-lg:gap-12">
          <div className="flex w-[620px] shrink-0 flex-col gap-7 max-lg:w-auto">
            <Rubric marker="bg-white" text="text-[#f0d7db]">03 / Не просто перечитывай</Rubric>
            <h2 className="text-[54px] font-medium leading-[1.12] tracking-[-2.3px] text-white">
              Понимай.
              <br />
              Вспоминай.
              <br />
              <span className="font-serif italic">Изучай.</span>
            </h2>
            <p className="max-w-[560px] text-base leading-[1.7] text-[#e5c8cd]">
              Карточка — повод не смотреть в записи, а попробовать ответить самому. Без оценок и
              сравнения с другими.
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {perks.map(([Icon, t, d]) => (
              <div key={t} className="flex w-full items-start gap-5 border-t border-white py-6">
                <Icon />
                <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                  <p className="text-[22px] font-medium tracking-[-0.5px] text-white">{t}</p>
                  <p className="text-sm leading-[1.65] text-[#e5c8cd]">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Учебная установка */}
        <div className="flex w-full items-center justify-between gap-6 rounded-xl bg-white p-8">
          <p className="font-serif text-[32px] leading-[1.4] flex-1">
            Не знать ответ — нормально.
            <br />
            <span className="text-primary">Теперь ты знаешь, к чему вернуться.</span>
          </p>
          <BookmarkLg />
        </div>
      </section>

      {/* 04 / Вопросы и ответы + подвал */}
      <section id="faq" className="bg-gradient-to-b from-[#d7132e] from-0% to-[#efeee6] to-45%">
        <div className="flex w-full items-start px-16 pt-[88px] pb-12 max-lg:flex-col max-lg:gap-12">
          <div className="flex w-[440px] shrink-0 flex-col gap-6 max-lg:w-auto">
            <Rubric>04 / Всё по делу</Rubric>
            <p className="text-[48px] font-medium leading-[1.15] tracking-[-2px]">
              <span>Вопросы и </span>
              <span className="font-normal">ответы</span>
              <span>.</span>
            </p>
            <p className="text-sm text-[#373735]">Не нашли свой? Напишите нам ↗</p>
            <Panda className="mt-6 h-auto w-[180px]" />
          </div>

          {/* Аккордеон вопросов */}
          <div className="flex min-w-0 flex-1 flex-col max-lg:w-full">
            {faq.map(([q, a], i) => (
              <div
                key={q}
                className={`flex w-full flex-col items-start border-t py-6 ${['border-[#1b1b1a]', 'border-[#232321]', 'border-[#6b6b67]', 'border-[#b6b7ae]'][i]}`}
              >
                <div className="flex w-full items-center gap-5">
                  <p
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className={`flex-1 cursor-pointer text-[19px] font-medium leading-[1.4] ${openFaq === i ? 'text-[#48050f]' : ''}`}
                  >
                    {q}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="cursor-pointer"
                    aria-label={openFaq === i ? 'Свернуть' : 'Развернуть'}
                  >
                    {openFaq === i ? <Minus /> : <Plus />}
                  </button>
                </div>
                {openFaq === i && a && (
                  <p className="mt-4 w-full text-sm leading-[1.7] text-[#333330]">{a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Подвал */}
        <footer className="flex w-full flex-col gap-9 border-t border-line px-16 pb-7 pt-12">
          <div className="flex w-full items-start justify-between max-lg:flex-col max-lg:gap-10">
            <div className="flex w-[420px] flex-col gap-[18px] max-lg:w-auto">
              <div className="flex items-center gap-[10px]">
                <VeritasLogo />
                <span className="text-xl font-semibold leading-[1.05] tracking-[-0.6px]">Veritas</span>
              </div>
              <p className="text-sm leading-[1.6] text-muted">
                Место, где конспекты становятся знаниями, а учёба — твоей привычкой.
              </p>
            </div>
            <div className="flex w-[220px] flex-col gap-4 text-[13px]">
              <p className="font-semibold">Учиться</p>
              {['Как это работает', 'Подборки', 'Личный кабинет'].map((l) => (
                <p key={l} className="cursor-pointer leading-[1.4] text-muted transition-colors hover:text-primary">{l}</p>
              ))}
            </div>
            <div className="flex w-[220px] flex-col gap-4 text-[13px]">
              <p className="font-semibold">Помощь</p>
              {['Вопросы и ответы', 'Написать в поддержку', 'Обратная связь'].map((l) => (
                <p key={l} className="cursor-pointer leading-[1.4] text-muted transition-colors hover:text-primary">{l}</p>
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col gap-5">
            <span className="h-px w-full bg-line" />
            <div className="flex w-full items-start justify-between text-[11px] text-muted">
              <p>© Veritas, 2026</p>
              <p>Политика конфиденциальности</p>
              <p>Условия использования</p>
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}
