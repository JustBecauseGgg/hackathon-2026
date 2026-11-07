<<<<<<< HEAD
import { useApp } from '../store.js'
import { Bell, VeritasLogo } from './icons.jsx'
=======
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Asterisk, Volume2, VolumeX } from './icons.jsx'
import { useApp } from '../store.js'
import { sound } from '../utils/sound.js'
>>>>>>> ca6dff6 (feat: WebAudio SFX (flip click, know pop, nah thud, fanfare+coin sparks) with header mute toggle; fix header user/logout destructure)

// Шапка приложения по макету «Личный кабинет» (50:861): Veritas + разделы + профиль.
// Пункты разделов пока декоративные (по решению команды), «Выход» оставлен, чтобы был способ разлогиниться
const nav = ['Статистика', 'Обучение', 'Мой прогресс']

const initials = (name) =>
  name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

export default function Header() {
<<<<<<< HEAD
  const { user, logout } = useApp()
=======
  const { screen, setScreen, user, logout } = useApp()
  const [sfx, setSfx] = useState(() => sound.restore())
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
>>>>>>> ca6dff6 (feat: WebAudio SFX (flip click, know pop, nah thud, fanfare+coin sparks) with header mute toggle; fix header user/logout destructure)

  return (
    <header className="flex h-[100px] w-full shrink-0 items-center justify-between border-b border-line px-16 max-lg:px-6">
      <div className="flex items-center gap-[10px]">
        <VeritasLogo />
        <span className="text-xl font-semibold leading-[1.05] tracking-[-0.6px]">Veritas</span>
      </div>

      <nav className="flex items-center gap-8 text-sm">
        {nav.map((label, i) => (
          <button key={label} className={`cursor-pointer transition-colors ${i === 0 ? 'text-primary' : 'hover:text-primary'}`}>
            {label}
          </button>
        ))}
      </nav>

<<<<<<< HEAD
      <div className="flex items-center gap-3">
        <Bell />
        <span className="flex size-9 items-center justify-center rounded-[100px] bg-[#f3e9e7] text-[13px] text-primary">
          {initials(user?.name || 'Г')}
        </span>
        <span className="text-sm">{user?.name}</span>
        <button onClick={logout} className="ml-2 cursor-pointer text-sm text-muted transition-colors hover:text-primary">
          Выход
        </button>
=======
      <div className="flex items-center gap-6">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => { const on = !sfx; sound.setEnabled(on); setSfx(on) }}
          title={sfx ? 'Звук включён' : 'Звук выключен'}
          className="flex cursor-pointer items-center text-muted transition-colors hover:text-primary"
        >
          {sfx ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
        </motion.button>
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
>>>>>>> ca6dff6 (feat: WebAudio SFX (flip click, know pop, nah thud, fanfare+coin sparks) with header mute toggle; fix header user/logout destructure)
      </div>
    </header>
  )
}
