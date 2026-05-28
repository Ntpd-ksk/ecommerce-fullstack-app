# Project Instructions

## Operating Mode

- Think deeply before editing, but keep explanations focused on decisions, tradeoffs, and verification.
- Work end to end: inspect the existing implementation, make the smallest coherent change, then run the relevant checks.
- Prefer existing project patterns over new abstractions. Add abstractions only when they remove real duplication or match an established local pattern.
- Do not revert or overwrite unrelated user changes. Check `git status --short` before and after edits when changing files.

## Project Overview

This is a Vue 3 admin dashboard for Pinto/Fakduai, built with TypeScript, Vite, Vuetify 3, Pinia, Vue Router, VueUse, Storybook, and SCSS.

- Package manager: `pnpm@8.6.2`.
- Main app source: `src/`.
- Vite entry: `index.html` and `src/main.ts`.
- File-based pages: `src/pages/`.
- Layouts: `src/layouts/`.
- Shared app components: `src/components/`.
- API modules: `src/apis/`.
- Models and API types: `src/models/`.
- Pinia stores: `src/stores/`.
- Template/core framework code: `src/@core/` and `src/@layouts/`; treat these as upstream-style code and avoid broad edits unless the task requires it.

## Commands

Use `pnpm` commands unless the user explicitly asks otherwise.

```bash
pnpm dev
pnpm build
pnpm preview
pnpm typecheck
pnpm lint
pnpm lint:style
pnpm storybook
pnpm build-storybook
pnpm build:icons
```

Run the narrowest useful validation after a change. For TypeScript or Vue changes, prefer at least `pnpm typecheck`; for style or lint-sensitive edits, run `pnpm lint` and/or `pnpm lint:style`.

## Architecture Notes

- Routing is file-based via `unplugin-vue-router`. Files in `src/pages/` become routes, and route names are generated as kebab-case.
- Layouts are applied through `vite-plugin-vue-layouts`.
- Vue, VueUse, Pinia, Vue Router, vue-i18n APIs, local composables, and many components are auto-imported. Avoid redundant imports for auto-imported APIs unless the local code already does so.
- Vuetify components are globally available through the Vuetify plugin.
- API calls should generally live in `src/apis/`, use model types from `src/models/`, and return the shared response shape when possible.
- Stores use Pinia and live in `src/stores/`; store files follow `use-*-store.ts`.
- Global UI state stores already exist for alert dialogs, loading overlays, and notifications.
- Design tokens live in `src/design-tokens/tokens.ts`; prefer tokens and existing UI primitives before adding one-off styling.

## Code Style

- Use Vue SFCs with `<script setup lang="ts">`, then `<template>`, then `<style scoped>`.
- Use TypeScript strictly. Avoid `any` unless there is no practical alternative and the reason is local and obvious.
- Follow the Antfu Vue ESLint style used by the repo: no semicolons, single quotes, concise imports.
- Use kebab-case for TS files and folders. Use PascalCase for Vue component files.
- Prefer `@/`, `@core/`, `@layouts/`, `@images/`, and `@styles/` aliases instead of long relative paths.
- Keep comments rare and useful; do not narrate obvious code.

## Frontend Guidelines

- Build admin screens as practical work surfaces: dense enough to scan, restrained visually, and consistent with Vuetify and the existing `src/components/ui/` primitives.
- Prefer existing primitives such as `UiButton`, `UiCard`, `UiBadge`, `UiStatCard`, `UiSectionHeader`, and global components before creating new UI.
- Use Vuetify layout and form controls consistently. Avoid custom controls when a Vuetify component already fits.
- Keep responsive behavior explicit with stable widths, grids, breakpoints, and spacing so labels, buttons, and tables do not shift or overlap.
- Icons should come from the existing Iconify/Vuetify setup, especially Remix Icon names (`ri-*`), unless the surrounding code uses another source.

## API And Data Flow

