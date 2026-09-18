import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const steps = ['Email', 'Verify', 'About you', 'Profile']
const locations = {
  India: { 'Andhra Pradesh': ['Amalapuram', 'Rajahmundry', 'Visakhapatnam'], Telangana: ['Hyderabad', 'Warangal'] },
  'United States': { California: ['San Francisco', 'Los Angeles'], Texas: ['Austin', 'Houston'] },
}

function Icon({ name, size = 20 }) {
  const paths = { arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>, back: <><path d="m15 18-6-6 6-6"/><path d="M9 12h10"/></>, check: <path d="m5 12 4 4L19 6"/>, mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>, lock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>, user: <><circle cx="12" cy="8" r="3"/><path d="M5 20a7 7 0 0 1 14 0"/></>, spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .6 1.9L21.5 18l-1.9.6L19 20.5l-.6-1.9-1.9-.6 1.9-.6L19 16Z"/></>, info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></> }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function App() {
  const [view, setView] = useState('landing')
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ email: '', code: '', name: '', age: '', pronouns: '', country: 'India', state: '', city: '', college: '' })
  const [touched, setTouched] = useState({})
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const [otpSent, setOtpSent] = useState(false)
  const [completed, setCompleted] = useState(false)
  const firstInput = useRef(null)

  useEffect(() => { if (view === 'wizard') setTimeout(() => firstInput.current?.focus(), 80) }, [view, step])
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 4200); return () => clearTimeout(t) } }, [toast])

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }))
  const mark = key => setTouched(t => ({ ...t, [key]: true }))
  const emailValid = /^\S+@\S+\.\S+$/.test(form.email)
  const errors = useMemo(() => {
    const e = {}
    if (step === 0 && touched.email && !emailValid) e.email = form.email.trim() ? 'Enter a valid email address.' : 'Email is required.'
    if (step === 1 && touched.code && form.code.length !== 6) e.code = 'Enter the 6-digit code.'
    if (step === 2 && touched.name && form.name.trim().length < 2) e.name = 'Please enter your name.'
    if (step === 3) {
      if (touched.age && (!/^\d+$/.test(form.age) || Number(form.age) < 13 || Number(form.age) > 120)) e.age = 'Enter an age from 13 to 120.'
      if (touched.pronouns && !form.pronouns) e.pronouns = 'Choose an option to continue.'
    }
    return e
  }, [step, touched, form, emailValid])

  const validate = () => {
    const keys = step === 0 ? ['email'] : step === 1 ? ['code'] : step === 2 ? ['name'] : ['age', 'pronouns']
    setTouched(t => ({ ...t, ...Object.fromEntries(keys.map(k => [k, true])) }))
    if (step === 0 && !emailValid) return false
    if (step === 1 && form.code !== '123456') return false
    if (step === 2 && form.name.trim().length < 2) return false
    if (step === 3 && (!/^\d+$/.test(form.age) || Number(form.age) < 13 || Number(form.age) > 120 || !form.pronouns)) return false
    return true
  }

  const submit = () => {
    if (!validate()) { setToast({ type: 'error', text: step === 1 ? 'That code did not match. Try 123456 for the demo.' : 'Check the highlighted fields and try again.' }); return }
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      if (step === 0) { setOtpSent(true); setStep(1); setToast({ type: 'success', text: 'A verification code was sent to your inbox.' }) }
      else if (step === 3) { setCompleted(true) }
      else setStep(s => s + 1)
    }, 850)
  }

  const begin = () => { setView('wizard'); setStep(0); setCompleted(false) }
  const back = () => { if (step === 0) setView('landing'); else setStep(s => s - 1) }
  const startOver = () => { setForm({ email: '', code: '', name: '', age: '', pronouns: '', country: 'India', state: '', city: '', college: '' }); setTouched({}); setStep(0); setCompleted(false); setOtpSent(false) }
  const stateOptions = Object.keys(locations[form.country] || {})
  const cityOptions = locations[form.country]?.[form.state] || []

  if (view === 'terms') return <Terms onBack={() => setView('landing')} onContinue={begin} />
  if (view === 'landing') return <Landing onStart={begin} onTerms={() => setView('terms')} />
  if (completed) return <Success name={form.name} onStartOver={startOver} />

  return <main className="shell wizard-shell">
    <div className="ambient a1"/><div className="ambient a2"/>
    <header className="topbar"><button className="brand" onClick={() => setView('landing')}><span className="brand-mark"><Icon name="spark" size={18}/></span> nubpack</button><span className="secure"><Icon name="lock" size={15}/> Secure sign up</span></header>
    <section className="wizard-card">
      <button className="back-btn" onClick={back}><Icon name="back" size={18}/> <span>{step === 0 ? 'Back to welcome' : 'Back'}</span></button>
      <div className="progress" aria-label={`Step ${step + 1} of 4`}>{steps.map((label, i) => <React.Fragment key={label}><div className={`progress-item ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}><span>{i < step ? <Icon name="check" size={14}/> : i + 1}</span><small>{label}</small></div>{i < 3 && <div className={`line ${i < step ? 'active' : ''}`}/>}</React.Fragment>)}</div>
      <div className="wizard-content">
        <div className="eyebrow">Step {step + 1} of 4</div>
        {step === 0 && <EmailStep ref={firstInput} form={form} update={update} mark={mark} error={errors.email} onTerms={() => setView('terms')} />}
        {step === 1 && <VerifyStep ref={firstInput} form={form} update={update} mark={mark} error={errors.code} email={form.email} otpSent={otpSent} resend={() => setToast({ type: 'success', text: 'A new code is on its way.' })} />}
        {step === 2 && <NameStep ref={firstInput} form={form} update={update} mark={mark} error={errors.name} />}
        {step === 3 && <ProfileStep firstInput={firstInput} form={form} update={update} mark={mark} errors={errors} stateOptions={stateOptions} cityOptions={cityOptions} />}
        <button className="primary" onClick={submit} disabled={busy}>{busy ? <><span className="spinner"/> Checking…</> : <>{step === 3 ? 'Complete profile' : step === 0 ? 'Continue' : 'Continue'} <Icon name="arrow" size={18}/></>}</button>
        <p className="fineprint"><Icon name="lock" size={13}/> Your information is private and never shared.</p>
      </div>
    </section>
    {toast && <div className={`toast ${toast.type}`} role="alert"><span className="toast-dot">{toast.type === 'success' ? <Icon name="check" size={14}/> : '!'}</span>{toast.text}<button onClick={() => setToast(null)}>×</button></div>}
  </main>
}

const Field = React.forwardRef(function Field({ label, hint, error, icon, children, ...props }, ref) { return <label className={`field ${error ? 'has-error' : ''}`}><span className="field-label">{label}{hint && <em>{hint}</em>}</span><div className="input-wrap">{icon && <span className="input-icon"><Icon name={icon} size={18}/></span>}{children || <input ref={ref} {...props} />}</div>{error && <span className="error-text">{error}</span>}</label> })
const EmailStep = React.forwardRef(({ form, update, mark, error, onTerms }, ref) => <><div className="hero-icon"><Icon name="mail" size={24}/></div><h1>Let’s get you started.</h1><p className="subhead">Create your account with an email you can access. We’ll use it to verify you securely.</p><Field ref={ref} label="Email address" placeholder="you@example.com" type="email" value={form.email} onChange={e => update('email', e.target.value)} onBlur={() => mark('email')} error={error} icon="mail" autoComplete="email" /><label className="terms-check"><input type="checkbox" defaultChecked/> <span>I agree to the <button type="button" onClick={onTerms}>Terms & Conditions</button> and Privacy Policy.</span></label></>)
const VerifyStep = React.forwardRef(({ form, update, mark, error, email, resend }, ref) => <><div className="hero-icon violet"><Icon name="lock" size={24}/></div><h1>Check your inbox.</h1><p className="subhead">We sent a 6-digit verification code to <strong>{email}</strong>.</p><Field ref={ref} label="Verification code" hint="6 digits" inputMode="numeric" maxLength={6} placeholder="000000" value={form.code} onChange={e => update('code', e.target.value.replace(/\D/g, '').slice(0, 6))} onBlur={() => mark('code')} error={error} autoComplete="one-time-code" /><p className="demo-hint"><Icon name="info" size={15}/> Demo mode: use <b>123456</b></p><button className="text-btn" onClick={resend}>Didn’t receive it? Resend code</button></>)
const NameStep = React.forwardRef(({ form, update, mark, error }, ref) => <><div className="hero-icon blue"><Icon name="user" size={24}/></div><h1>What should we call you?</h1><p className="subhead">A name helps make your experience feel like yours.</p><Field ref={ref} label="Your name" hint="30 characters max" maxLength={30} placeholder="Enter your name" value={form.name} onChange={e => update('name', e.target.value)} onBlur={() => mark('name')} error={error} icon="user" autoComplete="name" /></>)
function ProfileStep({ firstInput, form, update, mark, errors, stateOptions, cityOptions }) { return <><div className="hero-icon green"><Icon name="spark" size={24}/></div><h1>A little more about you.</h1><p className="subhead">These details help us tailor your experience. You can change them later.</p><div className="two-col"><Field ref={firstInput} label="Age" hint="13+" inputMode="numeric" maxLength={3} placeholder="e.g. 21" value={form.age} onChange={e => update('age', e.target.value.replace(/\D/g, '').slice(0, 3))} onBlur={() => mark('age')} error={errors.age} /><label className={`field ${errors.pronouns ? 'has-error' : ''}`}><span className="field-label">Pronouns</span><div className="input-wrap"><select value={form.pronouns} onChange={e => { update('pronouns', e.target.value); mark('pronouns') }}><option value="">Select pronouns</option><option>She / her</option><option>He / him</option><option>They / them</option><option>Prefer not to say</option></select></div>{errors.pronouns && <span className="error-text">{errors.pronouns}</span>}</label></div><div className="section-label">Optional location <span>helps personalize your experience</span></div><div className="two-col"><Select label="Country" value={form.country} onChange={v => { update('country', v); update('state', ''); update('city', '') }} options={Object.keys(locations)} /><Select label="State / region" value={form.state} onChange={v => { update('state', v); update('city', '') }} options={stateOptions} disabled={!stateOptions.length} /><Select label="City" value={form.city} onChange={v => update('city', v)} options={cityOptions} disabled={!cityOptions.length} /><Field label="College / workplace" hint="Optional" placeholder="Type here" value={form.college} onChange={e => update('college', e.target.value.slice(0, 60))} /></div></> }
function Select({ label, value, onChange, options, disabled }) { return <label className="field"><span className="field-label">{label}</span><div className="input-wrap"><select disabled={disabled} value={value} onChange={e => onChange(e.target.value)}><option value="">Select {label.toLowerCase()}</option>{options.map(o => <option key={o}>{o}</option>)}</select></div></label> }
function Landing({ onStart, onTerms }) { return <main className="shell landing"><div className="ambient a1"/><div className="ambient a2"/><header className="topbar"><div className="brand"><span className="brand-mark"><Icon name="spark" size={18}/></span> nubpack</div><button className="quiet-btn" onClick={onTerms}>Terms & Conditions</button></header><section className="landing-grid"><div className="landing-copy"><div className="pill"><span className="pulse"/> A calmer way to get started</div><h1>Make space for<br/><span>what matters.</span></h1><p>One thoughtful place for your ideas, your people, and your next big thing. Set up your profile in under a minute.</p><button className="primary large" onClick={onStart}>Create your account <Icon name="arrow" size={19}/></button><div className="trust"><span className="avatar-stack"><i>R</i><i>A</i><i>S</i></span><span>Join a growing community<br/><b>Built for real life.</b></span></div></div><div className="visual-card"><div className="orb orb-one"/><div className="orb orb-two"/><div className="mini-card top"><span className="mini-logo"><Icon name="spark" size={14}/></span><div><b>Your space is ready</b><small>Start something new</small></div><span className="mini-check"><Icon name="check" size={14}/></span></div><div className="glass-panel"><span className="eyebrow">A little more you</span><h3>Good things<br/><em>take shape.</em></h3><div className="line-art"><span/><span/><span/><span/></div><div className="panel-footer"><span>01</span><span>Explore your space <Icon name="arrow" size={13}/></span></div></div><div className="mini-card bottom"><span className="round-icon"><Icon name="spark" size={15}/></span><div><b>Small steps, big energy</b><small>Profile 80% complete</small></div></div></div></section><footer className="landing-foot"><span>© 2026 nubpack</span><span><Icon name="lock" size={13}/> Privacy-first by design</span></footer></main> }
function Terms({ onBack, onContinue }) { return <main className="shell terms-page"><header className="topbar"><button className="brand" onClick={onBack}><span className="brand-mark"><Icon name="spark" size={18}/></span> nubpack</button><button className="back-btn" onClick={onBack}><Icon name="back" size={18}/> Back</button></header><article className="terms-card"><div className="eyebrow">Last updated · September 2026</div><h1>Terms & Conditions</h1><p className="subhead">Simple, clear, and designed to help you understand how nubpack works.</p><div className="terms-copy"><h2>Welcome to nubpack</h2><p>By creating an account, you agree to use nubpack responsibly and provide information that is accurate to the best of your knowledge.</p><h2>Your account</h2><p>Keep your sign-in information private. You are responsible for activity that happens through your account and may update your profile details at any time.</p><h2>Your privacy</h2><p>We use your information to provide and improve your experience. We do not sell your personal information, and you remain in control of your profile.</p><h2>Using nubpack</h2><p>Please treat other people and the service with respect. We may update these terms when the service changes and will make important updates clear.</p></div><button className="primary" onClick={onContinue}>I understand <Icon name="arrow" size={18}/></button></article></main> }
function Success({ name, onStartOver }) { return <main className="shell success-page"><div className="ambient a1"/><div className="success-card"><div className="success-icon"><Icon name="check" size={34}/></div><div className="pill success-pill">Profile complete</div><h1>You’re all set{name ? `, ${name.split(' ')[0]}` : ''}.</h1><p>Your account is ready. Welcome to a space built around what matters to you.</p><div className="success-summary"><span><Icon name="check" size={16}/> Email verified</span><span><Icon name="check" size={16}/> Profile saved</span></div><button className="primary" onClick={onStartOver}>Back to welcome <Icon name="arrow" size={18}/></button></div></main> }

createRoot(document.getElementById('root')).render(<App />)
    
