import { useState } from 'react'
import data from '../data/mockDashboard.json'
import { useApp } from '../store.js'
import {
  ArrowRight, LayoutGrid,
  Leaf, Search,
} from '../components/icons.jsx'

const filters = ['Все предметы']

const initial = (name) =>
  name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

const plural = (n, one, few, many) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few
  return many
}

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

  // «Мои подборки» — реальные прорешанные колоды, сгруппированные по темам
  const decksByTopic = decks.reduce((map, d) => {
    ;(map[d.topic] ||= []).push(d)
    return map
  }, {})
  const topics = Object.entries(decksByTopic)
  const topicVisible = topics
    .map(([topic, list]) => ({
      topic,
      sessions: list.length,
      cards: list.reduce((a, d) => a + d.cards, 0),
      known: list.reduce((a, d) => a + d.known, 0),
      wrong: list.reduce((a, d) => a + d.wrong, 0),
      timeMs: list.reduce((a, d) => a + d.timeMs, 0),
      lastAt: Math.max(...list.map((d) => d.at)),
      percent: Math.round((list.reduce((a, d) => a + d.known, 0) / Math.max(1, list.reduce((a, d) => a + d.answered, 0))) * 100),
    }))
    .filter((t) =>
      (subject === filters[0] || t.topic === subject) &&
      t.topic.toLowerCase().includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => b.lastAt - a.lastAt)

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
          </div>

          {topics.length > 0 && (
            <div className="flex flex-wrap items-start content-start gap-2">
              {[filters[0], ...Object.keys(decksByTopic).filter((t) => !filters.includes(t))].map((f) => (
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
          )}

          <div className="flex flex-col gap-4">
            {topicVisible.length ? (
              topicVisible.map((t) => (
                <div
                  key={t.topic}
                  className="flex w-full items-center gap-7 rounded-[12px] border border-line bg-white p-6 pr-8 transition-shadow hover:shadow-[0_14px_30px_-22px_rgba(32,37,31,0.3)]"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p className="text-[11px] uppercase tracking-[0.8px] text-primary">{t.topic}</p>
                    <p className="text-xl font-medium tracking-[-0.5px]">
                      {t.cards} карточек · {t.sessions} {plural(t.sessions, 'сессия', 'сессии', 'сессий')}
                    </p>
                    <p className="text-sm text-muted">
                      выучено {t.known} · ошибок {t.wrong} · время {fmtTime(t.timeMs)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-[22px] font-medium tracking-[-0.8px] text-primary">{t.percent}%</span>
                    <div className="h-[4px] w-[140px] overflow-hidden rounded-[2px] bg-[#eeede5]">
                      <div className="h-full rounded-[2px] bg-primary" style={{ width: `${t.percent}%` }} />
                    </div>
                    <span className="text-xs text-muted/70">
                      {new Date(t.lastAt).toLocaleDateString('ru', { day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-[12px] border border-dashed border-line px-8 py-14 text-center">
                <p className="text-lg font-medium tracking-tight">
                  {topics.length ? 'Ничего не найдено' : 'Пока нет прорешанных тем'}
                </p>
                <p className="max-w-[380px] text-sm text-muted">
                  {topics.length
                    ? 'Попробуй другой запрос или сбрось фильтр.'
                    : 'Пройди первую колоду — её тема появится в подборках.'}
                </p>
                {!topics.length && (
                  <button
                    onClick={() => setScreen('upload')}
                    className="rounded-md border border-line px-6 py-3 text-sm transition-colors hover:border-primary hover:text-primary"
                  >
                    Сделать карточки
                  </button>
                )}
              </div>
            )}
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
