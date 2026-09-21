# 🎨 Typography & Design System Specification - The Cabbage Mail

## 1. UI Framework: Shadcn UI + Tailwind CSS

**The Cabbage Mail** utilizes **Shadcn UI** paired with **Tailwind CSS** to build a modern, high-contrast, ultra-accessible, and responsive user interface.

- **Design Tone**: Clean, SaaS-grade, high-productivity, sleek dark-mode native interface.
- **Component Primitives**: Radix UI primitives underlying Shadcn UI components (Dialogs, Dropdowns, Tooltips, Tabs, Badges, Selects).
- **Icons**: Lucide React (`lucide-react`).

---

## 2. Typography Standards & Font System

### 2.1 Font Families

| Role | Font Family | Fallbacks | Usage |
|---|---|---|---|
| **Headings & Titles** | `Plus Jakarta Sans` | `system-ui, sans-serif` | Page titles, section headings, high-impact stats |
| **Body & UI Controls** | `Inter` | `-apple-system, BlinkMacSystemFont, sans-serif` | Body copy, table cells, form labels, buttons |
| **Monospace / Code** | `JetBrains Mono` | `ui-monospace, SFMono-Regular, monospace` | Merge tags (`{{first_name}}`), API tokens, code snippets |

Google Fonts Import snippet:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
```

---

### 2.2 Typography Scale & Hierarchy

| Scale Level | Font Size (rem / px) | Line Height | Weight | Letter Spacing | Tailwind Class Equivalent | Best Used For |
|---|---|---|---|---|---|---|
| **Display / Page H1** | `2.25rem` (36px) | `2.5rem` (40px) | `700` (Bold) | `-0.025em` | `text-3xl font-extrabold tracking-tight` | Dashboard main title, Client workspace header |
| **Section H2** | `1.5rem` (24px) | `2.0rem` (32px) | `700` (Bold) | `-0.02em` | `text-2xl font-bold tracking-tight` | Section headers, Campaign Composer title |
| **Card / Header H3** | `1.125rem` (18px) | `1.5rem` (24px) | `600` (SemiBold) | `-0.01em` | `text-lg font-semibold` | Card titles, Modal headers |
| **Subheading H4** | `1.0rem` (16px) | `1.5rem` (24px) | `600` (SemiBold) | `normal` | `text-base font-semibold` | Sub-sections, List headers |
| **Body (Default)** | `0.875rem` (14px) | `1.25rem` (20px) | `400` (Regular) | `normal` | `text-sm font-normal` | Form inputs, table data, description text |
| **Body Medium** | `0.875rem` (14px) | `1.25rem` (20px) | `500` (Medium) | `normal` | `text-sm font-medium` | Button text, Active tab labels, Table headers |
| **Small / Muted** | `0.75rem` (12px) | `1.0rem` (16px) | `500` (Medium) | `normal` | `text-xs font-medium text-muted-foreground` | Timestamps, helper text, breadcrumbs |
| **Micro Badge** | `0.6875rem` (11px) | `0.875rem` (14px) | `600` (SemiBold) | `0.05em` | `text-[11px] font-semibold uppercase tracking-wider` | Status tags (ACTIVE, SENT, BOUNCED) |
| **Code / Merge Tag** | `0.8125rem` (13px) | `1.125rem` (18px) | `400` (Regular) | `normal` | `font-mono text-[13px]` | Personalization variables (`{{unsubscribe_url}}`) |

---

## 3. Color Palette & Shadcn Semantic Tokens (Dark Mode First)

| Token Name | HSL Value | Hex Code | Visual Context |
|---|---|---|---|
| `--background` | `222.2 84% 4.9%` | `#020817` | Main canvas background |
| `--card` | `222.2 84% 6.9%` | `#030A1C` | Card background & workspace containers |
| `--popover` | `222.2 84% 6.9%` | `#030A1C` | Tooltips, dropdown menus, modals |
| `--primary` | `142.1 70.6% 45.3%` | `#16A34A` | Emerald Cabbage accent green (Buttons, active badges) |
| `--primary-foreground` | `144.9 80.4% 10%` | `#022C16` | Text on primary button |
| `--secondary` | `217.2 32.6% 17.5%` | `#1E293B` | Secondary buttons, subtle tab highlight |
| `--muted` | `217.2 32.6% 17.5%` | `#1E293B` | Skeleton loaders, disabled states |
| `--muted-foreground` | `215 20.2% 65.1%` | `#94A3B8` | Subtitle text, inactive tab headers |
| `--border` | `217.2 32.6% 17.5%` | `#1E293B` | Card borders, table dividers |
| `--destructive` | `0 62.8% 30.6%` | `#7F1D1D` | Error alerts, delete client warnings |

---

## 4. Shadcn UI Component Standards

- **Buttons**:
  - Primary: Emerald Cabbage (`bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm h-9 px-4 rounded-md shadow`)
  - Outline: `border border-slate-700 hover:bg-slate-800 text-slate-200 text-sm h-9 px-4 rounded-md`
- **Inputs & Selects**:
  - `bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-emerald-500 text-sm text-slate-100 placeholder:text-slate-500 rounded-md h-9 px-3`
- **Badges**:
  - Active: `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold px-2 py-0.5 rounded-full`
  - Bounced/Failed: `bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-semibold px-2 py-0.5 rounded-full`
