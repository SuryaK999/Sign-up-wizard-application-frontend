Here’s a polished README you can use for this repository:

```md
# Extroverts — Sign-up Wizard Frontend

A modern React + Vite frontend for a multi-step onboarding and sign-up experience. This app simulates a social/community signup flow with authentication, OTP verification, profile creation, invite validation, location selection, and a completion state.

## Overview

Extroverts is a demo application designed to showcase a polished sign-up wizard with a strong visual identity and interaction flow. It guides users through:

- Landing screen with Google and email sign-up options
- Email entry and email validation
- OTP verification step
- Profile setup with username, name, age, and pronouns
- Invite code validation
- Location selection
- Final success screen
- Guest browsing mode

The app uses simulated backend behavior to mimic real-world validation and error handling without needing a backend service.

## Features

- Responsive, single-page signup flow
- Google account chooser modal
- Email-based registration flow
- 6-digit OTP verification
- Real-time validation for user inputs
- Age gating and pronoun selection
- Invite code validation and simulated failure states
- Final onboarding completion screen
- Guest browsing placeholder page
- Toast notifications for success and error feedback
- Smooth step transitions and animated UI

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- ESLint

## Project Structure

```bash
.
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── EmailStep.jsx
│   │   ├── LandingPage.jsx
│   │   ├── SignupWizard.jsx
│   │   ├── VerificationStep.jsx
│   │   ├── InviteStep.jsx
│   │   ├── LocationStep.jsx
│   │   ├── SuccessState.jsx
│   │   ├── TermsPage.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingButton.jsx
│   │   ├── Toast.jsx
│   │   └── ...
│   ├── lib/
│   │   └── data.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   └── ...
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or later recommended)
- npm

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

This starts the Vite development server. Open the URL shown in the terminal to view the app in the browser.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint the project

```bash
npm run lint
```

## Demo Behavior

This project includes simulated backend logic for demonstration purposes. Some examples:

- Invalid email domains like `@fail.test` trigger a send failure
- OTP `000000` is treated as an incorrect verification code
- Reserved usernames such as `admin`, `extroverts`, `username`, and `testuser` are rejected
- Invite code `EXPIRED` shows an invalid/expired invite error
- Invite code `NETFAIL` simulates a server-side failure

This makes the app useful for UX validation and frontend flow testing without requiring a real backend.

## Screens and Flow

1. Landing page
   - Continue with Google
   - Continue with email
   - Browse as guest

2. Email step
   - Enter an email address
   - Validate input and send OTP

3. OTP verification
   - Enter the 6-digit code
   - Resend option with cooldown timer

4. Profile setup
   - Username
   - Full name
   - Date of birth
   - Pronouns

5. Invite step
   - Optional invite code validation

6. Location step
   - Select a location

7. Completion state
   - Confirmation screen with success message

## Notes

This is a frontend-only demo project. It is designed to mimic realistic user interactions and validation patterns but does not include a production backend or database.

## License

This project currently does not include a license file. If you want, you can add one based on your preferred open-source license.
