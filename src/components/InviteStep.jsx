import { useState } from 'react'
import Header from './Header.jsx'
import ProgressIndicator from './ProgressIndicator.jsx'
import FormField from './FormField.jsx'
import LoadingButton from './LoadingButton.jsx'
import { LIMITS, validateInvite } from '../lib/data.js'

const LINES = [
  ['KINDNESS = GOOD ', 'HAIR', ' DAY'],
  ['SIP IN? ', 'CHIP', ' IN.'],
  ['GHOSTING IS FOR ', 'HALLOWEEN', '.'],
  ['OUTFITS LOUD, ', 'INTENTIONS', ' CLEAR.'],
  ['JOINING? FREE. HOSTING? ', 'ALSO', ' FREE.'],
  ['EARLLY IS ', 'ICONIC', '.'],
  ['YES. ', 'SPELLING', ' MISTAKE.'],
]

export default function InviteStep({ invite, setField, onSignup, onBack, loading, notify }) {
  const [touched, setTouched] = useState(false)
  const [serverError, setServerError] = useState('')
  const invalid = validateInvite(invite)
  const shown = serverError || (touched ? invalid : '')

  const submit = async (e) => {
    e.preventDefault()
    if (loading) return
    setTouched(true)
    if (invalid) { notify('error', invalid); return }
    const err = await onSignup()
    if (err && err.field === 'invite') setServerError(err.message)
  }

  return (
    <main className="screen">
      <Header right="GETTING READY" />
      <ProgressIndicator step={3} total={4} />
      <form className="wizard-form" onSubmit={submit} noValidate>
        <div className="wizard-body step-anim">
          <div className="manifesto">
            {LINES.map(([a, hl, b], i) => (
              <p key={a} style={{ animationDelay: `${i * 130}ms` }}>{a}<b>{hl}</b>{b}</p>
            ))}
          </div>
          <FormField
            label="ENTER INVITE CODE (optional)" value={invite} maxLength={LIMITS.inviteMax}
            autoCapitalize="characters" autoCorrect="off" spellCheck={false}
            error={shown} helper="Enter invite code and get up to +30 HVTs!"
            onChange={(e) => { setServerError(''); setField('invite', e.target.value.replace(/[^A-Za-z0-9]/g, '')) }}
            onBlur={() => setTouched(true)}
          />
        </div>
        <div className="wizard-actions">
          <LoadingButton type="submit" loading={loading}>SIGN UP</LoadingButton>
          <LoadingButton variant="outline" onClick={onBack} disabled={loading}>BACK</LoadingButton>
        </div>
      </form>
    </main>
  )
}
