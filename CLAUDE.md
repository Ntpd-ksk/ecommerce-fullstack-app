# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 + Vuetify 3 admin dashboard template ("Fakduai") using TypeScript, Vite, and Pinia. Package manager is **pnpm** (v8.6.2).

## Commands

```bash
pnpm dev              # Dev server (Vite)
pnpm build            # Production build
pnpm preview          # Preview production build on port 5050
pnpm typecheck        # vue-tsc --noEmit
pnpm lint             # ESLint (auto-fix) for .ts,.js,.cjs,.vue,.tsx,.jsx
pnpm lint:style       # Stylelint (auto-fix) for .css,.scss,.vue
pnpm storybook        # Storybook on port 6006
pnpm build:icons      # Rebuild Iconify icon bundles
```

## Path Aliases

Defined in both `vite.config.ts` and `tsconfig.json`:

| Alias | Path |
|---|---|
| `@` | `src/` |
| `@core` | `src/@core/` |
| `@layouts` | `src/@layouts/` |
| `@images` | `src/assets/images/` |
| `@styles` | `src/assets/styles/` |
| `@themeConfig` | `themeConfig.ts` |
| `@configured-variables` | `src/assets/styles/variables/_template.scss` |
| `@validators` | `src/@core/utils/validators` |

## Architecture

### Routing

File-based routing via `unplugin-vue-router`. Pages live in `src/pages/` — the file path becomes the route. Route names are auto-generated as kebab-case. Layouts (`src/layouts/blank.vue`, `src/layouts/default.vue`) are applied via `vite-plugin-vue-layouts`. Route meta types are extended in `env.d.ts` with `action`, `subject`, `layout`, `unauthenticatedOnly`, `public`.

### Auto-imports

- **Vue/VueUse/Pinia/vue-i18n** APIs auto-imported (no explicit imports needed)
- **Composables** from `src/@core/composable/`, `src/composables/`, `src/utils/` auto-imported
- **Components** from `src/@core/components/`, `src/components/` auto-registered
- `useCookies` and `useStorage` are explicitly excluded from auto-import

### State Management

Pinia stores in `src/stores/` with `pinia-plugin-persistedstate`. Store files follow `use-*-store.ts` naming. Global UI stores: `use-alert-dialog-store`, `use-loading-overlay-store`, `use-notification-store`. The core config store (`src/@core/stores/config.ts`) manages theme, skin, nav layout via cookie-persisted refs.

### API Layer

- `src/composables/useApi.ts` — `createFetch` wrapper (VueUse) with base URL from `VITE_API_BASE_URL`, auto-attaches `accessToken` cookie as Bearer token, parses JSON via `destr`
- `src/apis/` — API functions (e.g., `user-api.ts`, `product-api.ts`) that call `useApi` and pass results through `responseHandler`
- `src/utils/api-response-handler.ts` — normalizes responses into `ResponseStandard` (`{ ok, data, error }`)
- `src/models/` — TypeScript interfaces for API request/response types, barrel-exported from `index.ts`

### Theme System

- `themeConfig.ts` — global app config (layout, nav, skin, i18n, icons)
- `src/@core/` — template engine: components, composables, SCSS, stores, utils. Treat as upstream/library code.
- `src/@layouts/` — layout framework (nav components, layout stores, styles). Also treat as upstream.
- `src/design-tokens/tokens.ts` — centralized design tokens (colors, typography, spacing, radius, shadows)
- Vuetify config in `src/plugins/vuetify/` (defaults, icons, theme). Primary color customizable via cookies.
- Icon set: Remix Icon (`ri-*`) via Iconify, with custom icon builds in `src/plugins/iconify/`

### Global Components

`src/components/global/` contains app-wide components (BaseTable, GlobalAlertDialog, GlobalLoadingOverlay, GlobalNotification) used across pages.

`src/components/ui/` contains reusable UI primitives (UiBadge, UiButton, UiCard, UiSectionHeader, UiStatCard).

### Navigation

Sidebar/horizontal nav items defined in `src/navigation/vertical/index.ts` and `src/navigation/horizontal/`. Route names must match file-based route names.

## Conventions

- **SFC order**: `<script setup>` → `<template>` → `<style scoped>`
- **Naming**: kebab-case for TS files and folders; PascalCase for Vue component files
- **ESLint**: extends `@antfu/eslint-config-vue` — no semicolons, single quotes, no trailing commas in single-line
- **Vuetify components** (VCard, VBtn, etc.) are globally available — no imports needed
- **`<script setup lang="ts">`** always — never use `defineComponent`

## Docker

- `docker-compose.dev.yml` — dev with hot-reload (mounts `src/` and `public/`)
- `Dockerfile.prod` — multi-stage build (Node 18 → Nginx) serving from port 80

## Skill Usage Policy

**MANDATORY pre-task step:** Before starting ANY task (code, review, debug, refactor), Read `.claude/skills/karpathy-guidelines/SKILL.md` once. Apply its 4 rules (think-before-coding, simplicity-first, surgical changes, goal-driven). Skip only for pure conversational replies.

