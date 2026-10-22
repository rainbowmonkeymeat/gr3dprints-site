# Stripe Checkout setup

Hosted Stripe Checkout is wired up. The shop stays on Cloudflare Pages. The new endpoint is a Pages Function, which runs on Cloudflare’s worker runtime next to the existing site. A separate Workers project is not required.

The Checkout button in the cart posts to that function. The function creates a Checkout Session and redirects the customer to Stripe’s full-page payment page.

These steps need a person. The agent cannot click through the Stripe or Cloudflare dashboards, and it must not be given the secret key.

## Values to Replace

The following values are placeholders and must be updated before going live.

**Files containing placeholders:**

- [functions/api/create-checkout-session.js](functions/api/create-checkout-session.js)
- [.env.example](.env.example)


| Field              | Current Value                                        | What to Set                                                                                                                                                                                                               |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mode               | payment                                              | Keep `"payment"`. Prints are one-time charges, not subscriptions.                                                                                                                                                         |
| success_url        | `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}` | The page customers should land on after paying. Keep the `{CHECKOUT_SESSION_ID}` template. A working value is `https://gr3dprints.com/shop.html?checkout=success&session_id={CHECKOUT_SESSION_ID}` once that page exists. |
| cancel_url         | `${DOMAIN}`                                          | The page customers should return to if they back out of payment. A working value is `https://gr3dprints.com/shop.html`.                                                                                                   |
| line_items[].price | price_...                                            | A real Stripe Price ID from the [Prices page](https://dashboard.stripe.com/test/prices). The button does not send the cart contents yet. Until this is a real Price ID, Checkout will fail.                               |
| DOMAIN             | [http://localhost:8788](http://localhost:8788)       | The public site origin, `https://gr3dprints.com`, in the Cloudflare environment variable of the same name. This is only used while success_url and cancel_url still read `DOMAIN`.                                        |




## Configured Parameters

These parameters were configured in Checkout Studio and are already set in the session call.

**Files containing these parameters:**

- [functions/api/create-checkout-session.js](functions/api/create-checkout-session.js)


| Parameter                  | Value                              |
| -------------------------- | ---------------------------------- |
| ui_mode                    | hosted_page                        |
| billing_address_collection | auto                               |
| phone_number_collection    | `{ enabled: false }`               |
| automatic_tax              | `{ enabled: true }`                |
| allow_promotion_codes      | false                              |
| submit_type                | auto                               |
| consent_collection         | `{ terms_of_service: "required" }` |
| locale                     | en                                 |
| integration_identifier     | hosted_web_0001                    |
| origin_context             | web                                |


`payment_method_collection` was configured as `always` in Checkout Studio. It is omitted because Stripe only accepts that parameter when `mode` is `subscription`. This shop uses `payment`.

`ui_mode` is `hosted_page` because the installed Stripe SDK is 23.0.1. SDK versions below 21.0.0 would need `hosted` instead. Do not downgrade the `stripe` package below 21 without changing that value.

## Setup and next steps



### 1. Stripe account settings

Do this in the Stripe Dashboard while the account is still in test mode.

1. Open [API keys](https://dashboard.stripe.com/test/apikeys). Copy the secret key (`sk_test_...`). Do not put it in the website files or in chat.
2. Turn on [Stripe Tax](https://dashboard.stripe.com/test/settings/tax). `automatic_tax` is enabled, and Checkout returns an error until Tax is activated and the head office address is saved.
3. In Checkout settings, set the terms of service URL to `https://gr3dprints.com/terms.html`. `consent_collection.terms_of_service` is `required`, so Stripe will not show Checkout until that URL is saved. Publish the terms page before relying on this.
4. Create a Price for each print you sell: [Product catalog](https://dashboard.stripe.com/test/products) → Add product → one-time price. Copy each `price_...` ID.
5. Replace `price_...` in [functions/api/create-checkout-session.js](functions/api/create-checkout-session.js). For more than one print, build `line_items` from the cart (`{ id, qty }` in the browser) by mapping each shop product to its Price ID on the server. Do not trust prices sent from the browser.



### 2. Cloudflare Pages

Stay on the current Pages project. Do not create a separate Worker unless you want to leave Pages.

1. Deploy this commit, including the `functions/` folder and `package.json`. Pages installs `stripe` and publishes `functions/api/create-checkout-session.js` as `https://gr3dprints.com/api/create-checkout-session`.
2. Build settings: leave the build command empty, and set the build output directory to the project root (`/`). The site is still the HTML files at the root. If Pages fills in `npm run build` because it sees `package.json`, clear that command. There is no build script.
3. Settings → Environment variables. Add these for Production and Preview. The names must match the code exactly.
  - `STRIPE_SECRET_KEY` = the `sk_test_...` key
  - `DOMAIN` = `https://gr3dprints.com` (no trailing slash)
4. Settings → Functions → Compatibility flags. Add `nodejs_compat`. The same flag is in [wrangler.toml](wrangler.toml). Set the compatibility date to `2026-10-22` or later.
5. Direct Upload of the folder does not install npm packages for Functions. Use the Git connection, or run `npx wrangler pages deploy .` from this folder after `npx wrangler login`.

Local check, optional:

1. Copy [.env.example](.env.example) to `.dev.vars` and paste the test secret key.
2. Run `npx wrangler pages dev .`
3. Open the local URL, add a print, and press Checkout.



### 3. How a payment flows

1. The customer adds prints and presses Checkout in the cart.
2. The browser posts to `/api/create-checkout-session`.
3. The Pages Function creates a hosted Checkout Session and redirects to `session.url`.
4. The customer pays on Stripe’s page.
5. Stripe sends them to `success_url`, or back to `cancel_url` if they leave.



### 4. Test cards

Use test mode until a real order looks right. Cards: [https://docs.stripe.com/testing](https://docs.stripe.com/testing).

- Success: `4242 4242 4242 4242`
- Any future expiry, any 3-digit CVC, any postal code

Switch `STRIPE_SECRET_KEY` to the live secret key (`sk_live_...`) only after a test payment succeeds. Create live Prices too. Test and live Price IDs are not interchangeable.

### 5. Still to build

- Replace the placeholder Price ID, then pass the real cart instead of a single sample line.
- Add a success page and point `success_url` at it.
- Fulfill the order (print and pickup or shipping). The function does not record orders. A webhook can do that later. It is not set up.
- Fill in [privacy.html](privacy.html) and [terms.html](terms.html) before accepting live payments.



### Resources

- [https://support.stripe.com](https://support.stripe.com)
- [https://docs.stripe.com/mcp](https://docs.stripe.com/mcp)
- [https://docs.stripe.com/checkout/quickstart](https://docs.stripe.com/checkout/quickstart)
- [https://developers.cloudflare.com/pages/functions/](https://developers.cloudflare.com/pages/functions/)

