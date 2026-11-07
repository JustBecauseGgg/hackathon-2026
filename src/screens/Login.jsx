import { useState } from 'react'
import AuthShell, { Divider, Field, Panel } from './AuthShell.jsx'
import { EyeOff } from '../components/icons.jsx'
import { useApp } from '../store.js'

const headline = (
  <h1 className="text-[54px] font-medium leading-[1.08] tracking-[-2.5px]">
    Хорошо,
    <br />
    <span>что </span>
    <span className="font-serif italic text-primary">ты вернулся.</span>
  </h1>
)

export default function Login() {
  const { login, setScreen } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!email.trim() || !password) return setError('Заполни почту и пароль.')
    setError('')
    setBusy(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthShell>
      <Panel
        rubric="Твоя среда для знаний"
        headline={headline}
        body="Продолжи с того места, где остановился."
        quoteLabel="ЦИТАТА НА СЕГОДНЯ"
        quoteLines={['Я знаю только то -', 'что ничего не знаю.']}
        author="Сократ"
      />

      <form onSubmit={submit} className="flex w-full max-w-[496px] shrink flex-col gap-6">
        <h2 className="text-[44px] font-medium leading-[normal] tracking-[-1.8px]">Вход</h2>

        <div className="flex flex-col gap-5">
          <Field label="Электронная почта">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите электронную почту"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </Field>

          <Field label="Пароль">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
              aria-label="Показать пароль"
            >
              <EyeOff />
            </button>
          </Field>

          <div className="flex w-full items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 cursor-pointer appearance-none rounded-[3px] border border-line bg-white checked:bg-primary"
              />
              <span className="text-xs text-muted">Запомнить меня</span>
            </label>
            <button type="button" className="text-xs text-primary transition-opacity hover:opacity-70">
              Забыли пароль?
            </button>
          </div>

          {error && <p className="-mt-2 text-[13px] text-primary">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="h-[54px] w-full cursor-pointer rounded-md bg-primary text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Входим…' : 'Войти'}
          </button>

          <Divider />
        </div>

        <p className="w-full text-center text-[13px] text-muted">
          Ещё нет аккаунта?{' '}
          <button
            type="button"
            onClick={() => setScreen('register')}
            className="cursor-pointer font-medium text-primary transition-opacity hover:opacity-70"
          >
            Зарегистрироваться
          </button>
        </p>
      </form>
    </AuthShell>
  )
}
