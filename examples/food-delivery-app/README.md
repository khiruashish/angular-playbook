# FoodDash: Angular 22 food-delivery example

Part of the [Angular Playbook](../../README.md). It runs fully in the browser with a mock-API interceptor,
so no backend is needed.

| Command | What |
|---|---|
| `npm start` | dev server (mock API) at http://localhost:4200 |
| `npm run start:qa` | serve with the qa configuration |
| `npm run build:dev` / `build:qa` / `build:uat` / `build:prod` | environment builds |
| `npm test` / `npm run test:ci` | Vitest (watch / single run + coverage) |
| `npm run e2e` | Playwright E2E (starts `ng serve` automatically) |
| `npm run lint:types` | type-check the app |

Demo logins: `customer@food.dev` / `password` (CUSTOMER) and `admin@food.dev` / `password` (ADMIN).

To use a real backend, set `useMockApi: false` in `src/environments/environment.ts` and run the API on
`localhost:8080`. `proxy.conf.json` forwards `/api` there.

`src/challenges/` holds the tested solutions to the playbook's interview coding challenges.
