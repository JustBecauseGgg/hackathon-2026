import { useApp } from '../store.js'
import { Bell, VeritasLogo } from './icons.jsx'

// Шапка приложения по макету «Личный кабинет» (50:861): Veritas + разделы + профиль.
// Пункты разделов пока декоративные (по решению команды), «Выход» оставлен, чтобы был способ разлогиниться
const nav = ['Статистика', 'Обучение', 'Мой прогресс']

const initials = (name) =>
  name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

export default function Header() {
  const { user, logout } = useApp()

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

      <div className="flex items-center gap-3">
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
