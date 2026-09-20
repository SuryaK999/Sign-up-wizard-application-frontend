import { useState } from 'react'

export default function Logo({ size = 38 }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <svg className="logo" width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Extroverts">
        <text x="1" y="35" fontFamily="'Playfair Display', Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="42" fill="#fff">E</text>
        <circle cx="35" cy="6" r="4.5" fill="#fff" />
      </svg>
    )
  }
  return <img className="logo" src="/assets/logo.png" alt="Extroverts" height={size} onError={() => setFailed(true)} />
}