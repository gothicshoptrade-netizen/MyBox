# Product Requirements Document (PRD): MyServersHub

## 1. Overview
MyServersHub is a web-based dashboard allowing users to visualize and manage a fleet of virtual or physical servers. The application emphasizes visual aesthetics using a 2026 Neumorphic design language, providing a tactical, physical feel combined with modern screen capabilities.

## 2. Goals & Objectives
- Provide a responsive, high-end "Neumorphic" UI supporting both light and dark color schemes.
- Enable Google Authentication for single sign-on.
- Render server vital stats (CPU, RAM, Status, IP).

## 3. Scope
- **Frontend**: Next.js App Router (TypeScript, Tailwind CSS v4, Motion).
- **Backend/Auth**: Firebase Authentication (Google Auth), Firestore (Data).
- **Design System**: Soft UI / Neumorphism custom CSS utilities with robust dark mode contrast.

## 4. Key Workflows
- **Onboarding**: User lands on hero unauthenticated. Clicks "Sign In with Google" and is redirected to the dashboard.
- **Dashboard**: Authenticated users view a grid of their servers. Each server card presents interactive, "squishy" neumorphic buttons for power administration.

## 5. Security Restrictions
- Firestore rules must securely lock server data so users only see their own instances (`userId == request.auth.uid`).
