export default function Logo({ size = 38 }) {
  return (
    <svg className="logo" height={size} width={size * 1.1} viewBox="0 0 44 40" role="img" aria-label="Extroverts">
      <text x="0" y="38" fontFamily="'Playfair Display','Bodoni MT',Georgia,serif" fontWeight="900" fontSize="50" fill="#fff">E</text>
      <circle cx="39.5" cy="5" r="4.2" fill="#fff" />
    </svg>
  )
}