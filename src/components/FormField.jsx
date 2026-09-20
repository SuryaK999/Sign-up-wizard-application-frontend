import { forwardRef, useId } from 'react'

const FormField = forwardRef(function FormField({ label, error, helper, hideLabel = false, className = '', ...rest }, ref) {
  const id = useId()
  const errId = `${id}-err`
  const helpId = `${id}-help`
  const describedBy = [error && errId, helper && helpId].filter(Boolean).join(' ') || undefined
  return (
    <div className="field">
      <label className={hideLabel ? 'sr-only' : 'field-label'} htmlFor={id}>{label}</label>
      <input id={id} ref={ref} className={`input${error ? ' input-error' : ''} ${className}`.trim()} aria-invalid={!!error} aria-describedby={describedBy} {...rest} />
      {error && <p id={errId} className="field-error" role="alert">{error}</p>}
      {helper && <p id={helpId} className="field-help">{helper}</p>}
    </div>
  )
})

export default FormField