- Use `src/composables/useApi.ts` when the request should inherit the app base URL and access-token behavior.
- Normalize API results with `src/utils/api-response-handler.ts` when working with the standard backend response flow.
- Keep request/response interfaces in `src/models/` and export them through `src/models/index.ts` when they are shared.
- Keep URL construction structured with `URLSearchParams` for query strings.
- Do not hardcode secrets or environment-specific URLs. Use `import.meta.env` variables.

## Verification

- Before finishing, report what changed and which checks ran.
- If a check cannot run because dependencies, environment variables, or services are missing, state that clearly.
- When changing UI, start the dev server with `pnpm dev` if useful and provide the local URL.
- Do not leave long-running dev servers or command sessions open unless the user asked for an active server.

## Skill Usage Policy

**Mandatory:** Read `.claude/skills/karpathy-guidelines/SKILL.md` before any code task. Apply its 4 rules every edit. Skip only for pure chat.

**Mandatory (UI only):** Read `DESIGN.md` before any UI/UX edit (new component, screen, style, layout, color, spacing, typography, theme, design tokens). Use tokens/CSS vars from it instead of raw values. **Do NOT read `DESIGN.md` for non-UI work** (API, store, util, types, build, routing) — saves tokens.

**Mandatory (UI only):** Invoke `ui-ux-pro-max` once when task adds, edits, improves, or removes UI (components, pages, layouts, styles, colors, spacing, typography, accessibility). Pairs with `DESIGN.md` — project tokens + design intelligence. Skip non-UI work. Don't reload if already active.

### Core principles (token economy)

- One skill per task. Invoke only when its trigger explicitly matches.
- Built-in tools (Read/Edit/Bash/Grep) beat skills for trivial work — skills carry prompt cost.
- Never reload a skill already active in the turn.
- Stop at first matching skill; don't stack overlapping ones.

### Trigger map

| Situation | Skill |
|---|---|
| Start of any code work | `karpathy-guidelines` (Read directly) |
| Reported bug / stack trace | `debug-mantra` |
| Hard bug or perf regression needing repro loop | `diagnose` (skip if `debug-mantra` suffices) |
| Test-first feature/fix | `tdd` |
| Vue/VueUse refactor opportunity | `vueuse-functions` |
| UI/UX add, edit, improve, delete (component, page, style, layout, color, a11y) | `ui-ux-pro-max` (once per UI task, pairs with `DESIGN.md`) |
| Any `.vue` SFC / Composition API edit | `vue-best-practices` (once per task) |
| Library-grade composable accepting refs/getters/raw | `create-adaptable-composable` |
| Pinia store create/refactor | `vue-pinia-best-practices` |
| Vue Router guards/params/meta work | `vue-router-best-practices` |
| Vue runtime/reactivity/watcher/hydration bug | `vue-debug-guides` (pair with `debug-mantra`) |
| Vitest + Vue Test Utils test work | `vue-testing-best-practices` |
| **Never load** `vue-jsx-best-practices` (no JSX in repo) | — |
| **Never load** `vue-options-api-best-practices` (script setup mandatory) | — |
| Plan/PR/diff review, second opinion | `scrutinize` |
| Lighter code-review pass | `review` |
| Post-change cleanup of own diff | `simplify` |
| Confirm change works in app | `verify` / `run` |
| Map unfamiliar codebase area | `understand-anything:understand` |
| Analyze diff impact | `understand-anything:understand-diff` |
| Anthropic SDK / Claude API work | `claude-api` |
| Skill discovery ("is there a skill…") | `find-skills` |
| Recurring/polling task | `loop` |
| `settings.json`, hooks, permissions | `update-config` |
| Keybindings | `keybindings-help` |
| Trim permission prompts | `fewer-permission-prompts` |
| Security audit | `security-review` |
| (Re)generate `CLAUDE.md` | `init` |

### Avoid

- `understand-anything:*` for tasks solvable by `grep` + reading <5 files.
- Combining `scrutinize` + `review` + `simplify` in one pass.
- `ui-ux-pro-max` = UI skill for turn. Don't also load `vue-best-practices` for pure styling/layout. Load both only when mixing UI design + Vue logic.
- `WebSearch` for library docs — use Context7 MCP.
- Repeating search in main thread when delegating to `Agent(subagent_type=Explore)`.
