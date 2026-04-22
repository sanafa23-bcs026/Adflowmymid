live DEMO:
https://adflowmymid-5mf3.vercel.app/

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/44295d2a-adc5-47a6-8a3f-e2f8792676dc" /># Adflowmymid

A Next.js web application for managing and displaying advertisements, built with Supabase as the backend database and Tailwind CSS for styling.


---
screenshots 
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/9a4bc31c-a5fb-4440-836a-7e078bedfea5" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/63c55fe8-0fb4-42b5-939f-1cd47246094a" />

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/44dd2714-4d28-423b-8343-60db77c20bda" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/078cecc5-5c0e-4dd0-bed9-76a8caa8a2b0" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/6f27755c-295e-40ef-ad5b-c1b9e7f194b1" />

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/651fe671-2c48-4403-a08f-183dad7ce4ea" />

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/b72e705c-7082-4793-bc7c-d70c7dee0993" />
<img width="1366" height="768" alt="Screenshot (380)" src="https://github.com/user-attachments/assets/3835440c-94b5-4c30-8aa5-a72197f9d124" />

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/0d1e1e6d-4518-4ed1-9389-6bf9d1859f65" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/6ead9298-63a9-4bbc-9576-31c665ec43ac" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/3e78c5b1-1459-4083-8262-ce72ca99a245" />

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/7cfb91c6-a585-4f98-a63c-b9854fc0d1c8" />

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/18d1bbac-d611-4557-b57a-ab4d385d3f85" />

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.3.1 | React Framework (App Router) |
| React | 19.2.0 | UI Library |
| Supabase | 2.101.1 | Database & Authentication |
| Tailwind CSS | 4.2.2 | Styling |
| PostCSS | 8.5.3 | CSS Processing |

---

## Project Structure

```
Adflowmymid/
├── app/
│   ├── layout.js               # Root layout (fonts, global styles)
│   ├── page.js                 # Home page
│   ├── packages/
│   │   └── page.js             # Packages listing page (fetches from Supabase)
│   └── api/
│       └── payments/
│           └── route.js        # API route for payment handling
├── lib/
│   ├── supabase.js             # Supabase client (server-side)
│   └── supabaseClient.js       # Supabase client (client-side export)
├── components/                 # Reusable UI components
├── public/                     # Static assets
├── .env.local                  # Environment variables (not pushed to GitHub)
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json                # Project dependencies
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sanafa23-bcs026/Adflowmymid.git
cd Adflowmymid
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Get these values from: **Supabase Dashboard → Your Project → Settings → API**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supabase Setup

This project uses Supabase as its backend. The following are required:

- A Supabase project with the necessary tables (ads, packages, payments)
- Row Level Security (RLS) policies configured as needed
- API keys added to `.env.local` locally and to Vercel Environment Variables for deployment

### lib/supabaseClient.js

This file must exist in the `lib/` folder:

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## Deployment (Vercel)

### Step 1 — Add Environment Variables

Go to: **Vercel Dashboard → Project → Settings → Environment Variables**

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your supabase anon key |

### Step 2 — Deploy

```bash
git add .
git commit -m "deploy"
git push origin main
```

Vercel will automatically build and deploy on every push to `main`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

---

## Known Issues & Fixes

### Error: supabaseUrl is required
**Cause:** Environment variables not set in Vercel.  
**Fix:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel → Settings → Environment Variables.

### Module not found: Can't resolve '../../../lib/supabaseClient'
**Cause:** `lib/supabaseClient.js` file is missing from the project.  
**Fix:** Create `lib/supabaseClient.js` with the Supabase client code shown above.

### Multiple lockfiles warning
**Cause:** Two `package-lock.json` files detected (one in root, one in project folder).  
**Fix:** Delete the extra `package-lock.json` from the Users root folder.

---

## Security Notes

- Never push `.env.local` to GitHub
- `.env.local` is already listed in `.gitignore`
- Regenerate your Supabase anon key if it was accidentally exposed publicly

---

## License

This project is private and intended for academic/personal use.

