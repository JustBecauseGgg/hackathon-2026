import { motion } from 'framer-motion'
import { RadialBar, RadialBarChart, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import MagneticButton from '../components/MagneticButton.jsx'
import { ArrowUpRight } from '../components/icons.jsx'
import { useApp } from '../store.js'

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
}

function fmtTime(ms) {
  const s = Math.max(1, Math.round(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// освоение сессии: точность — выучено доля от всех ответов
const mastery = (d) => Math.round((d.known / Math.max(1, d.answered)) * 100)

function Ring({ value, fill = '#720a18' }) {
  return (
    <div className="relative size-[104px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="74%" outerRadius="104%"
          data={[{ value }]} startAngle={90} endAngle={-270}
        >
          <PolarAngleAxis type="angle" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={10} fill={fill} background={{ fill: '#e9e9e2' }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <span className="absolute inset-0 flex items-center justify-center text-[17px] font-semibold tracking-tight">
        {value}%
      </span>
    </div>
  )
}

export default function Stats() {
  const { decks, setScreen } = useApp()

  const total = decks.reduce((a, d) => a + d.cards, 0)
  const known = decks.reduce((a, d) => a + d.known, 0)
  const wrong = decks.reduce((a, d) => a + d.wrong, 0)
  const answered = decks.reduce((a, d) => a + d.answered, 0)
  const errPct = answered ? Math.round((wrong / answered) * 100) : 0
  const ms = decks.reduce((a, d) => a + d.timeMs, 0)

  // группировка колод по темам
  const byTopic = decks.reduce((map, d) => {
    const key = d.topic
    ;(map[key] ||= []).push(d)
    return map
  }, {})

  return (
    <motion.section
      variants={rise} initial="hidden" animate="show" exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
      className="mx-auto flex w-full max-w-[1100px] flex-col gap-10 px-16 py-14"
    >
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="size-1.5 bg-primary" />
            <span className="text-xs uppercase tracking-[1.2px] text-primary">Статистика</span>
          </div>
          <h1 className="mt-4 text-[52px] font-medium leading-[1.03] tracking-[-2px]">
            Твой <span className="font-serif italic tracking-normal text-primary">успех —</span><br />в цифрах.
          </h1>
        </div>
        <MagneticButton
          onClick={() => setScreen('upload')}
          className="flex h-14 items-center gap-5 rounded-md bg-primary px-6 text-base text-white"
        >
          Новая колода
          <ArrowUpRight className="size-5" />
        </MagneticButton>
      </div>

      {/* сводка */}
      <motion.div variants={rise} custom={1} className="grid grid-cols-4 gap-px overflow-hidden rounded-md border border-line bg-line shadow-[0_18px_40px_-24px_rgba(32,37,31,0.25)]">
        {[
          ['Карточек всего', total],
          ['Выучено', known],
          ['Ошибок', `${errPct}%`],
          ['Время', fmtTime(ms)],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-col items-center gap-1 bg-white px-4 py-6">
            <span className="text-[28px] font-semibold tracking-tight">{v}</span>
            <span className="text-[10px] uppercase tracking-[1px] text-muted">{k}</span>
          </div>
        ))}
      </motion.div>

      {/* колоды по темам */}
      {decks.length ? (
        Object.entries(byTopic).map(([topic, list], gi) => (
          <motion.div key={topic} variants={rise} custom={2 + gi} className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="size-1.5 bg-primary" />
              <span className="text-xs uppercase tracking-[1.2px] text-muted">{topic}</span>
            </div>
            {list.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.15 + gi * 0.08 + i * 0.06 } }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-6 rounded-md border border-line bg-white p-4 pr-8 shadow-[0_14px_30px_-22px_rgba(32,37,31,0.3)]"
              >
                <Ring value={mastery(d)} />
                <div className="flex-1">
                  <p className="text-lg font-semibold tracking-tight">
                    Колода #{d.id.split('_')[1]} · {d.cards} карточек
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    выучено {d.known} · ошибок {d.wrong} · время {fmtTime(d.timeMs)}
                  </p>
                </div>
                <span className="text-xs text-muted/70">{new Date(d.at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</span>
              </motion.div>
            ))}
          </motion.div>
        ))
      ) : (
        <motion.div variants={rise} custom={2} className="flex flex-col items-center gap-4 rounded-md border border-dashed border-line px-8 py-16 text-center">
          <p className="text-lg font-medium tracking-tight">Пока пусто</p>
          <p className="max-w-[380px] text-sm text-muted">
            Пройди первую колоду — и здесь появятся круги освоения, ошибки и время.
          </p>
          <button
            onClick={() => setScreen('upload')}
            className="rounded-md border border-line px-6 py-3 text-sm transition-colors hover:border-primary hover:text-primary"
          >
            Сделать карточки
          </button>
        </motion.div>
      )}
    </motion.section>
  )
}
