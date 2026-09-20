import { useEffect, useRef, useState } from 'react'
import Header from './Header.jsx'
import LoadingButton from './LoadingButton.jsx'

const EMPTY = Array(6).fill('')
const MAX_ATTEMPTS = 5

export default function VerificationStep({ email, onVerify, onResend, onBack, loading, notify }) {
  const [digits, setDigits] = useState(EMPTY)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(30)
  const [attempts, setAttempts] = useState(0)
  const [resending, setResending] = useState(false)
  const refs = useRef([])
  const code = digits.join('')

  useEffect(() => { refs.current[0]?.focus() }, [])
  useEffect(() => {
    if (cooldown <= 0) return undefined
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const setAt = (i, v) => setDigits((d) => d.map((x, k) => (k === i ? v : x)))
  const fill = (start, str) => {
    const next = [...digits]
    str.split('').forEach((ch, k) => { if (start + k < 6) next[start + k] = ch })
    setDigits(next)
    refs.current[Math.min(start + str.length, 5)]?.focus()
  }

  const onChange = (i, e) => {
    setError('')
    const v = e.target.value.replace(/\D/g, '')
    if (!v) { setAt(i, ''); return }
    if (v.length === 1) { setAt(i, v); if (i < 5) refs.current[i + 1]?.focus() }
    else fill(i, v) // autofill or multi-char input
  }
  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) { e.preventDefault(); setAt(i - 1, ''); refs.current[i - 1]?.focus() }
    else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); refs.current[i - 1]?.focus() }
    else if (e.key === 'ArrowRight' && i < 5) { e.preventDefault(); refs.current[i + 1]?.focus() }
  }
  const onPaste = (i, e) => {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '')
    if (!text) return
    e.preventDefault()
    setError('')
    fill(text.length >= 6 ? 0 : i, text.slice(0, 6))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (loading) return
    if (attempts >= MAX_ATTEMPTS) { setError('Too many attempts. Request a new code.'); return }
    if (code.length < 6) { setError('Enter the 6-digit code'); notify('error', 'Please enter the full 6-digit code.'); return }
    const message = await onVerify(code)
    if (message) {
      setError(message)
      const n = attempts + 1
      setAttempts(n)
      setDigits(EMPTY)
      refs.current[0]?.focus()
      if (n >= MAX_ATTEMPTS) setError('Too many attempts. Request a new code.')
    }
  }

  const resend = async () => {
    if (cooldown > 0 || resending) return
    setResending(true)
    const failed = await onResend()
    setResending(false)
    if (!failed) { setCooldown(30); setAttempts(0); setError(''); setDigits(EMPTY); refs.current[0]?.focus() }
  }

  return (
    <main className="screen">
      <Header center />
      <form className="form step-anim" onSubmit={submit} noValidate>
        <h1 className="otp-title" id="otp-label">ENTER OTP</h1>
        <div className="otp-row" role="group" aria-labelledby="otp-label">
          {digits.map((d, i) => (
            <input
              key={i} ref={(el) => { refs.current[i] = el }}
              className={`otp-slot${error ? ' is-error' : ''}`}
              type="text" inputMode="numeric" pattern="[0-9]*" placeholder="•"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              aria-label={`Digit ${i + 1} of 6`} aria-invalid={!!error}
              value={d} readOnly={loading}
              onFocus={(e) => e.target.select()}
              onChange={(e) => onChange(i, e)} onKeyDown={(e) => onKeyDown(i, e)} onPaste={(e) => onPaste(i, e)}
            />
          ))}
        </div>
        {error && <p className="field-error" role="alert">{error}</p>}
        <div className="resend-row">
          <button type="button" className="resend" onClick={resend} disabled={cooldown > 0 || resending}>
            {resending ? 'Sending…' : cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
          </button>
        </div>
        <div className="stack">
          <LoadingButton type="submit" loading={loading} disabled={attempts >= MAX_ATTEMPTS}>VERIFY</LoadingButton>
          <LoadingButton variant="outline" onClick={onBack} disabled={loading}>GO BACK</LoadingButton>
        </div>
        <p className="info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
          <span>A 6-digit OTP has been sent to {email}.</span>
        </p>
      </form>
    </main>
  )
}