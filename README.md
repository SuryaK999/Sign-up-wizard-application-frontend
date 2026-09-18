# nubpack Signup Wizard Replication

Frontend-only React/Vite implementation of the Signup Wizard Replication assessment.

## Exact assessment coverage

- Responsive landing-page mechanism with a clear account-creation CTA.
- Similar Terms & Conditions page and return navigation.
- Four-step progressive disclosure flow:
  1. Email address and terms acknowledgement
  2. Email verification code
  3. Name
  4. Age, pronouns, and optional profile/location details
- Initial email verification gates later profile steps.
- On-blur validation, contextual field errors, whitespace-safe validation, character limits, numeric-only age/code inputs, and an accessible one-time-code field.
- Global success/error toast feedback.
- Simulated submission loading states and duplicate-submit prevention.
- Demo failure path: any verification code other than `123456` shows an error alert.
- Back navigation preserves entered values.
- Dependent country → state/region → city selectors.
- Clear completed-profile success state.
- Poppins typography and a dark, gradient/glass visual language suited to the referenced mobile application while keeping the web experience polished and responsive.

## Run locally

```bash
npm install
npm run dev
```

