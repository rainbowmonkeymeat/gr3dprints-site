# Stripe Checkout setup

The shop is moving to Square. The website only links to that store. Do not continue this Checkout setup unless a Stripe shop is explicitly requested again.

Hosted Stripe Checkout was wired up. The shop stays on Cloudflare Pages. The new endpoint is a Pages Function, which runs on Cloudflare’s worker runtime next to the existing site. A separate Workers project is not required.

The Checkout button in the cart posts to that function. The function creates a Checkout Session and redirects the customer to Stripe’s full-page payment page.

These steps need a person. The agent cannot click through the Stripe or Cloudflare dashboards, and it must not be given the secret key.

## Values to Replace

Prices and `DOMAIN` are set.

| Print | Amount |
| ----- | ------ |
| Articulated Sea Turtle | $5.00 |
| Articulated Unicorn | $5.00 |
| Flower Dragon | $40.00 |

The shop shows those amounts from [products.js](products.js). Checkout charges the same amounts from `unitAmount` in [functions/catalog.js](functions/catalog.js) (500, 500, and 4000 cents). Tax is added at Checkout.

`DOMAIN` is `https://gr3dprints.com` in [wrangler.toml](wrangler.toml). `STRIPE_SECRET_KEY` stays a Pages secret. Do not put that key in `wrangler.toml`.

`mode` is `payment`. `success_url` is `${DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`. `cancel_url` is `${DOMAIN}/shop.html`. `line_items` is the cart. Those are already real values, so they stay.




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

`ui_mode` is `hosted_page`, which is the current Stripe API value for a full-page Checkout. The function uses the Stripe Node SDK (`stripe` 23.0.1), which sends API version `2026-09-30.endive`. Pages must install that package before it bundles the function.

## Setup and next steps



### 1. Stripe account settings

Do this in the Stripe Dashboard while the account is still in test mode.

1. Open [API keys](https://dashboard.stripe.com/test/apikeys) and create a restricted key (`rk_test_...`) that can write Checkout Sessions. A restricted key is safer than the account’s full secret key. The Pages variable is still named `STRIPE_SECRET_KEY`. Do not put the key in the website files or in chat.
2. Turn on [Stripe Tax](https://dashboard.stripe.com/test/settings/tax). `automatic_tax` is enabled, and Checkout returns an error until Tax is activated and the head office address is saved.
3. In Checkout settings, set the terms of service URL to `https://gr3dprints.com/terms.html`. `consent_collection.terms_of_service` is `required`, so Stripe will not show Checkout until that URL is saved. The page has a draft of the shop’s terms. Read it and change anything that does not match how you actually sell, then publish that version before relying on the checkbox.
4. Prices are already in [functions/catalog.js](functions/catalog.js): sea turtle $5, unicorn $5, flower dragon $40. You do not create a separate Stripe Price for each print.



### 2. Cloudflare Pages

Stay on the current Pages project. The reason is in [AGENTS.md](AGENTS.md). The dashboard clicks for a new or existing Pages project are in [README.md](README.md).

1. Settings → Builds & deployments → Build configuration. Set the build command to `npm ci`. Set the build output directory to the project root (`/`). Pages installs `package.json` only when a build command is set. An empty command skips the install, and the function build fails with `Could not resolve "stripe"`.
2. Deploy this commit, including the `functions/` folder and `package-lock.json`. Pages publishes `functions/api/create-checkout-session.js` as `https://gr3dprints.com/api/create-checkout-session`. `.assetsignore` keeps `node_modules` off the public site after the install.
3. Settings → Environment variables. Add this for Production and Preview. The name must match the code exactly. `DOMAIN` is already in [wrangler.toml](wrangler.toml). Do not put the secret key in that file.
  - `STRIPE_SECRET_KEY` = the `rk_test_...` key
4. Settings → Functions → Compatibility flags. Add `nodejs_compat`. The same flag is in [wrangler.toml](wrangler.toml). Set the compatibility date to `2026-10-22` or later. The SDK needs this flag because it runs on the Workers runtime.
5. Direct Upload of the folder does not install npm packages for Functions. Use the Git connection, or run `npm ci` and then `npx wrangler pages deploy .` from this folder after `npx wrangler login`.

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

- Fulfill the order from a webhook, not from [success.html](success.html). Handle `checkout.session.completed` and `checkout.session.async_payment_succeeded`, and print or ship only when `payment_status` is not `unpaid`. Verify the Stripe signature. This handler is required before launch. It is not set up.
- Read the draft in [terms.html](terms.html) and fill in [privacy.html](privacy.html) before accepting live payments.



### Resources

- [https://support.stripe.com](https://support.stripe.com)
- [https://docs.stripe.com/mcp](https://docs.stripe.com/mcp)
- [https://docs.stripe.com/checkout/quickstart](https://docs.stripe.com/checkout/quickstart)
- [https://developers.cloudflare.com/pages/functions/](https://developers.cloudflare.com/pages/functions/)

