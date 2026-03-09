# FinShot: Personal Finance Snapshot 📊

## Overview
FinShot is a modern personal finance tracking application designed to help users manage their income, expenses, and budgets with an intuitive user interface. Built with React and TypeScript, it offers a real-time snapshot of your financial health, leveraging Zustand for efficient state management and Recharts for dynamic data visualization.

## Features
-   **Intuitive Dashboard**: Get a comprehensive overview of your financial status with income, expenses, net balance, and savings rate.
-   **Detailed Transaction Management**: Easily add, view, filter, and delete individual income and expense transactions.
-   **Category-Based Budgeting**: Set and track monthly spending limits for various categories (e.g., Housing, Food, Transport, Entertainment).
-   **Financial Visualizations**: Interactive area charts show income vs. expenses over six months, while a pie chart breaks down monthly spending by category.
-   **Persistent State Management**: Utilizes Zustand with local storage to ensure your financial data is saved across sessions.
-   **Modern User Interface**: A responsive and clean design powered by Tailwind CSS for an optimal experience across devices.

## Getting Started

Follow these steps to set up and run FinShot on your local machine.

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Lansa-18/personal-finance-snapshot.git
    ```
2.  **Navigate to Project Directory**:
    ```bash
    cd personal-finance-snapshot
    ```
3.  **Install Dependencies**:
    Using pnpm:
    ```bash
    pnpm install
    ```
    Or using npm:
    ```bash
    npm install
    ```
4.  **Start the Development Server**:
    Using pnpm:
    ```bash
    pnpm dev
    ```
    Or using npm:
    ```bash
    npm run dev
    ```
    The application will typically open in your browser at `http://localhost:5173`.

## Usage
Upon launching FinShot, you'll be directed to the **Dashboard**, offering a high-level view of your finances.

### Dashboard
The Dashboard displays:
-   Summary cards for total income, total expenses, net balance, and savings rate for the selected month.
-   An area chart visualizing your income versus expenses over the last six months.
-   A pie chart illustrating your expense breakdown by category for the selected month.
-   A list of your most recent transactions.
-   Use the month selector to view data for different periods.

### Adding Transactions
1.  Click the **`+ Add Transaction`** button located on the Dashboard or Transactions page.
2.  A modal will appear where you can input:
    -   **Type**: Choose between "Expense" or "Income".
    -   **Amount**: Enter the numerical value of the transaction.
    -   **Category**: Select a relevant category (for expenses). Income defaults to "Income".
    -   **Description**: A brief note about the transaction.
    -   **Date**: The date the transaction occurred.
3.  Click **`Add Transaction`** to save.

### Transactions Page
The **Transactions** page provides a comprehensive list of all your recorded transactions.
-   You can **filter** transactions by month, category, and type (income/expense).
-   Each transaction displays its description, category, date, and amount.
-   To **delete** a transaction, click the trash icon next to it. You will be prompted to confirm.

### Budgets Page
On the **Budgets** page, you can set and monitor your spending limits.
-   An **Overview Card** shows your total spending against a global budget limit for the selected month. You can set or clear this global limit.
-   **Budget Cards** for each expense category (Housing, Food, Transport, Entertainment) display your actual spending against your set limit.
-   Click the **`Pencil`** icon on a budget card to edit its limit. If no limit is set, click **`Set limit`** or **`+ Set a budget limit`**.
-   The progress bar visually indicates how close you are to reaching or exceeding your budget.

