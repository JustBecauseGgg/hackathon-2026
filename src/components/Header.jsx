import { motion } from 'framer-motion'
import { Asterisk } from './icons.jsx'
import { useApp } from '../store.js'

const nav = [
  ['Колоды', 'stats'],
  ['Учиться', 'upload'],
  ['Блиц', 'blitz'],
]

export default function Header() {
  const { screen, setScreen } = useApp()
  return (
    <header className="flex h-[100px] w-full items-center justify-between border-b border-line px-16">
      <motion.button
        whileHover={{ rotate: 90, transition: { duration: 0.35, ease: 'easeInOut' } }}
        onClick={() => setScreen('upload')}
        className="flex items-center gap-2.5"
      >
        <span className="flex size-8 items-center justify-center rounded bg-primary text-surface">
          <Asterisk className="size-6" />
        </span>
        <span className="text-[29px] font-bold tracking-tight">StudStorm</span>
      </motion.button>

      <nav className="flex gap-8 text-sm">
        {nav.map(([label, to]) => (
          <button
            key={to}
            onClick={() => setScreen(to)}
            className={`transition-colors hover:text-primary ${screen === to ? 'text-primary' : ''}`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="text-sm text-ink border border-line rounded px-[18px] py-[13px]">{user.name}</span>
            <button onClick={logout} className="cursor-pointer text-sm text-muted transition-colors hover:text-primary">
              Выход
            </button>
          </>
        ) : (
          <span className="text-sm text-muted border border-line rounded px-[18px] py-[13px]">Гость</span>
        )}
      </div>
    </header>
  )
}
