import { useEffect, useState } from 'react'
import Header from './Header.jsx'
import LoadingButton from './LoadingButton.jsx'

const MESSAGES = {
  denied: 'Location is off. Turn it on to see events and people near you.',
  blocked: "Your browser is blocking location access. Allow it in your browser's site settings, then try again.",
  error: "We couldn't get your location. Please try again.",
}

export default function LocationStep({ onDone, notify }) {
  const [dialog, setDialog] = useState(true)
  const [status, setStatus] = useState('asking') // asking | fetching | denied | blocked | error

  const deny = () => { setDialog(false); setStatus('denied') }

  useEffect(() => {
    if (!dialog) return undefined
    const onKey = (e) => { if (e.key === 'Escape') deny() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dialog])

  const allow = () => {
    setDialog(false)
    setStatus('fetching')
    if (!('geolocation' in navigator) || !window.isSecureContext) {
      setStatus('error')
      notify('error', 'Location is not available in this browser or connection.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => onDone('granted'), // coordinates are discarded; only consent is kept
      (err) => {
        setStatus(err.code === 1 ? 'blocked' : 'error')
        notify('error', err.code === 1 ? 'Location permission was blocked.' : "Couldn't get your location.")
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }
  const retry = () => { setStatus('asking'); setDialog(true) }
  const failed = MESSAGES[status]

  return (
    <main className="screen">
      <Header />
      <div className="wizard-body step-anim">
        <h1 className="loc-title">TRYING TO FETCH YOUR <b>LOCATION</b>...</h1>
        {failed && <p className="loc-msg" role="alert">{failed}</p>}
      </div>
      <div className="wizard-actions">
        <LoadingButton onClick={retry} loading={status === 'fetching'} disabled={status === 'asking'}>ENABLE LOCATION</LoadingButton>
        {failed && <LoadingButton variant="outline" onClick={() => onDone('skipped')}>SKIP FOR NOW</LoadingButton>}
      </div>
      {dialog && (
        <div className="android-backdrop">
          <div className="android-dialog" role="alertdialog" aria-modal="true" aria-labelledby="loc-q">
            <div className="android-row">
              <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path fill="#009688" d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7Z" /><circle cx="12" cy="9" r="2.6" fill="#fff" /></svg>
              <p id="loc-q">Allow <b>Extroverts</b> to access this device's location?</p>
            </div>
            <div className="android-actions">
              <button type="button" onClick={deny}>DENY</button>
              <button type="button" onClick={allow} autoFocus>ALLOW</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}