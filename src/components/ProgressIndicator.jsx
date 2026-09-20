export default function ProgressIndicator({ step, total = 4 }) {
  return (
    <div className="progress" role="progressbar" aria-label="Sign-up progress" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1} aria-valuetext={`Step ${step + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => <span key={i} className={i <= step ? 'on' : ''} />)}
    </div>
  )
}