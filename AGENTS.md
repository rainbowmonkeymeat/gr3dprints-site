# GR3D Prints

## Git

Commit to `main`. Production deploys from that branch. Open a branch or pull request only when one was explicitly requested.

## Hosting

Stay on Cloudflare Pages. Do not move this site to a Worker to fix the build command or the Stripe package install.

The site is static HTML, CSS, and JavaScript, plus one Pages Function at `functions/api/create-checkout-session.js`. That function uses the Stripe Node SDK. Pages installs `package.json` only when a build command is set. The command is `npm ci`. It cannot be stored in `wrangler.toml`. Set it in the Pages dashboard. An empty command skips the install, and the deploy fails with `Could not resolve "stripe"`.

`wrangler.toml` sets the project name, `pages_build_output_dir` (`./`, the site root), the compatibility date, and `nodejs_compat`. A `[build]` section is for Workers. Pages rejects it.

Move to Workers with a static assets directory only when the shop needs the build command committed in git, or a webhook to fulfill orders. That change is a new Worker, a cutover of `gr3dprints.com`, and entering `STRIPE_SECRET_KEY` and `DOMAIN` again. Serve real files only. Do not use the setting that sends every missing path to `index.html`. That fallback made `/terms.html` show the homepage before the file existed.

Setup steps for a new Pages project are in `README.md`. Stripe dashboard steps are in `STRIPE_INTEGRATION_TODO.md`.
