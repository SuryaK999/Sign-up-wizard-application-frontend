export default function LoadingButton({ loading = false, disabled = false, variant = 'solid', type = 'button', className = '', onClick, children, ...rest }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={(e) => { if (loading || disabled) { e.preventDefault(); return } onClick?.(e) }}
      {...rest}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      <span className={loading ? 'btn-label is-loading' : 'btn-label'}>{children}</span>
    </button>
  )
}