**MANDATORY UI pre-task step:** When task touches UI/UX (new screen, component, style, layout, color, spacing, typography, Vuetify theming, design-token usage), Read `DESIGN.md` once before editing. Use its tokens/CSS vars instead of raw hex/px. **Skip `DESIGN.md` entirely for non-UI work** (API, store, util, build config, types, routing logic) to save tokens.

**MANDATORY UI skill:** When task adds, edits, improves, or removes UI elements (components, pages, layouts, styles, colors, spacing, typography, accessibility), invoke `ui-ux-pro-max` once. It pairs with `DESIGN.md` — `DESIGN.md` gives project tokens, `ui-ux-pro-max` gives design intelligence (palettes, font pairing, UX rules, accessibility). Skip for non-UI work. Do not reload if already active in turn.

### Invocation rules (token-conscious)

- **Invoke a skill only when its trigger matches the current task.** Do not preload, chain, or "sample" skills. One skill per task is the default.
- **Prefer built-in tools** (Read/Edit/Bash/Grep) for trivial work. Skills add prompt overhead — use them when the discipline they enforce is worth the cost.
- **Never invoke a skill already loaded** (check `<command-name>` in turn). Re-reading wastes tokens.
- **Stop at first matching skill.** If `debug-mantra` covers it, do not also load `diagnose`.

### When to invoke (trigger → skill)

| Trigger / Task | Skill | Notes |
|---|---|---|
| Any code-writing/review/refactor start | `karpathy-guidelines` (Read file directly) | Always first. |
| Bug report, stack trace, "broken/failing/throwing" | `debug-mantra` | Quick bugs only. |
| Hard bug, perf regression, repro-required | `diagnose` | Heavier loop; skip if `debug-mantra` enough. |
| Building feature/fix test-first, user says TDD | `tdd` | |
| Vue/VueUse composable opportunity | `vueuse-functions` | Only when reactive utility/composable would simplify. |
| UI/UX add, edit, improve, delete (component, page, style, layout, color, spacing, a11y) | `ui-ux-pro-max` | Pair with `DESIGN.md`. Once per UI task. Skip non-UI work. |
| Writing/editing any `.vue` SFC or Composition API code | `vue-best-practices` | Default Vue authoring skill. Load once per Vue task, not per file. |
| Authoring a reusable composable in `src/composables/` or `src/@core/composable/` | `create-adaptable-composable` | Only for library-grade composables accepting refs/getters/raw values. Skip for one-off composables. |
| Pinia store work (`src/stores/use-*-store.ts`) | `vue-pinia-best-practices` | Load when creating/refactoring a store, not for trivial state reads. |
| Vue Router work (guards, params, nav, route meta in `env.d.ts`) | `vue-router-best-practices` | Skip for trivial page additions (file-based routing handles it). |
| Vue runtime error, reactivity bug, watcher loop, hydration issue | `vue-debug-guides` | Pair with `debug-mantra`; do not load both `vue-debug-guides` + `diagnose` together. |
| Writing/fixing Vue tests (Vitest + Vue Test Utils) | `vue-testing-best-practices` | Only when test files involved. |
| **Do NOT load** `vue-jsx-best-practices` | — | Project uses SFC `<template>`, not JSX. |
| **Do NOT load** `vue-options-api-best-practices` | — | Project mandates `<script setup>` — Options API forbidden. |
| Review PR/diff/plan, "sanity-check", "second opinion" | `scrutinize` | Use over manual review for non-trivial diffs. |
| Post-change cleanup of changed code | `simplify` | After feature complete, not during. |
| Verify change works in real app | `verify` or `run` | `run` to launch; `verify` to confirm behavior. |
| Understand unfamiliar large codebase area | `understand-anything:understand` | Skip for files you can just Read. |
| Analyzing a diff/PR impact | `understand-anything:understand-diff` | |
| Anthropic SDK / Claude API code | `claude-api` | Only when file imports `@anthropic-ai/sdk`. |
| User asks "how do I do X", "is there a skill for…" | `find-skills` | Discovery only. |
| Recurring/polling task ("every 5m") | `loop` | Never for one-shots. |
| Edit `settings.json`, hooks, permissions | `update-config` | |
| Rebind keys, `~/.claude/keybindings.json` | `keybindings-help` | |
| Reduce permission prompts in this repo | `fewer-permission-prompts` | One-time setup. |
| Security audit of code | `security-review` | |
| General code review pass | `review` | Lighter than `scrutinize`. |
| Initialize/refresh `CLAUDE.md` | `init` | |
| GLM plan usage query | `glm-plan-usage:usage-query` | |

### Token-saving rules

- Do NOT invoke `understand-anything:*` for tasks resolvable by `grep` + `Read` of <5 files.
- Do NOT invoke `scrutinize` + `review` + `simplify` together; pick one per pass.
- `ui-ux-pro-max` counts as the UI skill for the turn — do not also load `vue-best-practices` for pure styling/layout tasks (no `.vue` logic). Load both only when task mixes UI design + Vue logic.
- For library docs/API questions, use Context7 MCP, not WebSearch.
- Delegate broad codebase exploration (>3 queries) to `Agent(subagent_type=Explore)` instead of running searches yourself.