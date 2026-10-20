# Eazee Bridge

Eazee Bridge is a loan sheet web app. One loan (for example `LN0025`) is shared between several partners. The sheet records the interest each partner earns, the case fees and the consultancy fees, and shows the totals at a glance. The **Save loan** button stores the loan in a Supabase (PostgreSQL) database.

## About the project

The page has four sections and four summary tiles.

| Section | What it holds |
| --- | --- |
<<<<<<< HEAD
| Loan | Loan number, Principal Amount (₹), Interest % and the calculated interest amount |
| Principal sharing partners | The partners, the amount each one shares and their interest %, with a bar that shows how much of the principal is shared |
| Case fees | A fee assigned to a person |
| Consultancy | One row per consultant: rate % and fee (Principal Amount × rate %), with the total |
=======
| Loan | Done |
| Sharing partners | Done |
| Case fees, Consultancy | Next |
| Supabase backend | Next |
>>>>>>> origin/main

The tiles are **Loan interest**, **Principal shared**, **Sharing interest** and **Bridge split**. The page opens with a sample loan so every number can be seen straight away.

**Tech stack:** React 19, Vite 8, JavaScript, plain CSS, Supabase (`@supabase/supabase-js`) and oxlint.

## Prerequisites

- **Node.js 20.19 or newer, or 22.12 or newer.** Check with `node -v`. npm comes with Node.js.
- **Git**, to clone the repository.
- **A free Supabase account** at [supabase.com](https://supabase.com). It is needed only for **Save loan**; the sheet opens and calculates without it.

## Installation and local setup

1. Clone the repository and open the project folder. Replace `<repository-url>` with the link of this repository and `<project-folder>` with the folder that Git creates.

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install the dependencies.

   ```bash
   npm install
   ```

3. Create your private `.env` file from the template.

   ```bash
   # macOS, Linux, Git Bash
   cp .env.example .env

   # Windows PowerShell
   Copy-Item .env.example .env

   # Windows Command Prompt
   copy .env.example .env
   ```

4. Start the app.

   ```bash
   npm run dev
   ```

   Open <http://localhost:5173>. The sheet works now. Save loan needs the database, so continue with the next section.

## Connect Supabase (needed only for Save loan)

1. In the [Supabase dashboard](https://supabase.com/dashboard) click **New project**, name it `eazee-bridge`, and wait until it is ready.
2. Open **SQL Editor > New query**, paste this script and click **Run**. It creates the `loans` table.

   ```sql
   create table public.loans (
     id          uuid primary key default gen_random_uuid(),
     loan_no     text not null unique check (length(btrim(loan_no)) > 0),
     principal   numeric(15, 2) not null check (principal >= 0),
     loan_rate   numeric(6, 3) not null check (loan_rate >= 0),
     created_at  timestamptz not null default now(),
     updated_at  timestamptz not null default now()
   );

   create function public.set_updated_at()
   returns trigger
   language plpgsql
   set search_path = ''
   as $$
   begin
     new.updated_at = now();
     return new;
   end;
   $$;

   create trigger loans_set_updated_at
   before update on public.loans
   for each row execute function public.set_updated_at();

   grant select, insert, update on public.loans to anon;

   alter table public.loans enable row level security;

   create policy "demo: anon can read loans"
     on public.loans for select to anon
     using (true);

   create policy "demo: anon can insert loans"
     on public.loans for insert to anon
     with check (true);

   create policy "demo: anon can update loans"
     on public.loans for update to anon
     using (true)
     with check (true);
   ```

3. Click **Connect** at the top of the dashboard and copy the **Project URL** and the **Publishable key** (it starts with `sb_publishable_`).
4. Open `.env` and type the two values after the `=` signs, with no quotes and no spaces.

   ```text
   VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
   ```

5. Stop the app (Ctrl+C) and start it again with `npm run dev`. Vite reads `.env` only when it starts.
6. Click **Save loan**. A green line says `Loan LN0025 saved to the database.` and the row appears in **Table Editor > loans**.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server at <http://localhost:5173> |
| `npm run build` | Creates the production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Checks the code with oxlint |

## Project structure

```
src/
├── main.jsx                      # entry point, loads global CSS and <App />
├── App.jsx                       # page layout: wires the hook to the sections
├── components/
│   ├── common/                   # reusable pieces (Field, PersonSelect, Pill)
│   ├── layout/                   # StatusBanner
│   ├── loan/                     # LoanSection
│   ├── sharing/                  # SharingPartnersSection, PartnerRow, AllocationBar
│   └── payout/                   # PayoutSection
├── hooks/useAnnexure.js          # ALL state + actions (add/remove/update/save/reset)
├── utils/
│   ├── money.js                  # toNumber, formatINR, isSameAmount
│   └── calculations.js           # interest, loan summary, payout rows
├── constants/people.js           # people list + bar colours
├── data/sampleAnnexure.js        # LN0025 sample data
└── styles/                       # variables.css (tokens) + global.css (base)
```

## Keep your keys private

- `.env` is listed in `.gitignore`, so it is never committed. Only `.env.example`, which holds placeholders, is committed.
- Put only the **Publishable key** in `.env`. Never use the secret key (`sb_secret_...`) in this project.
- The database policies above are open demo policies and there is no login yet, so use sample data only.