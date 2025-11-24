
# AI Code Review App

![Next.js](https://img.shields.io/badge/Next.js-13-blue?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-blue?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

This is a **Next.js** project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) that provides an **AI-powered code review simulation**. Users can upload code, analyze code quality, view metrics, and see detailed issues and suggestions.

---

## Features

- Upload and analyze code in multiple languages.
- **AI Code Analysis Simulation**:
  - Detects `console.log`, `var` usage, loose equality (`==`), `eval()`, long lines, and missing async error handling.
- View code metrics:
  - Complexity, Maintainability, Readability, Security.
- View issues and suggestions:
  - Highlights critical, high, medium, and low-severity issues.
- Review management:
  - Save, view, and delete code reviews locally (using `localStorage`).
- Responsive and modern UI with TailwindCSS.
- Hydration-safe and compatible with **Next.js 13+**.

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, TailwindCSS, Lucide React Icons
- **UI Components:** Custom UI components (`Card`, `Button`, `Badge`, `Progress`, `Separator`)
- **State Management:** Local storage
- **Notifications:** Sonner

---

## Getting Started

First, run the development server:

\`\`\`bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

You can start editing the pages in the \`app/\` directory. For example, \`app/page.tsx\` is the main page, and \`src/dashboard/ReviewDetail.tsx\` shows detailed code review results. The app supports hot-reloading, so changes update automatically.

---

## Usage

1. Upload your code file or paste your code.
2. Click **Analyze** to generate a code review.
3. View:
   - **Overall Score**
   - **Code Metrics** (Complexity, Maintainability, Readability, Security)
   - **Issues Found** with severity and suggestions
   - **Original Code** with formatting
4. Use the **Back to History** button to return to previous reviews.
5. Use **Delete Review** to remove a review.

**Important:** Ensure proper HTML structure (no `<div>` inside `<p>`) to prevent Next.js hydration errors.

---

## Project Structure

\`\`\`
src/
  components/
    ui/        # Custom UI components (Card, Button, Badge, etc.)
  dashboard/
    ReviewDetail.tsx  # Review details page
    Dashboard.tsx     # Main dashboard with review history
  lib/
    code-review.ts    # CodeReview interfaces and storage functions
    auth.ts           # Mock current user
  app/
    page.tsx          # Home page
\`\`\`

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [TailwindCSS Docs](https://tailwindcss.com/docs) - styling and utilities.
- [Sonner Notifications](https://github.com/sonner-notifications/sonner) - toast notifications.

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Contributing

1. Fork the repository
2. Create a new branch: \`git checkout -b feature/your-feature\`
3. Make your changes
4. Commit your work: \`git commit -m 'Add new feature'\`
5. Push to your branch: \`git push origin feature/your-feature\`
6. Open a Pull Request

---

## License

MIT License © [Your Name]

---


