import Logo from './Logo.jsx'

export default function Header({ right, center = false }) {
  return (
    <header className={`hdr${center ? ' hdr-center' : ''}`}>
      <Logo />
      {right && <span className="hdr-right">{right}</span>}
    </header>
  )
}