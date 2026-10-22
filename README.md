# GR3D Prints

Static site for the GR3D Prints shop (Rainbow Monkey Meat LLC, Wayland, Michigan). It is hosted on Cloudflare Pages at [gr3dprints.com](https://gr3dprints.com).

The shop, cart, terms, and privacy pages are plain HTML, CSS, and JavaScript. Checkout is a Pages Function that creates a Stripe Checkout Session with the Stripe Node SDK. Stay on Pages. The reason, and when a move to Workers would be worth it, is in [AGENTS.md](AGENTS.md).

## Project files

```
index.html              Homepage
shop.html               Catalog and product pages
store.html              Redirect to shop.html
terms.html              Terms of service
privacy.html            Privacy policy
products.js             Catalog data
script.js               Cart and page behavior
styles.css
photos/
functions/api/create-checkout-session.js
wrangler.toml           Pages compatibility and output directory
package.json            Stripe SDK
package-lock.json
.assetsignore           Keeps node_modules off the public site
.env.example            Variable names only. No real keys.
```

## Local preview

From this folder:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. This serves the pages only. Checkout needs the Pages Function and a Stripe key. For that, copy `.env.example` to `.dev.vars`, paste a test key, and run `npx wrangler pages dev .`. Remaining Stripe steps are in [STRIPE_INTEGRATION_TODO.md](STRIPE_INTEGRATION_TODO.md).

## Cloudflare Pages

Production deploys from the `main` branch. The build command is a dashboard setting. `wrangler.toml` does not contain it, and a `[build]` block in that file is for Workers, not Pages.

### Existing project

1. Open the Cloudflare dashboard and select the **gr3dprints-site** Pages project.
2. Go to **Settings → Builds & deployments → Build configuration**.
3. Set **Build command** to `npm ci`.
4. Save, then retry the deployment (**Deployments → Retry deployment**, or push a commit to `main`).

Leave the build output directory as the project root (`/`). If that field is locked, leave it. [wrangler.toml](wrangler.toml) sets `pages_build_output_dir = "./"`, which is the same directory, and that file is the source of truth for it.

`npm ci` is required. Pages installs dependencies only when a build command is set. The checkout function imports `stripe`. With an empty command, the log says `No build command specified. Skipping build step.` and then `Could not resolve "stripe"`. The whole deploy fails, including HTML pages.

After install, `.assetsignore` keeps `node_modules` from being published as part of the site.

### New project

1. In Cloudflare, create a Pages project and connect the GitHub repository `rainbowmonkeymeat/gr3dprints-site`.
2. Production branch: `main`.
3. Framework preset: **None**.
4. Build command: `npm ci`.
5. Build output directory: `/`.
6. Root directory: the repository root. Leave it blank.
7. Save and deploy.
8. **Settings → Environment variables**, for both Production and Preview: `STRIPE_SECRET_KEY` = a Stripe restricted key (`rk_test_...` until a live payment is ready). `DOMAIN` is already `https://gr3dprints.com` in [wrangler.toml](wrangler.toml). Do not put the secret key in that file.
9. Compatibility date and `nodejs_compat` come from [wrangler.toml](wrangler.toml). On a project that is not using that file, set the same values under **Settings → Functions**: compatibility date `2026-10-22` or later, and the `nodejs_compat` flag.
10. Attach the custom domain `gr3dprints.com`.

Direct Upload does not install npm packages for Functions. Use the Git connection, or run `npm ci` and then `npx wrangler pages deploy .` after `npx wrangler login`.

Stripe Tax and the terms URL are set in the Stripe Dashboard. Prices are in [functions/catalog.js](functions/catalog.js). Remaining steps are in [STRIPE_INTEGRATION_TODO.md](STRIPE_INTEGRATION_TODO.md).
