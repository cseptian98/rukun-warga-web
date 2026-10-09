# KSMDash - Water System Manager

A modern, responsive React dashboard built to help communities and neighborhoods manage their local water system usage, billing, and payment histories efficiently.

## 🚀 Features

- **Neighbor Directory:** Easily add and search for neighbors/households in the system.
- **Automated Billing:** Record water volume readings and automatically calculate costs based on a tiered pricing system.
- **Payment Tracking:** Toggle payment statuses (Paid/Unpaid) to keep track of outstanding dues.
- **Modern UI:** Built with a glassmorphism aesthetic, smooth Framer Motion transitions, and beautiful Poppins typography.
- **Printable Reports:** Seamlessly generate clean, print-friendly monthly activity reports.
- **Local Persistence:** Data is securely saved to your browser's Local Storage so you never lose your session.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** [Fontsource Poppins](https://fontsource.org/fonts/poppins)

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository and navigate to the project folder:
   ```bash
   cd KSMDashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## 🖨️ Printing Reports

KSMDash includes a dedicated `@media print` layout. Simply click the **Report** button in the top right corner of the dashboard, or press `Ctrl + P` (or `Cmd + P` on Mac) to generate a clean, stripped-down summary of the current month's usage and outstanding balances.
