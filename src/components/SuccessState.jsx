import Header from './Header.jsx'
import LoadingButton from './LoadingButton.jsx'

export default function SuccessState({ name, location, onExplore, onReset }) {
  const first = name.trim().split(' ')[0]
  return (
    <main className="screen">
      <Header />
      <div className="wizard-body success">
        <div className="tick" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
        </div>
        <h1 className="title" role="status">You're all set{first ? `, ${first}` : ''}!</h1>
        <p className="field-help">
          Your Extroverts profile is ready. {location === 'granted' ? 'Location is on, so events near you will show up first.' : 'Location is off. You can turn it on any time.'}
        </p>
      </div>
      <div className="wizard-actions">
        <LoadingButton onClick={onExplore}>EXPLORE EVENTS</LoadingButton>
        <LoadingButton variant="outline" onClick={onReset}>START OVER</LoadingButton>
      </div>
    </main>
  )
}