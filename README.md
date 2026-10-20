# Wickford Plumbing Supplies

Mobile shop and fault assistant for Wickford Plumbing Supplies, a UK trade plumbing merchant in Wickford, Essex. Customers describe a boiler fault or search for a spare. Orders are paid in Stripe test mode and raised as a drop-ship email to the supplier (DHS by default), with a copy to Wickford.

The app is Expo / React Native (TypeScript), so the same project builds for the Apple App Store and Google Play. Secrets stay on the API. The repository can be public: only `.env.example` is committed.

## Try it in the browser

No account, API key, or server is required. Open the hosted demo:

https://wickfordplumbing-collab.github.io/Spares-Vault/

That page is a static Expo web build published by GitHub Pages (`.github/workflows/pages.yml` on every push to `main`). The site lives under `/Spares-Vault`. Help, shop search, the basket, test checkout, and the supplier email all run in the browser against a bundled copy of the sample catalogue and the knowledge base.

The workflow file is already on `main`. The first publish still needs an admin to turn Pages on: open the repository, go to **Settings → Pages → Build and deployment**, and set **Source** to **GitHub Actions**. Then open **Actions → Pages**, open the latest run, and choose **Re-run failed jobs**. Until that source is selected, the URL above is GitHub's 404 page.

- Pay with card `4242 4242 4242 4242`, any expiry, any CVC.
- Staff orders (Orders tab) uses token `change-me`.
- The DHS email is composed and shown on the order. Nothing is sent. Orders stay in that browser.

A local build of the same demo:

```bash
cd apps/mobile
EXPO_PUBLIC_DEMO=1 EXPO_PUBLIC_BASE_PATH=/Spares-Vault npm run export:pages
```

```
apps/mobile     Expo app (Help, Shop, basket, checkout, orders, staff list)
apps/api        Node / TypeScript API
knowledge-base  Boiler-spares notes (markdown + CSV) the assistant searches
data/           Sample catalogue CSV. The SQLite file and outbox are created locally and gitignored.
```

## Run it locally

You need Node.js 22.5 or newer (the API uses the built-in `node:sqlite`).

```bash
cp .env.example .env
cp apps/mobile/.env.example apps/mobile/.env
npm install --prefix apps/api
npm install --prefix apps/mobile
npm test
npm run api
```

In a second terminal:

```bash
npm run mobile
```

Then:

- Press `w` for the web app (quickest way to click through both sections).
- Scan the QR code with Expo Go for a phone, after changing `EXPO_PUBLIC_API_URL` in `apps/mobile/.env` to your computer's LAN address, for example `http://192.168.1.20:8787`. Restart Expo after changing it. Android emulators use `http://10.0.2.2:8787`.
- `npm run mobile:web` starts the web bundle directly.

The API listens on port 8787. On first start it loads `data/catalogue.sample.csv` if the database is empty. Those prices are placeholders, labelled in the app.

What works with only the example env file:

- Help / Diagnose in **mock** mode, grounded on `knowledge-base/`.
- Shop search by part number, GC number, model, or a description such as "the blue valve under the boiler".
- Product pages, including cross-brand rows from `knowledge-base/cross-brand-equivalents.csv` (confidence, cautions, same-company versus cross-brand, and a cheaper in-catalogue hint when both numbers are stocked).
- Basket and checkout. With no Stripe key, payment is a simulated Stripe test checkout: card `4242 4242 4242 4242`, any future expiry, any CVC. The number is checked and not stored.
- A drop-ship order email is written to `data/outbox/` and stored on the order. Staff orders (token `ADMIN_TOKEN`) lists status and the email.

`npm test` in `apps/api` covers that path.

## Environment variables

See `.env.example`. Nothing secret has a default that should be used in production. Change `ADMIN_TOKEN` before anyone else can reach the API.

