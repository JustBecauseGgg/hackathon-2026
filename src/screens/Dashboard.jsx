import { useState } from 'react'
import data from '../data/mockDashboard.json'
import { useApp } from '../store.js'
import {
  ArrowRight, ChevronDown, Ellipsis, FunctionSquare, Keyboard, LayoutGrid,
  Leaf, Search, Shield,
} from '../components/icons.jsx'

const cardIcons = { shield: Shield, function: FunctionSquare, keyboard: Keyboard }
const filters = ['Все предметы', 'Математика', 'Программирование', 'Кибербезопасность']

const initial = (name) =>
  name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

// «Личный кабинет» (фрейм 50:860): приветствие, прогресс, последняя тема, подборки
export default function Dashboard() {
  const { user, setScreen, cards, decks } = useApp()
  const [subject, setSubject] = useState(filters[0])
  const [query, setQuery] = useState('')

  // статистика освоения из реальных завершённых колод (вместо mock-процента)
  const totalAnswered = decks.reduce((a, d) => a + d.answered, 0)
  const totalKnown = decks.reduce((a, d) => a + d.known, 0)
  const totalWrong = decks.reduce((a, d) => a + d.wrong, 0)
  const totalCards = decks.reduce((a, d) => a + d.cards, 0)
  const totalMs = decks.reduce((a, d) => a + d.timeMs, 0)
  const masteryPct = totalAnswered ? Math.round((totalKnown / totalAnswered) * 100) : 0
  const lastDeck = decks.length ? decks[decks.length - 1] : null
  const fmtTime = (ms) => {
    const s = Math.max(1, Math.round(ms / 1000))
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  const visible = data.collections.filter(
    (c) =>
      (subject === filters[0] || c.subject === subject) &&
      (c.title + c.subject).toLowerCase().includes(query.trim().toLowerCase()),
  )
  const continueTo = () => setScreen(cards.length ? 'deck' : 'upload')

  return (
    <div className="flex flex-1 flex-col bg-[#f7f6f1]">
      <div className="flex flex-col items-start gap-9 px-16 py-12 max-lg:px-6">
        {/* Приветствие и создание */}
        <div className="flex w-full items-end justify-between gap-8 max-lg:flex-col max-lg:items-start">
          <div className="flex w-[820px] flex-col gap-[14px] max-lg:w-auto">
            <div className="flex items-center gap-[9px]">
              <span className="size-[5px] bg-primary" />
              <span className="text-[11px] uppercase tracking-[1px] text-primary">Личный кабинет</span>
            </div>
            <h1 className="text-[48px] font-medium leading-[1.15] tracking-[-2px] max-lg:text-[36px]">
              С возвращением,
              <br />
              <span className="font-serif italic text-primary">{user.name}.</span>
            </h1>
            <p className="text-sm leading-[1.6] text-muted">{data.greeting}</p>
          </div>
          <button
            onClick={() => setScreen('upload')}
            className="flex h-[54px] cursor-pointer items-center gap-4 rounded-md bg-gradient-to-r from-[#720a18] to-[#ac1328] px-6 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Добавить конспект
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.7494 9H9M9 9H14.2506M9 9V3.7494M9 9V14.2506" strokeWidth="1.6" strokeLinecap="round" stroke="currentColor" /></svg>
          </button>
        </div>

        {/* Прогресс и ближайшее занятие */}
        <div className="flex w-full items-stretch gap-6 max-lg:flex-col">
          <div className="flex w-[842px] shrink-0 flex-col gap-6 rounded-[12px] border border-line bg-white p-7 max-lg:w-auto">
            <div className="flex w-full items-start justify-between">
              <p className="text-xl font-medium tracking-[-0.5px]">Твой прогресс</p>
              <p className="text-[11px] text-muted">За всё время</p>
            </div>
            <div className="flex w-full items-center gap-8 max-lg:flex-col max-lg:items-stretch">
              <p className="text-[56px] font-medium tracking-[-2.5px] text-primary max-lg:text-[44px]">
                {masteryPct}%
              </p>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <p className="text-[13px] leading-[1.5] text-muted">
                  {totalKnown} верных ответов из {totalAnswered} · ошибок {totalWrong}
                </p>
                <div className="h-[6px] w-full overflow-hidden rounded-[3px] bg-[#eeede5]">
                  <div className="h-full rounded-[3px] bg-primary transition-[width] duration-500" style={{ width: `${masteryPct}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted">
              <span className="flex items-center gap-2.5">
                <Leaf className="shrink-0" />
                Пройдено колод: {decks.length} · карточек: {totalCards}
              </span>
              <span>Время обучения: {fmtTime(totalMs)}</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-[18px] rounded-[12px] bg-[#f3e9e7] p-7">
            <div className="flex items-center gap-[9px]">
              <span className="size-[5px] shrink-0 bg-primary" />
              <span className="text-[11px] uppercase tracking-[1px] text-primary">Последняя тема</span>
            </div>
            {lastDeck ? (
              <>
                <p className="text-[26px] font-medium leading-[1.2] tracking-[-0.8px] max-lg:text-[22px]">
                  {lastDeck.topic}
                </p>
                <p className="text-[13px] text-muted">
                  {lastDeck.cards} карточек · выучено {lastDeck.known} · ошибок {lastDeck.wrong}
                </p>
              </>
            ) : (
              <>
                <p className="text-[26px] font-medium leading-[1.2] tracking-[-0.8px] max-lg:text-[22px]">
                  Пока нет пройденных колод
                </p>
                <p className="text-[13px] text-muted">Заверши первую колоду — она появится здесь.</p>
              </>
            )}
            <button
              onClick={continueTo}
              className="flex h-[44px] w-fit cursor-pointer items-center gap-2 rounded-md bg-gradient-to-r from-[#720a18] to-[#ac1328] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Продолжить обучение
              <ArrowRight className="stroke-white" />
            </button>
          </div>
        </div>

        {/* Библиотека карточек */}
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full items-center justify-between">
            <p className="text-[34px] font-medium tracking-[-1.2px] max-lg:text-[26px]">Мои подборки</p>
            <LayoutGrid />
          </div>

          <div className="flex w-full gap-5 max-lg:flex-col">
            <div className="flex h-[50px] min-w-0 flex-1 items-center gap-3 rounded-md border border-line bg-white px-4">
              <Search className="shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Найти подборку или тему"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
            <button className="flex h-[50px] cursor-pointer items-center gap-5 rounded-md border border-line px-[18px] max-lg:w-fit">
              <span className="text-[13px]">Сначала недавние</span>
              <ChevronDown />
            </button>
          </div>

          <div className="flex flex-wrap items-start content-start gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setSubject(f)}
                className={`cursor-pointer rounded-[100px] border px-4 py-[10px] text-[12px] transition-colors ${
                  subject === f ? 'border-primary bg-primary text-white' : 'border-line hover:border-muted'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex gap-6 max-lg:flex-col">
            {visible.map((c) => {
              const Icon = cardIcons[c.icon]
              const percent = Math.round((c.studied / c.total) * 100)
              return (
                <div
                  key={c.title}
                  className="flex min-w-0 flex-1 flex-col gap-5 rounded-[12px] border border-line bg-white p-7 max-lg:w-auto"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon />
                      <p className="text-[11px] uppercase tracking-[0.8px] text-primary">{c.subject}</p>
                    </div>
                    <button className="cursor-pointer">
                      <Ellipsis />
                    </button>
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <p className="min-h-[60px] text-[26px] font-medium leading-[1.2] tracking-[-0.8px] max-lg:min-h-0">
                      {c.title}
                    </p>
                    <p className="text-sm leading-[1.6] text-muted">{c.subtitle}</p>
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex w-full items-start justify-between text-xs">
                      <p className="text-muted">Изучено {c.studied} из {c.total}</p>
                      <p className="text-primary">{percent}%</p>
                    </div>
                    <div className="h-[4px] w-full overflow-hidden rounded-[2px] bg-[#eeede5]">
                      <div className="h-full rounded-[2px] bg-primary" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between border-t border-line pt-[18px]">
                    <p className="text-xs text-muted">{c.total} карточек · Повторить: {c.repeat}</p>
                    <button
                      onClick={() => setScreen('upload')}
                      className="cursor-pointer text-[13px] text-primary transition-opacity hover:opacity-70"
                    >
                      Учить ↗
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <footer className="mt-auto flex w-full items-start justify-between border-t border-line px-16 py-7 text-[11px] max-lg:px-6">
        <span className="text-muted">Учись в своём ритме.</span>
        <span className="text-primary">Поддержка ↗</span>
      </footer>
    </div>
  )
}
