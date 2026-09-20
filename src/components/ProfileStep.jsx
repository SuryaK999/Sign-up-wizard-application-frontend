import { useEffect, useId, useRef, useState } from 'react'
import FormField from './FormField.jsx'
import BottomSheet from './BottomSheet.jsx'
import LoadingButton from './LoadingButton.jsx'
import { LIMITS, PRONOUNS, parseDob } from '../lib/data.js'

const EMPTY_DOB = { dd: '', mm: '', yyyy: '' }
const DOB_FIELDS = [
  { key: 'dd', ph: 'DD', max: 2, label: 'Day', ac: 'bday-day' },
  { key: 'mm', ph: 'MM', max: 2, label: 'Month', ac: 'bday-month' },
  { key: 'yyyy', ph: 'YYYY', max: 4, label: 'Year', ac: 'bday-year' },
]

function PickerField({ label, value, error, helper, onOpen }) {
  const id = useId()
  return (
    <div className="field">
      <span className="field-label" id={`${id}-l`}>{label}</span>
      <button type="button" id={id} className={`input picker${error ? ' input-error' : ''}`} aria-haspopup="dialog" aria-labelledby={`${id}-l ${id}`} aria-invalid={!!error} onClick={onOpen}>
        {value}
      </button>
      {error && <p className="field-error" role="alert">{error}</p>}
      {helper && <p className="field-help">{helper}</p>}
    </div>
  )
}

function DobSheet({ open, initial, onClose, onSave, onUnderage }) {
  const [v, setV] = useState(EMPTY_DOB)
  const [error, setError] = useState('')
  const [r0, r1, r2] = [useRef(null), useRef(null), useRef(null)]
  const refs = [r0, r1, r2]

  useEffect(() => { if (open) { setV(initial || EMPTY_DOB); setError('') } }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    const r = parseDob(v)
    if (r.error) { setError(r.error); return }
    if (r.age < LIMITS.minAge) { setV(EMPTY_DOB); onUnderage(); return } // minors' DOB is never kept
    onSave({ dob: v, age: r.age })
  }
  const update = (i) => (e) => {
    const f = DOB_FIELDS[i]
    const val = e.target.value.replace(/\D/g, '').slice(0, f.max)
    setV((p) => ({ ...p, [f.key]: val }))
    setError('')
    if (val.length === f.max && i < 2) refs[i + 1].current?.focus()
  }
  const keyDown = (i) => (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submit() }
    else if (e.key === 'Backspace' && !v[DOB_FIELDS[i].key] && i > 0) refs[i - 1].current?.focus()
  }

  return (
    <BottomSheet open={open} title="DATE OF BIRTH" onClose={onClose} footer={<LoadingButton onClick={submit}>PROCEED</LoadingButton>}>
      <div className="dob-row">
        {DOB_FIELDS.map((f, i) => (
          <input
            key={f.key} ref={refs[i]} autoFocus={i === 0}
            className={`input dob-input${error ? ' input-error' : ''}`}
            inputMode="numeric" placeholder={f.ph} maxLength={f.max} autoComplete={f.ac}
            aria-label={f.label} aria-invalid={!!error}
            value={v[f.key]} onChange={update(i)} onKeyDown={keyDown(i)}
          />
        ))}
      </div>
      {error && <p className="field-error dob-error" role="alert">{error}</p>}
    </BottomSheet>
  )
}

