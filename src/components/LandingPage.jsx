import { useEffect, useRef, useState } from 'react'
import Logo from './Logo.jsx'

const ACCOUNTS = [
  { name: 'Alex Morgan', email: 'alex.morgan.demo@example.com', color: '#0b57d0' },
  { name: 'Jordan Lee', email: 'jordan.lee.demo@example.com', color: '#188038' },
  { name: 'Sam Rivera', email: 'sam.rivera.demo@example.com', color: '#b3261e' },
]

const GoogleG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
)
const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
)
const PersonAdd = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.5-3.6 3.2-5.5 6.5-5.5s6 1.9 6.5 5.5" /><path d="M19 7v6M16 10h6" />
  </svg>
)

function ChooserIcon() {
  const [ok, setOk] = useState(true)
  return (
    <div className="gc-logo">
      {ok ? <img src="/assets/logo.png" alt="" onError={() => setOk(false)} /> : <Logo size={24} />}
    </div>
  )
}

function GoogleChooser({ busy, onClose, onPick, onAdd }) {
  const firstRef = useRef(null)
  useEffect(() => { firstRef.current?.focus() }, [])
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [busy, onClose])

  return (
    <div className="gc-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose() }}>
      <div className="gc" role="dialog" aria-modal="true" aria-labelledby="gc-title" aria-busy={busy}>
        <ChooserIcon />
        <h2 id="gc-title" className="gc-title">Choose an account</h2>
        <p className="gc-sub">to continue to Extroverts</p>
        <ul className="gc-list">
          {ACCOUNTS.map((a, i) => (
            <li key={a.email}>
              <button ref={i === 0 ? firstRef : null} type="button" className="gc-account" disabled={busy} onClick={() => onPick(a)}>
                <span className="gc-avatar" style={{ background: a.color }}>{a.name[0]}</span>
                <span className="gc-text"><span className="gc-name">{a.name}</span><span className="gc-email">{a.email}</span></span>
              </button>
            </li>
          ))}
          <li>
            <button type="button" className="gc-account gc-add" disabled={busy} onClick={onAdd}>
              <PersonAdd /><span className="gc-name">Add another account</span>
            </button>
          </li>
        </ul>
        <p className="gc-legal">To continue, Google will share your name, email address, and profile picture with Extroverts.</p>
        {busy && <div className="gc-busy"><span className="gc-spinner" /></div>}
      </div>
    </div>
  )
}

export default function LandingPage({ loading, onGoogle, onEmail, onTerms, onBrowse, notify }) {
  const [chooser, setChooser] = useState(false)
  const googleBtn = useRef(null)
  const close = () => { setChooser(false); googleBtn.current?.focus() }

  return (
    <main className="screen landing">
      <div className="landing-bg" aria-hidden="true" />
      <div className="landing-inner">
        <div className="landing-logo"><Logo size={64} /></div>
        <div className="landing-bottom">
          <p className="tagline">Life happens out there.</p>
          <h1 className="brand-title">EXTROVERTS</h1>
          <div className="landing-actions">
            <button ref={googleBtn} type="button" className="btn-landing btn-solid" onClick={() => setChooser(true)}><GoogleG /><span>CONTINUE WITH GOOGLE</span></button>
            <button type="button" className="btn-landing btn-solid" onClick={onEmail}><MailIcon /><span>CONTINUE WITH EMAIL</span></button>
            <button type="button" className="btn-landing btn-outline" onClick={onBrowse}><span>BROWSE</span></button>
          </div>
          <p className="legal">
            By continuing, you agree to our<br />
            <button type="button" className="link" onClick={onTerms}>Terms &amp; Conditions</button> and{' '}
            <button type="button" className="link" onClick={onTerms}>Privacy Policy</button>.
          </p>
        </div>
      </div>
      {chooser && (
        <GoogleChooser
          busy={loading}
          onClose={close}
          onPick={onGoogle}
          onAdd={() => notify('info', 'Adding accounts is disabled in this demo. Pick an account, or use "Continue with email".')}
        />
      )}
    </main>
  )
}