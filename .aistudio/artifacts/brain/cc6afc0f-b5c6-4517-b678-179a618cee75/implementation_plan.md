# Scripter — Foundation, Navigation & Role Dashboards (Milestone 1)

Scripter is a responsive, mobile-first web platform for complete content creation—guiding creators and professionals from idea discovery and research through scriptwriting, teleprompter recording, and video production. Milestone 1 establishes a rock-solid, production-grade application shell, development role switcher (User, Admin, Master Admin), bilingual English/Hindi support, polished User Home and Master Admin dashboards, unified Coming Soon routing, and a clean Firebase-ready foundation.

***

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned during Phase 1 interactive clarification and will guide Milestone 1 implementation:

- **Confirmed Decision 1 (Language Presentation)**: English interface with a clean bilingual Hindi/English toggle. All key headings, journey steps, and labels will gracefully reflect English/Hindi (`EN | HI`) matching the supplied reference designs and mockups.
- **Confirmed Decision 2 (Default Landing View)**: Direct User Home dashboard on initial load, with persistent Dev/Test Mode Role Switcher in the top bar for seamless switching between User, Admin, and Master Admin views.
- **Confirmed Decision 3 (Default Business Profile)**: "Health & Wellness" pre-selected with an interactive profile quick-switcher (supporting Healthcare, Media & Entertainment, Education, Food & Beverage, Real Estate, Technology, Finance, etc.).
- **Asset Integrity**: Will use official brand assets provided in the workspace:
  - Header Logo: `/public/assets/aistudio/HEADER_LOGO_f8b18f40.png`
  - Favicon: `/public/assets/aistudio/FAVICON_be6b72fd.png`
  - Square App Logo: `/public/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png`

***

## 1. Overview & Core Concept

- **What It Does**: Scripter provides a unified content production operating system. Milestone 1 delivers the operational foundation:
  1. **Application Shell & Navigation**: Mobile bottom navigation for Users (`Home`, `Ideas`, `Create`, `Projects`, `Profile`) + collapsible/sidebar navigation for Admin and Master Admin.
  2. **Role Switcher**: Persistent Dev/Test role switcher (`User`, `Admin`, `Master Admin`) with clear visual badge that dynamically reconfigures navigation, permissions, and dashboards.
  3. **User Home Dashboard**: Welcoming personalized greeting, active business profile badge with switcher, AI credit tracker (`850 / 1,000 used`), primary action buttons ("Discover Ideas", "Create a Script"), content journey visual roadmap (Discover → Research → Script → Record → Edit & Export), recent projects list with demo data tag, and quick action cards.
  4. **Master Admin Home**: High-level platform health, KPI overview cards (Total Users, Active Projects, AI Usage, Credit Consumption, Platform Revenue), usage trends chart, recent registered users and projects table, top templates, and role navigation.
  5. **Admin Home**: Operational moderation and profile overview with scoped administrative access.
  6. **Universal Coming Soon Screen**: Consistent, polished placeholder for upcoming milestone routes with contextual explanation and back navigation.
  7. **Firebase Architecture**: Production-ready initialization layer reading from environment variables, client-side demo mode fallback, and structured TypeScript types for users, roles, and business profiles.

- **Target Audience / Persona**: Mobile-first content creators, small business owners, doctors/clinics, educators, realtors, marketers, and platform administrators.
- **Key Value**: A coherent, zero-clutter workflow that transforms intimidation into a structured step-by-step content journey without fake or broken interfaces.

***

## 2. User Experience & Visual Design

### Key User Flows

1. **User Landing & Journey Flow**:
   - User lands on `/user/home` viewing personalized header with avatar, notifications trigger, and Dev Role Switcher.
   - User inspects current business profile ("Health & Wellness") and can tap to switch to "Media & News" or "Education".
   - User views AI credit usage meter (`850 / 1,000 used`) with a "Buy Credits" / "Get More" modal preview.
   - User interacts with the 5-step Content Journey card:
     $$\text{Discover Ideas} \;\to\; \text{Research} \;\to\; \text{Script Studio} \;\to\; \text{Teleprompter} \;\to\; \text{Edit \& Export}$$
   - User explores "Recent Projects" (e.g., "Health & Wellness Video", "Diwali Special", "Orchha Heritage") or clicks "Create New Content" to explore options.
   - Clicking any upcoming destination (e.g., Script Studio, Teleprompter, Video Studio) opens the branded Coming Soon page with return navigation.

