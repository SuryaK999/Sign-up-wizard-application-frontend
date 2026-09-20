import { useEffect, useRef, useState } from 'react'
import Header from './Header.jsx'
import FormField from './FormField.jsx'
import LoadingButton from './LoadingButton.jsx'
import { validateEmail } from '../lib/data.js'

export default function EmailStep({ email, subscribe, setField, onSubmit, onBack, loading, notify }) {
  const [touched, setTouched] = useState(false)
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])
  const invalid = validateEmail(email)

  const submit = (e) => {
    e.preventDefault()
    if (loading) return
    setTouched(true)
    if (invalid) { notify('error', invalid); ref.current?.focus(); return }
    onSubmit()
  }

  return (
    <main className="screen">
      <Header />
      <form className="form step-anim" onSubmit={submit} noValidate>
        <h1 className="title">Enter your email</h1>
        <FormField
          ref={ref} hideLabel label="Email" placeholder="EMAIL" type="email" inputMode="email"
          autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={254}
          value={email} error={touched ? invalid : ''}
          onChange={(e) => setField('email', e.target.value.replace(/\s/g, ''))}
          onBlur={() => setTouched(true)}
        />
        <LoadingButton type="submit" loading={loading} className="mt">PROCEED</LoadingButton>
        <label className="check">
          <input type="checkbox" checked={subscribe} onChange={(e) => setField('subscribe', e.target.checked)} />
          <span className="box" aria-hidden="true" />
          <span>I'd like to subscribe to your newsletter</span>
        </label>
        <button type="button" className="link-back" onClick={onBack}>← Back</button>
      </form>
    </main>
  )
}