| Variable | Purpose |
|---|---|
| `PORT`, `PUBLIC_BASE_URL` | API listen port and the URL Stripe redirects back to |
| `DATA_DIR` | SQLite database and email outbox |
| `ADMIN_TOKEN` | Bearer token for `/api/admin/*` |
| `LLM_PROVIDER` | `mock`, `openai`, or `anthropic`. If unset, a provider is used only when its key is present; otherwise mock |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | OpenAI Chat Completions. The key is read on the server only |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | Anthropic Messages API |
| `STRIPE_SECRET_KEY` | Must be `sk_test_…`. Live keys are refused |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for `POST /api/stripe/webhook` |
| `SUPPLIER_ADAPTER` | `email` (implemented) or `api-edi` (stub, sends nothing) |
| `SUPPLIER_NAME` | Shown on the order email. Default: DHS (Direct Heating Spares) |
| `SUPPLIER_ORDER_EMAIL` | Where the drop-ship email is addressed. The placeholder is not a real DHS inbox |
| `WICKFORD_ORDERS_EMAIL` | Copy of every order |
| `ORDER_FROM_EMAIL`, `ORDER_FROM_NAME` | From header when SMTP is set |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE` | Optional. If `SMTP_HOST` is empty the email is still generated and saved |
| `EXPO_PUBLIC_API_URL` | API URL baked into the app at bundle time. Not a secret. Ignored when demo mode is on |
| `EXPO_PUBLIC_DEMO` | Set to `1` to use the in-browser mock (no Node server). Also turns on automatically when the site hostname ends in `github.io` |
| `EXPO_PUBLIC_BASE_PATH` | Subpath for a static host, for example `/Spares-Vault` on GitHub Pages. Leave unset for local web at `/` |

The knowledge base lists DHS on 0330 123 3707 and does not publish an orders email. Replace `SUPPLIER_ORDER_EMAIL` with the trade-desk address once the account is confirmed. Until SMTP is set, open `data/outbox/WPS-*-supplier.txt` to see the exact message.

### Live assistant

Set `LLM_PROVIDER=openai` or `anthropic` and the matching key. The model is given retrieved excerpts from the knowledge base and must answer from those notes. Part numbers it returns are checked against the catalogue. If the call fails, the API falls back to the offline assistant and says so. Every answer includes: gas work must be done by a Gas Safe registered engineer.

### Stripe test checkout

With `STRIPE_SECRET_KEY=sk_test_…`:

1. Checkout creates a Stripe Checkout Session in test mode and opens it.
2. Pay with `4242 4242 4242 4242`.
3. Stripe redirects to `/payments/return` on the API, which marks the order paid and generates the supplier email.
4. Point a webhook at `https://<your-api>/api/stripe/webhook` for `checkout.session.completed`, and set `STRIPE_WEBHOOK_SECRET`, so the order is raised even if the shopper closes the tab before the return page loads.

`PUBLIC_BASE_URL` must be the URL Stripe can reach (a tunnel such as ngrok is enough in development).

## Catalogue CSV

There is no Intact / Xline stock feed in this build. The importer takes a header row and these columns:

```
part_number,description,brand,price,stock,fits
```

`price` is pounds and pence (`18.40` → 1840 pence). `fits` is free text; put the model and GC number here so search can find them, for example `Ideal Logic Combi 30 (GC 47-348-57)`. Optional `price_note`: if every row says `PLACEHOLDER`, the app keeps the sample-catalogue banner.

Load a real export (this replaces the sample rows):

```bash
npm run import-catalogue -- --replace /path/to/intact-spares.csv
```

Omit `--replace` to upsert. The same import is on the staff screen (paste CSV). Restart is not required; the API reads the database on each request.

The sample file `data/catalogue.sample.csv` is built from part numbers in the knowledge base (DHS worked examples and the cross-brand table). Every sample price is a placeholder. Do not quote them.

## Shop search and alternatives

Search ranks, in order: exact part number, GC number (`47-044-32`, `47 044 32`, or `4704432`), model words against the fit list, then the description. A few plain-English phrases are expanded on purpose. "The blue valve under the boiler" is treated as the filling loop first, and the brass pressure-relief valve is still returned so the counter can tell them apart.

Product pages read `knowledge-base/cross-brand-equivalents.csv`. Rows are labelled verified, probable, or same-company (Baxi Heating, Vaillant Group, and the other group sheets are not sold as cross-brand). Cautions from the table — voltage, thread, bar rating, litres, litres/min, build date — are shown in full. If another number on that row is also in the catalogue at a lower placeholder price, the page says so and tells you the price is not a live trade price.

Number `178985` is the known collision: a Vaillant 3 bar PRV and an Ideal front door panel. The product page repeats that warning.

## Orders and the supplier adapter

After payment the API writes an order (`WPS-1001`, …) and calls the supplier adapter.

`email` composes:

- A supplier message: drop-ship instruction, customer delivery address, quantities and manufacturer part numbers, no prices.
- A Wickford copy: the same text plus the merchandise total, with placeholder prices marked when the sample catalogue is in use.

