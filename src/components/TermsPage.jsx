import Header from './Header.jsx'
import LoadingButton from './LoadingButton.jsx'

const SECTIONS = [
  ['1. Acceptance of terms', 'By creating an account or using Extroverts you agree to these Terms & Conditions and to our Privacy Policy. If you do not agree, please do not use the app.'],
  ['2. Eligibility', 'Extroverts is available to people aged 18 or older. You confirm that the date of birth you provide is accurate.'],
  ['3. Your account', 'Keep your sign-in details private. Your name cannot be changed after sign-up, and you are responsible for activity on your account.'],
  ['4. Community guidelines', 'Be kind. Harassment, hate, impersonation and unsafe behavior at events are not allowed and may lead to removal.'],
  ['5. Events and meetups', 'Events are organized by members. Use your judgment, meet in safe places and report anything that feels wrong.'],
  ['6. Privacy and location', 'We use your information to run and improve the app. Location is only used with your permission, and you can turn it off at any time.'],
  ['7. Changes', 'We may update these terms as the app evolves. We will let you know about important changes.'],
]

export default function TermsPage({ onBack, onAccept }) {
  return (
    <main className="screen">
      <Header right="TERMS" />
      <div className="wizard-body step-anim terms">
        <h1 className="title">Terms &amp; Conditions</h1>
        {SECTIONS.map(([h, p]) => (<section key={h}><h2>{h}</h2><p>{p}</p></section>))}
      </div>
      <div className="wizard-actions">
        <LoadingButton onClick={onAccept}>ACCEPT &amp; CONTINUE</LoadingButton>
        <LoadingButton variant="outline" onClick={onBack}>BACK</LoadingButton>
      </div>
    </main>
  )
}