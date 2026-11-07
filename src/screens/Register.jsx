import { useState } from 'react'
import AuthShell, { Divider, Field, Panel } from './AuthShell.jsx'
import { EyeOff } from '../components/icons.jsx'
import { useApp } from '../store.js'

const headline = (
  <h1 className="text-[54px] font-medium leading-[1.08] tracking-[-2.5px]">
    Большие знания
    <br />
    начинаются
    <br />
    <span className="font-serif italic text-primary">с малого.</span>
  </h1>
)

export default function Register() {
  const { register, setScreen } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // по подсказке из макета: 8+ символов, буквы и цифры
  const passwordValid = password.length >= 8 && /[a-zA-Zа-яА-ЯёЁ]/.test(password) && /\d/.test(password)

  async function submit(e) {
    e.preventDefault()
    if (!name.trim()) return setError('Напиши, как к тебе обращаться.')
    if (!email.trim()) return setError('Укажи электронную почту.')
    if (!passwordValid) return setError('Пароль: не менее 8 символов, буквы и цифры.')
    if (!agree) return setError('Прими условия, чтобы продолжить.')
    setError('')
    setBusy(true)
    try {
      await register(name, email, password)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthShell>
      <Panel
        headline={headline}
        body={'Понимание приходит с вопросами,\nуверенность — с повторением.'}
        quoteLabel="МЫСЛЬ НА СЕГОДНЯ"
        quoteLines={['Не стыдно чего-нибудь не знать.', 'Стыдно не хотеть учиться.']}
        author="Сократ"
      />

      <form onSubmit={submit} className="flex w-full max-w-[496px] shrink flex-col gap-6">
        <h2 className="text-[44px] font-medium leading-[normal] tracking-[-1.8px]">Регистрация</h2>

        <div className="flex flex-col gap-5">
          <Field label="Имя">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к тебе обращаться?"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </Field>

          <Field label="Электронная почта">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите электронную почту"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </Field>

          <Field
            label="Пароль"
            hint="Не менее 8 символов. Используй буквы и цифры."
          >
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Придумайте надёжный пароль"
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

          <label className="flex w-full cursor-pointer items-start gap-[10px]">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-px size-4 shrink-0 cursor-pointer appearance-none rounded-[3px] border border-line bg-white checked:bg-primary"
            />
            <span className="text-[11px] leading-[1.6] text-muted">
              Я принимаю{' '}
              <button type="button" onClick={(e) => e.stopPropagation()} className="text-primary transition-opacity hover:opacity-70">условия использования</button>
              {' '}и{' '}
              <button type="button" onClick={(e) => e.stopPropagation()} className="text-primary transition-opacity hover:opacity-70">политику конфиденциальности</button>.
            </span>
          </label>

          {error && <p className="-mt-2 text-[13px] text-primary">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="h-[54px] w-full cursor-pointer rounded-md bg-primary text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Создаём…' : 'Создать аккаунт'}
          </button>

          <Divider />
        </div>

        <p className="w-full text-center text-[13px] text-muted">
          Уже есть аккаунт?{' '}
          <button
            type="button"
            onClick={() => setScreen('login')}
            className="cursor-pointer font-medium text-primary transition-opacity hover:opacity-70"
          >
            Войти
          </button>
        </p>
      </form>
    </AuthShell>
  )
}
