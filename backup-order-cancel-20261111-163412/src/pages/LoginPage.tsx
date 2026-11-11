import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore, DEMO_CREDENTIALS } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { loginAdmin } from '@/stores/admin'
import IconBase from '@/components/ui/IconBase'

type LoginMode = 'customer' | 'admin'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [mode, setMode] = useState<LoginMode>(
    params.get('mode') === 'admin' ? 'admin' : 'customer'
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = useAuthStore((s) => s.login)
  const notify = useUiStore((s) => s.notifySuccess)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'admin') {
      const ok = loginAdmin(adminCode)
      setLoading(false)

      if (!ok) {
        setError(t('auth.adminLoginError'))
        return
      }

      notify(t('auth.adminLoginSuccess'))
      navigate('/admin', { replace: true })
      return
    }

    const ok = await login(email, password)
    setLoading(false)

    if (!ok) {
      setError(t('auth.loginError'))
      return
    }

    notify(t('auth.loginSuccess'))
    navigate(params.get('redirect') || '/conta')
  }

  function changeMode(next: LoginMode) {
    setMode(next)
    setError('')
    setAdminCode('')
    setPassword('')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 px-4 dark:from-gray-900 dark:via-gray-dark dark:to-gray-900">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-500/10" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-warning-100/60 blur-3xl dark:bg-brand-700/10" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <Link to="/" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-theme-md">
            <span className="text-2xl font-bold">L</span>
          </Link>
          <h1 className="mt-5 text-title-sm font-bold text-heading">
            {mode === 'admin' ? t('auth.adminTitle') : t('auth.loginTitle')}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === 'admin' ? t('auth.adminSubtitle') : t('auth.loginSubtitle')}
          </p>
        </div>

        <div className="surface-card rounded-2xl border p-6 shadow-theme-md md:p-8">
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-900">
            <button
              type="button"
              onClick={() => changeMode('customer')}
              className={`rounded-lg px-3 py-3 text-sm font-medium transition ${mode === 'customer' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-800 dark:text-brand-400' : 'text-muted'}`}
            >
              {t('auth.customerTab')}
            </button>
            <button
              type="button"
              onClick={() => changeMode('admin')}
              className={`rounded-lg px-3 py-3 text-sm font-medium transition ${mode === 'admin' ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-800 dark:text-brand-400' : 'text-muted'}`}
            >
              <span className="inline-flex items-center gap-2">
                <IconBase name="shield-check" size={16} />
                {t('auth.adminTab')}
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'customer' ? (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-heading" htmlFor="email">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <IconBase name="mail" size={18} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="h-11 w-full rounded-lg border border-themed bg-gray-50 pl-10 pr-3 text-sm text-body outline-none focus:border-brand-300 focus-ring dark:bg-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-heading" htmlFor="password">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <IconBase name="lock" size={18} />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-lg border border-themed bg-gray-50 pl-10 pr-10 text-sm text-body outline-none focus:border-brand-300 focus-ring dark:bg-gray-900"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      <IconBase name={showPassword ? 'eye-off' : 'eye'} size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-body">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-themed accent-brand-500"
                    />
                    {t('auth.remember')}
                  </label>
                  <a href="#" className="font-medium text-brand-500 hover:text-brand-600">
                    {t('auth.forgot')}
                  </a>
                </div>
              </>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-medium text-heading" htmlFor="admin-code">
                  {t('auth.adminCode')}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <IconBase name="lock" size={18} />
                  </span>
                  <input
                    id="admin-code"
                    type={showPassword ? 'text' : 'password'}
                    inputMode="numeric"
                    autoComplete="current-password"
                    required
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="••••••"
                    className="h-11 w-full rounded-lg border border-themed bg-gray-50 pl-10 pr-10 text-sm text-body outline-none focus:border-brand-300 focus-ring dark:bg-gray-900"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    <IconBase name={showPassword ? 'eye-off' : 'eye'} size={18} />
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted">{t('auth.adminHint')}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-brand-500 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {t('auth.loggingIn')}
                </span>
              ) : (
                mode === 'admin' ? t('auth.adminLogin') : t('auth.loginCta')
              )}
            </button>

            {error && (
              <p className="rounded-lg bg-error-50 px-4 py-2 text-center text-sm text-error-600 dark:bg-error-500/15 dark:text-error-500">
                {error}
              </p>
            )}
          </form>

          {mode === 'customer' && (
            <div className="mt-6 rounded-lg border border-dashed border-themed bg-gray-50/60 p-3 text-xs text-muted dark:bg-gray-900/40">
              <p className="font-medium text-body">{t('auth.demoTitle')}</p>
              <p>{DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}</p>
              <p className="mt-0.5">{t('auth.demoHint')}</p>
            </div>
          )}
        </div>

        {mode === 'customer' ? (
          <p className="mt-6 text-center text-sm text-muted">
            {t('auth.noAccount')}{' '}
            <Link to="/registro" className="font-medium text-brand-500 hover:text-brand-600">
              {t('auth.registerCta')}
            </Link>
          </p>
        ) : (
          <p className="mt-6 text-center text-sm text-muted">
            <Link to="/" className="font-medium text-brand-500 hover:text-brand-600">
              {t('common.back')} 
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