## Technologies Used
| Technology         | Description                                        | Link                                                         |
| :----------------- | :------------------------------------------------- | :----------------------------------------------------------- |
| **React**          | A JavaScript library for building user interfaces. | [React.dev](https://react.dev/)                              |
| **TypeScript**     | A strongly typed superset of JavaScript.           | [TypeScriptLang.org](https://www.typescriptlang.org/)        |
| **Vite**           | A fast build tool that provides a lightning-fast development experience for modern web projects. | [Vitejs.dev](https://vitejs.dev/)                            |
| **Tailwind CSS**   | A utility-first CSS framework for rapid UI development. | [TailwindCSS.com](https://tailwindcss.com/)                  |
| **Zustand**        | A small, fast, and scalable bear-necessities state-management solution. | [Zustand-Docs.pmnd.rs](https://docs.pmnd.rs/zustand/getting-started/introduction) |
| **React Router DOM** | Declarative routing for React.js.                | [ReactRouter.com](https://reactrouter.com/en/main)           |
| **Recharts**       | A composable charting library built on React components. | [Recharts.org](https://recharts.org/en-US/)                  |
| **Lucide React**   | A collection of beautiful, human-friendly SVG icons. | [Lucide.dev](https://lucide.dev/icons/)                      |

---

## Design Decisions

**Stack choice — React 19 + TypeScript + Zustand + Vite**
React gave the component model needed for a UI this interactive. TypeScript was non-negotiable for a data-heavy app — having typed `Transaction`, `Budget`, and `Category` models caught mistakes at compile time rather than runtime. Zustand was chosen over Redux or Context because it requires almost no boilerplate and its `persist` middleware handles localStorage in a single line. Vite keeps the dev loop instant.

**No backend**
The brief explicitly ruled one out. All state lives in a single Zustand store keyed `"finance-tracker"` in localStorage. Seed data ships on first load so the app is never empty on arrival.

**Category system**
Five categories felt right: four expense buckets (Housing, Food, Transport, Entertainment) plus one Income type. Each carries a hex color and emoji so they're visually distinguishable across the pie chart, progress bars, badges, and budget cards without needing a legend every time.

**Dual budget model**
Users can set per-category limits *and* a global monthly cap. The global budget overrides the category sum in the overview — useful when someone wants a single number to stay under without micromanaging each category.

**Visualization choices**
- A 6-month area chart for trend: it answers "am I spending more or less than last month?" at a glance.
- A donut pie chart for the current month: it answers "where is my money going?" without needing to scan a table.
- Color-coded progress bars on budget cards (green → amber → red) communicate urgency without requiring the user to do mental arithmetic.

**Inline budget editing**
Clicking a pencil icon to edit a limit — with Enter to confirm and Escape to cancel — keeps the Budgets page clean. A dedicated form or dialog would have added friction for what is fundamentally a single number change.

---

## What I'd Improve With More Time

- **Edit transactions** — currently you can only add or delete; an inline edit mode (similar to budget limits) would round out CRUD.
- **Smarter overspend warning** — the budget alert fires when adding a transaction but doesn't re-evaluate if you later delete spending. A real-time indicator on the dashboard would be more reliable.
- **Currency setting** — the currency is hardcoded to NGN; a user-configurable locale/currency preference would make the app more broadly useful.
- **Animated chart transitions** — Recharts supports enter animations; wiring those up would make the data feel more alive when switching months.
- **Keyboard accessibility** — focus trapping in the modal and full keyboard navigation through the transaction table are missing.
- **Undo delete** — a brief toast with an "Undo" action (using a short timeout before committing the deletion) would be safer than a browser `confirm` dialog.
- **Export** — a simple CSV download of filtered transactions would make the data useful outside the app.

---

## Challenges

Coming up with intuitive designs that prioritise user experience was a bit challenging, translating raw financial data into layouts and interactions that feel natural (rather than just functional) required several iterations, particularly around the budget cards, chart placement, and the add-transaction flow.

---

## Time Spent

Approximately **52 hours** total.

---

## Author
-   **Mapelujo Abdulkareem**
    -   LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/lancer18)
    -   X (formerly Twitter): [Your X Profile](https://x.com/Lansa_18)

---

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%23000000.svg?style=for-the-badge&logo=react&logoColor=white)
![Recharts](https://img.shields.io/badge/recharts-F4511E?style=for-the-badge&logo=recharts&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)