Both are saved on the order and as text files in `data/outbox/`. If SMTP is configured they are sent as well. A failed SMTP send still keeps the outbox files; the order status stays `sent_to_supplier` and the staff screen shows the SMTP error in the supplier note.

`api-edi` implements the same interface and returns "not implemented". Use it only to prove the seam. It does not transmit an order. A future EDI or supplier HTTP API should implement `SupplierAdapter.submit` in `apps/api/src/suppliers.ts` and leave the email adapter in place as a fallback.

Staff list: Orders tab → Staff orders, enter `ADMIN_TOKEN`. Statuses include `pending_payment`, `sent_to_supplier`, and `supplier_pending_adapter`.

## Gas Safe

The assistant, product pages, and checkout carry this note: gas work must be done by a Gas Safe registered engineer. The offline assistant will not turn a fault code into a single part, and it will say when a code is not in the notes. Customer-level checks are the user-guide ones only: system pressure, a frozen outside condensate pipe, gas supply and meter credit, controls calling, and one reset.

## Publishing

The Expo config is `apps/mobile/app.json` and `apps/mobile/eas.json`.

- iOS bundle id: `uk.co.wickfordplumbing.spares`
- Android package: `uk.co.wickfordplumbing.spares`
- The app declares that it does not use non-exempt encryption (`ITSAppUsesNonExemptEncryption` is false). It only uses HTTPS.

One-time setup:

1. Apple Developer account and a Google Play Console account.
2. `npm install -g eas-cli` then `cd apps/mobile && eas login && eas init`. `eas init` writes the EAS project id. Do not invent one.
3. Put the production API URL in the EAS environment for the preview and production profiles: `eas env:create --environment production --name EXPO_PUBLIC_API_URL --value https://api.example.com --visibility plaintext`. This value is public. Do not put `STRIPE_SECRET_KEY`, SMTP passwords, or the LLM key in the Expo project. Those belong on the API host.
4. Host the API (any Node 22 service). Set `NODE_ENV` does not change the secret rules: live Stripe keys are still refused until you deliberately remove that guard for a later release. Keep test keys until the shop has been checked on TestFlight and an internal Play track.
5. `eas build --platform ios --profile production` and `eas build --platform android --profile production`.
6. `eas submit --platform ios --profile production` and `eas submit --platform android --profile production`. The Android submit profile uses the internal track. iOS submit needs an App Store Connect app with the same bundle id; `eas submit` will ask for the Apple credentials on first use (or read them from EAS).
7. Store listing: say that the app sells boiler spare parts and gives parts guidance, and that gas work must be done by a Gas Safe registered engineer. Privacy policy text is in the app under Orders → Privacy. Host that text at a public URL and paste the URL into App Store Connect and Play Console. The app collects name, email, phone, and delivery address to fulfil an order, and sends fault descriptions to your API.
8. Screenshots: capture Help, Shop, a product page, basket, and an order on a phone (or the iOS simulator) at the sizes Apple and Google currently require. Replace the placeholder icon in `apps/mobile/assets/images/` with final artwork before the production build.

Preview builds for internal testers:

```bash
cd apps/mobile
eas build --platform all --profile preview
```

## API surface

| Method | Path | Notes |
|---|---|---|
| GET | `/api/health` | Assistant mode, payment mode, catalogue mode |
| POST | `/api/chat` | `{ messages: [{ role, content }] }` |
| GET | `/api/search?q=` | Part, GC, model, or description |
| GET | `/api/product?partNumber=` | Part, alternatives, cautions |
| POST | `/api/checkout` | Address, basket. Returns Stripe URL or simulated-test |
| POST | `/api/orders/:id/confirm-test` | Simulated test card only |
| GET | `/api/orders/:id?email=` | Customer read of their order |
| POST | `/api/stripe/webhook` | Raw body, Stripe signature |
| GET | `/api/admin/orders` | `Authorization: Bearer <ADMIN_TOKEN>` |
| POST | `/api/admin/catalogue/import` | `{ csv, replace }` |

## Tests

```bash
npm test
```

The API test boots an in-memory server, indexes the knowledge base, and checks mock chat for a Vaillant ecoTEC plus 831 F.24 (Gas Safe note, a real catalogue part, a cited note), description search, GC search, the 24V diverter-motor caution, the 178985 collision, simulated checkout, the generated DHS email, admin auth, and CSV import.
