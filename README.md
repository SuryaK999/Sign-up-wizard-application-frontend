# Extroverts — Sign-up Wizard Frontend

A modern React + Vite frontend that demonstrates a multi-step onboarding and sign-up experience. This is a frontend-only demo that simulates backend responses for validation and error handling so you can test UX flows without a server.

## Overview

Extroverts is a demo application showcasing a polished sign-up wizard with a focused visual identity and interaction flow. It guides users through:

- Landing screen with Google and email sign-up options
- Email entry and validation
- OTP verification
- Profile creation (username, full name, date of birth, pronouns)
- Optional invite-code validation
- Location selection
- Final success/completion screen
- Guest browsing mode

The app uses simulated backend behavior to mimic real-world validation and failure cases.

## Features

- Responsive, single-page signup flow
- Google account chooser modal
- Email-based registration and 6-digit OTP verification
- Real-time validation for user inputs
- Age gating and pronoun selection
- Invite code validation with simulated error states
- Guest browsing placeholder
- Toast notifications for success and error feedback
- Smooth step transitions and animated UI elements

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

This starts the Vite development server. Open the URL shown in the terminal to view the app.

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

The project simulates backend logic to demonstrate validation and error states. Examples:

- Invalid email domains like `@fail.test` trigger a send failure
- OTP `000000` is treated as an incorrect verification code
- Reserved usernames such as `admin`, `extroverts`, `username`, and `testuser` are rejected
- Invite code `EXPIRED` shows an invalid/expired invite error
- Invite code `NETFAIL` simulates a server-side failure

These simulated cases make the app useful for UX validation and frontend flow testing without a real backend.

## Screens and Flow

1. Landing page
   - Continue with Google
   - Continue with email
   - Browse as guest

2. Email step
   - Enter email address
   - Validate input and send OTP

3. OTP verification
   - Enter 6-digit code
   - Resend option with cooldown timer

4. Profile setup
   - Username
   - Full name
   - Date of birth
   - Pronouns

5. Invite step (optional)
   - Enter and validate invite code

6. Location step
   - Select a location

7. Completion state
   - Confirmation screen with success message

## Notes

This is a frontend-only demo designed to mimic realistic user interactions and validation patterns but does not include a production backend or database. Use it for prototyping, UX testing, and design validation.

## License

This repository does not include a license file. If you want to add one, create a LICENSE file with your preferred open-source license.
