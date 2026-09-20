import { useEffect, useRef, useState } from 'react'
import Header from './Header.jsx'
import ProgressIndicator from './ProgressIndicator.jsx'
import ProfileStep from './ProfileStep.jsx'
import LoadingButton from './LoadingButton.jsx'
import { STEPS, simulate, stepError } from '../lib/data.js'

export default function SignupWizard({ step, form, setField, go, notify }) {
  const [touched, setTouched] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const busy = useRef(false)
  const inputRef = useRef(null)

  useEffect(() => { setServerError(''); inputRef.current?.focus() }, [step])

  const invalid = stepError(step, form)
  const shownError = serverError || (touched[step] ? invalid : '')
  const markTouched = () => setTouched((t) => ({ ...t, [step]: true }))
  const change = (k, v) => { setServerError(''); setField(k, v) }

  const advance = async (e) => {
    e?.preventDefault()
    if (busy.current) return
    markTouched()
    if (invalid) { notify('error', invalid); return }
    busy.current = true
    setLoading(true)
    try {
      if (step === 0) await simulate('username', { username: form.username })
      else await simulate('save')
      go(step === 3 ? 'invite' : `profile/${STEPS[step + 1]}`)
    } catch (ex) {
      if (ex.field) setServerError(ex.message)
      notify('error', ex.message)
    } finally {
      busy.current = false
      setLoading(false)
    }
  }

  const back = () => {
    if (step === 0) go(form.authMethod === 'email' ? 'email' : '')
    else go(`profile/${STEPS[step - 1]}`)
  }

  return (
    <main className="screen">
      <Header right="GETTING READY" />
      <ProgressIndicator step={step} total={STEPS.length} />
      <form className="wizard-form" onSubmit={advance} noValidate>
        <div className="wizard-body">
          <div key={step} className="step-anim">
            <ProfileStep step={step} form={form} setField={change} error={shownError} onBlur={markTouched} inputRef={inputRef} />
          </div>
        </div>
        <div className="wizard-actions">
          <LoadingButton type="submit" loading={loading} disabled={!!invalid}>NEXT</LoadingButton>
          <LoadingButton variant="outline" onClick={back} disabled={loading}>BACK</LoadingButton>
        </div>
      </form>
    </main>
  )
}