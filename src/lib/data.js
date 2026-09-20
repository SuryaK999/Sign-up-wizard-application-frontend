export const LIMITS = { usernameMin: 6, usernameMax: 20, nameMin: 2, nameMax: 30, inviteMin: 4, inviteMax: 12, minAge: 18, maxPronouns: 3 }
export const STEPS = ['username', 'name', 'age', 'pronouns']
export const PRONOUNS = [
  'he', 'him', 'his', 'she', 'her', 'hers', 'they', 'them', 'theirs',
  'ze', 'zir', 'zirs', 'xe', 'xem', 'xyr', 'xyrs', 'ey', 'em', 'eir', 'eirs', 'fae', 'faer', 'faers',
]
const TAKEN = ['admin', 'extroverts', 'username', 'testuser']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateEmail(v) {
  const t = v.trim()
  if (!t) return 'Email cannot be empty'
  if (t.length > 254) return 'Email is too long'
  if (!EMAIL_RE.test(t)) return 'Enter a valid email address'
  return ''
}

export function validateUsername(v) {
  if (!v.trim()) return 'Username cannot be empty'
  if (/\s/.test(v)) return 'Username cannot contain spaces'
  if (v.length < LIMITS.usernameMin) return `Username must be at least ${LIMITS.usernameMin} characters`
  if (!/^[A-Za-z0-9._]+$/.test(v)) return 'Use only letters, numbers, dots and underscores'
  return ''
}

export function validateName(v) {
  const t = v.trim()
  if (!t) return 'Name cannot be empty'
  if (t.length < LIMITS.nameMin) return `Name must be at least ${LIMITS.nameMin} characters`
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .'_-]*$/u.test(t)) return "Name can only include letters, spaces and . ' _ -"
  return ''
}

export function validateInvite(v) {
  if (!v) return ''
  if (v.length < LIMITS.inviteMin) return `Invite codes have at least ${LIMITS.inviteMin} characters`
  return ''
}

export function parseDob({ dd, mm, yyyy }) {
  if (!dd || !mm || !yyyy) return { error: 'Enter your full date of birth' }
  if (yyyy.length !== 4) return { error: 'Enter a 4-digit year' }
  const d = Number(dd), m = Number(mm), y = Number(yyyy)
  if (y < 1900) return { error: 'Enter a valid year' }
  const date = new Date(y, m - 1, d)
  const real = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
  if (m < 1 || m > 12 || !real) return { error: 'That date does not exist' }
  const today = new Date()
  if (date > today) return { error: 'Date of birth cannot be in the future' }
  let age = today.getFullYear() - y
  const hadBirthday = today.getMonth() > m - 1 || (today.getMonth() === m - 1 && today.getDate() >= d)
  if (!hadBirthday) age -= 1
  if (age > 120) return { error: 'Enter a valid date of birth' }
  return { age }
}

export function stepError(step, form) {
  if (step === 0) return validateUsername(form.username)
  if (step === 1) return validateName(form.name)
  if (step === 2) {
    if (form.age == null) return 'Select your date of birth'
    return form.age < LIMITS.minAge ? 'You must be 18 or older to join.' : ''
  }
  if (step === 3) return form.pronouns.length ? '' : 'Select at least one pronoun'
  return ''
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/* Simulated backend. Demo triggers:
   email ending @fail.test -> send fails | OTP 000000 -> wrong code | any other 6 digits pass
   usernames admin/extroverts/username/testuser -> taken | invite EXPIRED -> inline error | invite NETFAIL -> server error */
export async function simulate(kind, payload = {}) {
  await wait(kind === 'save' ? 450 : 900)
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('You appear to be offline. Check your connection and try again.')
  }
  if (kind === 'sendOtp' && /@fail\.test$/i.test(payload.email)) throw new Error("We couldn't send the code. Please try again.")
  if (kind === 'verifyOtp' && payload.code === '000000') throw new Error('Incorrect code. Please check and try again.')
  if (kind === 'username' && TAKEN.includes(payload.username.toLowerCase())) {
    const e = new Error('That username is already taken')
    e.field = 'username'
    throw e
  }
  if (kind === 'signup') {
    const code = (payload.invite || '').toUpperCase()
    if (code === 'EXPIRED') {
      const e = new Error('This invite code is invalid or expired')
      e.field = 'invite'
      throw e
    }
    if (code === 'NETFAIL') throw new Error('Something went wrong on our side. Please try again.')
  }
  return { ok: true }
}