2. **Role Switching Flow**:
   - In the top bar, developer taps the Role Switcher pill (`User` / `Admin` / `Master Admin`).
   - Switching to `Master Admin` immediately transitions to `/master-admin/dashboard`, revealing the dark executive navigation rail, KPI cards, activity tables, and management menus.
   - Switching to `Admin` transitions to `/admin/dashboard`, displaying the scoped management console.
   - Switching back to `User` transitions to `/user/home` with the mobile-first bottom tab bar and creator dashboard.

3. **Bilingual Toggle Flow**:
   - Tapping the language toggle (`EN | HI`) switches interface copy between English and Hindi/Hinglish (e.g., "Create New Content" $\leftrightarrow$ "नया कंटेंट बनाएं", "Recent Projects" $\leftrightarrow$ "हाल के प्रोजेक्ट").

### Visual Identity & Theme

- **Color Palette (60-30-10 Rule)**:
  - **60% Neutral Canvas**: Crisp light surfaces (`#F8FAFC` to `#FFFFFF`) for User view; deep navy sidebar (`#0B132B` to `#1C2541`) for Master Admin matching the reference screenshots.
  - **30% Structural Surfaces**: Clean white cards with subtle border (`border-slate-200/80`), hairline dividers, and muted secondary text (`#64748B`).
  - **10% Brand Accents**: Royal electric blue (`#2563EB`) as primary action color, warm amber/gold (`#F59E0B`) for AI credits and Pro badges, emerald green (`#10B981`) for active statuses, and crimson (`#EF4444`) for alerts.
- **Typography**:
  - Primary UI & Display: `Plus Jakarta Sans` or modern sans-serif for crisp legibility.
  - Tabular Numbers: `font-mono tabular-nums` for credit counts, metrics, percentages, and timestamps.
- **Touch Ergonomics & Mobile Discipline**:
  - Minimum touch target: $\ge 44 \times 44\text{px}$ across all mobile buttons, tabs, and switches.
  - Thumb-zone optimized bottom bar with elevated center "Create" button.
  - 15% mobile sticky cap strictly enforced.

***

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Routing with React Router**:
  - *Chosen Approach*: Install `react-router-dom` to support deep linking (`/user/home`, `/admin/dashboard`, `/master-admin/dashboard`, `/user/ideas`, etc.), browser history navigation, and 404 fallbacks.
  - *Why*: Provides clean URL structure, instant transitions, and prevents page refresh during role switching.

- **Decision 2: Development Role Switcher vs Production Auth**:
  - *Chosen Approach*: Centralize the role switcher state in a `RoleContext` with clear `[DEV MODE]` visual indicator. Prepare interfaces with strict role separation types.
  - *Why*: Allows rapid evaluation and QA of all 3 distinct user interfaces while keeping the code architecture strictly segregated for future backend security rules.

- **Decision 3: Clear Demo Data Labeling**:
  - *Chosen Approach*: All metric figures and recent projects carry a subtle "Demo Data" badge or footnote so evaluators know exactly what is sample content versus live data.
  - *Why*: Complies with prompt instructions: "Do not display invented demo values as live production metrics."

***

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SCRIPTER APP SHELL                              │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ SHARED TOP BAR                                                   │  │
│  │ [Scripter Logo] · [Language EN/HI] · [Dev Role Switcher] · [User]│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────┐  ┌────────────────────────────────────────┐  │
│  │ DESKTOP / ADMIN RAIL  │  │ MAIN VIEWPORT CONTAINER                │  │
│  │ • Dashboard           │  │                                        │  │
│  │ • User Management     │  │  /user/home                            │  │
│  │ • Business Profiles   │  │  ┌──────────────────────────────────┐  │  │
│  │ • Templates & Assets  │  │  │ Welcome & Business Profile Switch│  │  │
│  │ • AI Provider Hub     │  │  │ AI Credits Progress Tracker      │  │  │
│  │ • Plans & Credits     │  │  │ Content Journey (5 Stages)       │  │  │
│  │ • Settings & Logs     │  │  │ Quick Actions & Recent Projects  │  │  │
│  │                       │  │  └──────────────────────────────────┘  │  │
│  │                       │  │                                        │  │
│  │                       │  │  /master-admin/dashboard               │  │
│  │                       │  │  ┌──────────────────────────────────┐  │  │
│  │                       │  │  │ KPI Metrics (5 Cards)            │  │  │
│  │                       │  │  │ Platform Activity & Usage Trends │  │  │
│  │                       │  │  │ Registered Users & Recent Project│  │  │
│  │                       │  │  │ Top Templates & Distribution     │  │  │
│  │                       │  │  └──────────────────────────────────┘  │  │
│  │                       │  │                                        │  │
│  │                       │  │  /coming-soon (Reusable for 20+ routes)│  │  │
│  └───────────────────────┘  └────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ MOBILE USER BOTTOM NAV (Natural Thumb Zone)                      │  │
│  │ [Home]     [Ideas]     [+ Create]     [Projects]     [Profile]   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   ┌───────────────────────┐                 ┌───────────────────────┐
   │ Firebase Config Layer │                 │ Centralized Demo Data │
   │ • initFirebase()      │                 │ • Business Profiles   │
   │ • typed schemas/roles │                 │ • Sample Projects     │
   │ • .env.example specs  │                 │ • Admin KPI snapshots │
   └───────────────────────┘                 └───────────────────────┘