function PronounSheet({ open, selected, onClose, onSave }) {
  const [sel, setSel] = useState(selected)
  const [msg, setMsg] = useState('')
  useEffect(() => { if (open) { setSel(selected); setMsg('') } }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (p) => {
    if (sel.includes(p)) { setSel(sel.filter((x) => x !== p)); setMsg(''); return }
    if (sel.length >= LIMITS.maxPronouns) { setMsg(`You can select up to ${LIMITS.maxPronouns} pronouns.`); return }
    setSel([...sel, p]); setMsg('')
  }

  return (
    <BottomSheet open={open} title="SELECT PRONOUNS" onClose={onClose} footer={<LoadingButton onClick={() => onSave(sel)} disabled={!sel.length}>DONE</LoadingButton>}>
      <p className="pron-sub">Select upto {LIMITS.maxPronouns}</p>
      {msg && <p className="field-error" role="alert">{msg}</p>}
      <ul className="pron-list">
        {PRONOUNS.map((p) => (
          <li key={p}>
            <label className="check">
              <input type="checkbox" checked={sel.includes(p)} onChange={() => toggle(p)} />
              <span className="box" aria-hidden="true" />
              <span>{p}</span>
            </label>
          </li>
        ))}
      </ul>
    </BottomSheet>
  )
}

export default function ProfileStep({ step, form, setField, error, onBlur, inputRef }) {
  const [dobOpen, setDobOpen] = useState(false)
  const [underOpen, setUnderOpen] = useState(false)
  const [pronOpen, setPronOpen] = useState(false)
  const [ageMsg, setAgeMsg] = useState('')

  if (step === 0) {
    return (
      <>
        <h1 className="title">Create a username that fits your vibe!</h1>
        <FormField
          ref={inputRef} label="USERNAME" value={form.username} maxLength={LIMITS.usernameMax}
          autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false}
          error={error} helper="All your Superlatives and Invites will come your way with this name, so make it unforgettable!"
          onChange={(e) => setField('username', e.target.value.replace(/\s/g, ''))} onBlur={onBlur}
        />
      </>
    )
  }

  if (step === 1) {
    return (
      <>
        <h1 className="title">{'"Name, please, for the party check!"'}</h1>
        <FormField
          ref={inputRef} label="NAME" value={form.name} maxLength={LIMITS.nameMax} autoComplete="name"
          error={error} helper="This is the name shown as on members and requests. Cannot be changed later."
          onChange={(e) => setField('name', e.target.value)} onBlur={onBlur}
        />
      </>
    )
  }

  if (step === 2) {
    const dismissUnder = () => {
      setUnderOpen(false)
      setField('dob', null); setField('age', null)
      setAgeMsg('You must be 18 or older to join.')
      onBlur()
    }
    return (
      <>
        <h1 className="title">How many years have you been partying?</h1>
        <PickerField
          label="AGE" value={form.age ?? ''} error={ageMsg || error}
          helper="We need your age to verify you're eligible and help others know who they’re connecting with."
          onOpen={() => setDobOpen(true)}
        />
        <DobSheet
          open={dobOpen} initial={form.dob}
          onClose={() => { setDobOpen(false); onBlur() }}
          onSave={({ dob, age }) => { setField('dob', dob); setField('age', age); setAgeMsg(''); setDobOpen(false); onBlur() }}
          onUnderage={() => { setDobOpen(false); setUnderOpen(true) }}
        />
        <BottomSheet open={underOpen} title="SORRY FOR THE TROUBLE :(" onClose={dismissUnder} footer={<LoadingButton onClick={dismissUnder}>I UNDERSTAND</LoadingButton>}>
          <p className="sheet-copy">
            To ensure a safe and comfortable experience for everyone, I only allow users of age 18 or older. While this isn't a dating app, I follow this guideline to create a secure environment for everyone in a social space- with working towards lifting this limitation.
          </p>
        </BottomSheet>
      </>
    )
  }

  return (
    <>
      <h1 className="title">Which pronouns feel right for you?</h1>
      <PickerField label="PRONOUNS" value={form.pronouns.join(' / ')} error={error} helper="Select the pronouns that feel right for you." onOpen={() => setPronOpen(true)} />
      <PronounSheet
        open={pronOpen} selected={form.pronouns}
        onClose={() => { setPronOpen(false); onBlur() }}
        onSave={(list) => { setField('pronouns', list); setPronOpen(false); onBlur() }}
      />
    </>
  )
}
