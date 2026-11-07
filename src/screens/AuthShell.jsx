import { VeritasLogo, Bookmark } from '../components/icons.jsx'
import { useApp } from '../store.js'

// Шапка и подвал общие для фреймов «Вход» и «Регистрация» из Figma
export default function AuthShell({ children }) {
  const setScreen = useApp((s) => s.setScreen)
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-[100px] w-full shrink-0 items-center justify-between border-b border-line px-16">
        <div className="flex items-center gap-[10px]">
          <VeritasLogo />
          <span className="text-xl font-semibold leading-[1.05] tracking-[-0.6px]">Veritas</span>
        </div>
        {/* shortcut: «На главную» — входная точка приложения, но без user гейт App возвращает на «Вход» */}
        <button
          onClick={() => setScreen('upload')}
          className="text-sm text-muted transition-colors hover:text-ink"
        >
          ← На главную
        </button>
      </header>

      <main className="flex flex-1 items-center justify-center gap-[100px] px-16 py-12 max-lg:flex-col max-lg:gap-12">
        {children}
      </main>

      <footer className="flex w-full shrink-0 items-center justify-between px-16 py-6 text-[11px] text-muted">
        <span>© Veritas, 2026</span>
        <span>Нужна помощь? Напишите нам</span>
      </footer>
    </div>
  )
}

// Левая «вдохновляющая» панель — цвета и радиусы из фрейма (выступ сверху-слева 100px),
// headline — готовый JSX заголовка, различается на экранах
export function Panel({ rubric, headline, body, quoteLabel, quoteLines, author }) {
  return (
    <section className="flex h-[724px] w-full max-w-[616px] shrink flex-col gap-8 rounded-[10px] rounded-tl-[100px] bg-[#eeede5] p-12 max-lg:h-auto">
      {rubric && (
        <div className="flex items-center gap-[9px]">
          <span className="size-[5px] shrink-0 bg-primary" />
          <span className="text-[11px] uppercase tracking-[1px] text-primary">{rubric}</span>
        </div>
      )}
      {headline}
      <p className="max-w-[420px] text-base leading-[1.7] whitespace-pre-line text-muted">{body}</p>
      <div className="flex w-full flex-col gap-6 rounded-xl bg-white p-8 shadow-[0_8px_28px_rgba(36,39,32,0.04)]">
        <div className="flex w-full items-start justify-between">
          <span className="text-[10px] tracking-[1px] text-primary">{quoteLabel}</span>
          <Bookmark />
        </div>
        <p className="font-serif text-[30px] leading-[1.35]">
          {quoteLines[0]}
          <br />
          <span className="text-primary">{quoteLines[1]}</span>
        </p>
        <span className="text-xs text-muted">{author}</span>
      </div>
    </section>
  )
}

// Поле формы: подпись 13px + ввод 52px, по фрейму
export function Field({ label, hint, children }) {
  return (
    <div className="flex w-full flex-col gap-[9px]">
      <span className="text-[13px] font-medium">{label}</span>
      <div className="flex h-[52px] w-full items-center gap-3 rounded-md border border-line bg-white px-4 transition-colors focus-within:border-primary">
        {children}
      </div>
      {hint && <span className="text-[11px] leading-[1.5] text-muted">{hint}</span>}
    </div>
  )
}

export function Divider() {
  return (
    <div className="flex w-full items-center gap-4">
      <span className="h-px flex-1 bg-line" />
      <span className="text-xs text-muted">или</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}
