# Eazee Bridge — Annexure Sheet (Frontend)

React + Vite frontend for the Eazee Bridge annexure sheet. A loan (e.g. `LN0025`) is shared between
partners; each partner earns interest on their share. This app captures that and shows the payout
per person.

## Scope of this milestone

| Section | Status |
| --- | --- |
| Loan | Done |
| Sharing partners | Done |
| Case fees, Consultancy | Next |
| Supabase backend | Next |

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run lint
```

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

## How the data flows

`useAnnexure()` holds the form state → `utils/calculations.js` derives numbers → `App.jsx` passes
data and callbacks down → section components only render and call callbacks.

## Calculations

- Interest amount = amount × interest % ÷ 100
- Sharing partners "cover the loan" when the sum of partner amounts equals the loan amount
- Payout per person = sum of that person's sharing interest (case fees, consultancy and bridge
  will be added to the same row later)