```

### Module & Route Structure

- **Routes**:
  - User: `/user/home`, `/user/ideas`, `/user/create`, `/user/projects`, `/user/profile`, `/user/research`, `/user/script-studio`, `/user/teleprompter`, `/user/video-studio`, `/user/templates`, `/user/business-profiles`, `/user/notifications`, `/user/credits`, `/user/subscription`, `/user/settings`, `/user/help`.
  - Admin: `/admin/dashboard`, `/admin/users`, `/admin/business-profiles`, `/admin/industries`, `/admin/templates`, `/admin/assets`, `/admin/moderation`, `/admin/feedback`, `/admin/tickets`, `/admin/notifications`, `/admin/reports`, `/admin/settings`, `/admin/help`.
  - Master Admin: `/master-admin/dashboard`, `/master-admin/users`, `/master-admin/business-profiles`, `/master-admin/industries`, `/master-admin/templates`, `/master-admin/assets`, `/master-admin/ai-providers`, `/master-admin/plans`, `/master-admin/billing`, `/master-admin/content-settings`, `/master-admin/notifications`, `/master-admin/analytics`, `/master-admin/moderation`, `/master-admin/feedback`, `/master-admin/tickets`, `/master-admin/admins`, `/master-admin/system`, `/master-admin/logs`.
  - Shared: `/coming-soon` (with query param `?feature=...`), `*` (Not Found 404).

### Implementation Steps

1. **Install routing package**: `react-router-dom` via `install_applet_package`.
2. **Configure metadata.json & index.html**: Set official title "Scripter — Complete Content Creation" and brand meta.
3. **Core Types & Contexts**:
   - `src/types/index.ts`: Role, UserProfile, BusinessProfile, Project, AdminMetrics, NavItem.
   - `src/context/RoleContext.tsx`: Active role state (`user` | `admin` | `master-admin`) with persistence and dev mode badge.
   - `src/context/LanguageContext.tsx`: Bilingual toggle (`en` | `hi`) with translation dictionary.
4. **Firebase Setup**:
   - `src/services/firebase/config.ts`: Safe initialization checking `VITE_FIREBASE_*` environment variables with graceful fallback and connection state reporting.
   - `.env.example`: Update with standard Firebase configuration keys.
5. **Shared Navigation & Shell Components**:
   - `Header.tsx`: Scripter brand logo, bilingual toggle, Dev Mode Role Switcher dropdown/segmented toggle, notification icon, user avatar.
   - `MobileBottomNav.tsx`: 5-item thumb zone with elevated Create button.
   - `AdminSidebar.tsx`: Professional collapsible dark rail for Admin & Master Admin.
   - `ComingSoonPage.tsx`: Branded placeholder with feature explanation and back button.
6. **User Home Dashboard**:
   - Welcome greeting + active business profile switcher dropdown.
   - AI Credit usage progress bar.
   - Content Journey 5-stage interactive card.
   - Quick action shortcuts.
   - Recent projects with status tags and "Demo Data" badge.
7. **Master Admin & Admin Dashboards**:
   - Header with date range filter and live status indicator.
   - 5 KPI metric cards with change indicators and demo data labels.
   - Platform activity chart / visual representation.
   - Recent registered users and recent projects table.
   - Quick navigation shortcuts to sub-management modules.
8. **Verification & Build**:
   - Run `compile_applet` and verify zero TypeScript, lint, or layout compilation issues.
   - Verify responsive behavior across mobile (375px) and desktop (1440px).
