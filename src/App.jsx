import { useCallback, useEffect, useRef, useState } from 'react'
import Toast from './components/Toast.jsx'
import Header from './components/Header.jsx'
import LoadingButton from './components/LoadingButton.jsx'
import LandingPage from './components/LandingPage.jsx'
import TermsPage from './components/TermsPage.jsx'
import EmailStep from './components/EmailStep.jsx'
import VerificationStep from './components/VerificationStep.jsx'
import SignupWizard from './components/SignupWizard.jsx'
import InviteStep from './components/InviteStep.jsx'
import LocationStep from './components/LocationStep.jsx'
import SuccessState from './components/SuccessState.jsx'
import { STEPS, simulate } from './lib/data.js'

const INITIAL = { authMethod: '', email: '', subscribe: false, username: '', name: '', dob: null, age: null, pronouns: [], invite: '', location: '' }
const KNOWN = ['', 'terms', 'email', 'verify', 'profile', 'invite', 'location', 'done', 'browse']
const readRoute = () => window.location.hash.replace(/^#\/?/, '')

function resolve(route, verified, email) {
  const [head, sub] = route.split('/')
  if (!KNOWN.includes(head)) return ''
  if (['profile', 'invite', 'location', 'done'].includes(head) && !verified) return ''
  if (head === 'verify' && !email) return 'email'
  if (head === 'profile' && !STEPS.includes(sub)) return 'profile/username'
  return route
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  const [form, setForm] = useState(INITIAL)
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const inflight = useRef(false)

  const current = resolve(route, verified, form.email)
  const go = useCallback((r) => { window.location.hash = `/${r}` }, [])
  const notify = useCallback((type, message) => setToast({ type, message, id: Date.now() }), [])
  const closeToast = useCallback(() => setToast(null), [])
  const setField = useCallback((k, v) => setForm((f) => ({ ...f, [k]: v })), [])

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => { if (current !== route) window.location.replace(`#/${current}`) }, [current, route])
  useEffect(() => { window.scrollTo(0, 0) }, [current])

  // one request at a time: blocks duplicate submissions
  const run = async (fn) => {
    if (inflight.current) return undefined
    inflight.current = true
    setLoading(true)
    try { return await fn() } finally { inflight.current = false; setLoading(false) }
  }

  const google = (account) => run(async () => {
    await simulate('google')
    setForm((f) => ({ ...f, authMethod: 'google', email: account.email }))
    setVerified(true)
    go('profile/username')
  })

  const submitEmail = () => run(async () => {
    try {
      const email = form.email.trim()
      await simulate('sendOtp', { email })
      setForm((f) => ({ ...f, email, authMethod: 'email' }))
      setVerified(false)
      notify('success', 'Verification code sent.')
      go('verify')
    } catch (e) { notify('error', e.message) }
  })

  const verify = (code) => run(async () => {
    try {
      await simulate('verifyOtp', { code })
      setVerified(true)
      go('profile/username')
      return ''
    } catch (e) { notify('error', e.message); return e.message }
  })

  const resend = async () => {
    try {
      await simulate('sendOtp', { email: form.email })
      notify('success', 'A new code has been sent to your email.')
      return ''
    } catch (e) { notify('error', e.message); return e.message }
  }

  const signup = () => run(async () => {
    try { await simulate('signup', { invite: form.invite }); go('location'); return null }
    catch (e) { notify('error', e.message); return e }
  })

  const locationDone = (state) => { setField('location', state); go('done') }
  const reset = () => { setForm(INITIAL); setVerified(false); go('') }

  const [head, sub] = current.split('/')
  let view = null
  if (head === '') {
    view = <LandingPage loading={loading} onGoogle={google} onEmail={() => go('email')} onTerms={() => go('terms')} onBrowse={() => go('browse')} notify={notify} />
  } else if (head === 'terms') {
    view = <TermsPage onBack={() => go('')} onAccept={() => go('email')} />
  } else if (head === 'email') {
    view = <EmailStep email={form.email} subscribe={form.subscribe} setField={setField} onSubmit={submitEmail} onBack={() => go('')} loading={loading} notify={notify} />
  } else if (head === 'verify') {
    view = <VerificationStep email={form.email} onVerify={verify} onResend={resend} onBack={() => go('email')} loading={loading} notify={notify} />
  } else if (head === 'profile') {
    view = <SignupWizard step={STEPS.indexOf(sub)} form={form} setField={setField} go={go} notify={notify} />
  } else if (head === 'invite') {
    view = <InviteStep invite={form.invite} setField={setField} onSignup={signup} onBack={() => go('profile/pronouns')} loading={loading} notify={notify} />
  } else if (head === 'location') {
    view = <LocationStep onDone={locationDone} notify={notify} />
  } else if (head === 'done') {
    view = <SuccessState name={form.name} location={form.location} onExplore={() => go('browse')} onReset={reset} />
  } else if (head === 'browse') {
    view = (
      <main className="screen">
        <Header right="GUEST MODE" />
        <div className="wizard-body step-anim">
          <h1 className="title">You're browsing as a guest</h1>
          <p className="field-help">Events and plans would appear here. This exercise covers sign-up only, so this screen is a placeholder.</p>
        </div>
        <div className="wizard-actions"><LoadingButton variant="outline" onClick={() => go('')}>BACK</LoadingButton></div>
      </main>
    )
  }

  return <div className="app">{view}<Toast toast={toast} onClose={closeToast} /></div>
}