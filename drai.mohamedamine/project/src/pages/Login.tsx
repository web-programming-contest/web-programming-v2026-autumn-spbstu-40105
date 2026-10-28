import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Info, LogIn } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [pending, setPending] = useState(false)

  const destination = (location.state as { from?: string } | null)?.from
  const returnPath = destination && destination !== '/login' ? destination : '/'
  if (user) return <Navigate to={returnPath} replace />

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!username.trim()) nextErrors.username = 'Заполните обязательное поле'
    if (!password) nextErrors.password = 'Заполните обязательное поле'
    setErrors(nextErrors)
    setServerError('')
    if (Object.keys(nextErrors).length) return

    setPending(true)
    try {
      await login(username.trim(), password)
      navigate(returnPath, { replace: true })
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : 'Не удалось войти. Попробуйте еще раз.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="container narrow-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card__heading"><span className="login-card__icon"><LogIn /></span><div><h1 id="login-title">С возвращением!</h1><p>Войдите, чтобы выбрать гаджеты и оформить заказ.</p></div></div>
        {serverError && <div className="form-alert" role="alert"><Info size={20} /><span>{serverError}</span></div>}
        <form onSubmit={submit} noValidate>
          <div className={`field ${errors.username ? 'field--error' : ''}`}>
            <label htmlFor="username">Имя пользователя</label>
            <input id="username" autoComplete="username" value={username} onChange={(event) => { setUsername(event.target.value); setErrors((current) => ({ ...current, username: '' })) }} placeholder="Введите логин" aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? 'username-error' : undefined} />
            {errors.username && <span className="field-error" id="username-error">{errors.username}</span>}
          </div>
          <div className={`field ${errors.password ? 'field--error' : ''}`}>
            <label htmlFor="password">Пароль</label>
            <div className="password-input"><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: '' })) }} placeholder="Введите пароль" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>{showPassword ? <EyeOff /> : <Eye />}</button></div>
            {errors.password && <span className="field-error" id="password-error">{errors.password}</span>}
          </div>
          <button type="submit" className="button button--primary button--wide" disabled={pending}>{pending ? 'Проверяем данные…' : 'Войти'}</button>
        </form>
        <div className="demo-credentials"><strong>Демо-доступ</strong><span>Логин: <button type="button" onClick={() => { setUsername('demo'); setPassword('gadget2024') }}>demo</button></span><span>Пароль: <code>gadget2024</code></span></div>
      </section>
    </div>
  )
}
