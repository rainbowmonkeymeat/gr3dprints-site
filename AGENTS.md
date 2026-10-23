# GR3D Prints

## Git

Commit to `main`. Production deploys from that branch. Open a branch or pull request only when one was explicitly requested.

## Shop

The online shop is the Square store at `https://gr3dprints.square.site`. This site only links to it. Menu items and buttons with the class `shop-link` go to `SQUARE_SHOP_URL` in `script.js`. Do not rebuild the cart or Stripe Checkout unless that is explicitly requested.

## Hosting

Stay on Cloudflare Pages. The build command in the Pages dashboard is `npm ci`, and it cannot be stored in `wrangler.toml`. An empty command skips the install. Leave that command in place while `package.json` is in the repo.

`wrangler.toml` sets the project name, `pages_build_output_dir` (`./`, the site root), `DOMAIN`, the compatibility date, and `nodejs_compat`. A `[build]` section is for Workers. Pages rejects it.

Serve real files only. Do not use the setting that sends every missing path to `index.html`. That fallback made `/terms.html` show the homepage before the file existed.

Setup steps for a new Pages project are in `README.md`.
