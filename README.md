# VentureScope Frontend

VentureScope is an AI-powered tech career guidance and analytics platform designed to bridge the gap between academic achievements and employability for students and early-career professionals, specifically within the Ethiopian technology sector.

This repository contains the frontend client, built to be robust, responsive, and scalable.

## Features

- **Personalized Career Recommendations:** Semantic matching to align user profiles with real-world job demands.
- **Adaptive Learning Roadmaps:** Dynamic pathways that identify and help close skill gaps.
- **RAG-Powered AI Chatbot:** A multi-turn conversational advisor grounded in real-world market data for tailored career advice.
- **Automated Resume Generation:** Provides ATS-optimized CV creation based on extracted skills and academic history.
- **Corporate Workforce Analytics:** A B2B module providing data visualizations and talent management for HR managers.
- **Unified Data Integration:** Seamless integration with GitHub for technical portfolios and university portals (via eStudent Chrome Extension) for academic records.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (with `localStorage` persistence)
- **Data Fetching & APIs:** [Axios](https://axios-http.com/)

## Project Structure

The codebase is organized into Next.js Route Groups to allow isolated layouts without affecting URL structures:

- **`app/(landing)/`**: Publicly accessible marketing and informational pages (`/`, `/about`, `/market-insight`).
- **`app/(auth)/`**: Authentication flows (`/sign-in`, `/register`).
- **`app/(dashboard)/`**: Protected application area accessible only to authenticated users (`/dashboard`).

**Core Directories:**
- `components/`: Reusable UI elements (Shadcn UI, global layouts, and dashboard widgets).
- `lib/`: Utility functions and global configurations (e.g., centralized Axios API instance `api.ts`).
- `store/`: Global state management stores defined with Zustand (`useAppStore.ts`).

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd VentureScope/Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.
