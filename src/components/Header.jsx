import { useState } from 'react'
import { useApp } from '../store.js'
import { Bell, VeritasLogo, Volume2, VolumeX } from './icons.jsx'
import { sound } from '../utils/sound.js'

// Шапка приложения по макету «Личный кабинет» (50:861): Veritas + разделы + профиль.
const nav = [
  ['Статистика', 'dashboard'],
  ['Обучение', 'upload'],
]
// к какой вкладке относим каждый экран (учебные экраны подсвечивают «Обучение»)
const screenTab = {
  dashboard: 'dashboard',
  upload: 'upload',
  loading: 'upload',
  deck: 'upload',
  blitz: 'upload',
}

const initials = (name) =>
  name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

export default function Header() {
  const { user, logout, setScreen, screen } = useApp()
  const [sfx, setSfx] = useState(() => sound.restore())
  const activeTab = screenTab[screen]

  return (
    <header className="flex h-[100px] w-full shrink-0 items-center justify-between border-b border-line px-16 max-lg:px-6">
      <div className="flex items-center gap-[10px]">
        <VeritasLogo />
        <span className="text-xl font-semibold leading-[1.05] tracking-[-0.6px]">Veritas</span>
      </div>

      <nav className="flex items-center gap-8 text-sm">
        {nav.map(([label, target]) => (
          <button
            key={label}
            onClick={() => setScreen(target)}
            className={`cursor-pointer transition-colors ${
              activeTab === target ? 'text-primary' : 'text-ink hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={() => { const on = !sfx; sound.setEnabled(on); setSfx(on) }}
          title={sfx ? 'Звук включён' : 'Звук выключен'}
          className="flex cursor-pointer items-center text-muted transition-colors hover:text-primary"
        >
          {sfx ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
        </button>
        <Bell />
        <span className="flex size-9 items-center justify-center rounded-[100px] bg-[#f3e9e7] text-[13px] text-primary">
          {initials(user?.name || 'Г')}
        </span>
        <span className="text-sm">{user?.name}</span>
        <button onClick={logout} className="ml-2 cursor-pointer text-sm text-muted transition-colors hover:text-primary">
          Выход
        </button>
      </div>
    </header>
  )
}
