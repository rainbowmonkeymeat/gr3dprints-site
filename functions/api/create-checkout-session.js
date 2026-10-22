import Stripe from "stripe";
import { CATALOG } from "../catalog.js";

const MAX_QTY = 20;

function cartFromForm(formData) {
    const ids = formData.getAll("line_id").map(value => String(value));
    const qtys = formData.getAll("line_qty").map(value => String(value));

    if (!ids.length || ids.length !== qtys.length) {
        return { error: "Your cart is empty.", status: 400 };
    }

    const quantities = new Map();
    for (let index = 0; index < ids.length; index += 1) {
        const id = ids[index];
        const qty = Number(qtys[index]);
        if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
            return { error: "Choose a quantity from 1 to 20.", status: 400 };
        }

        const product = CATALOG.find(item => item.id === id);
        if (!product || !product.available) {
            return { error: "One of the prints in your cart is no longer available.", status: 400 };
        }
        if (!Number.isInteger(product.unitAmount) || product.unitAmount < 1) {
            return { error: `${product.name} is not ready for checkout yet.`, status: 400 };
        }

        quantities.set(id, (quantities.get(id) || 0) + qty);
    }

    const lineItems = [];
    for (const [id, qty] of quantities) {
        if (qty > MAX_QTY) {
            return { error: "Choose a quantity from 1 to 20.", status: 400 };
        }
        const product = CATALOG.find(item => item.id === id);
        lineItems.push({
            quantity: qty,
            price_data: {
                currency: "usd",
                unit_amount: product.unitAmount,
                tax_behavior: "exclusive",
                product_data: {
                    name: product.name,
                    tax_code: "txcd_99999999",
                },
            },
        });
    }

    return { lineItems };
}

export async function onRequestPost(context) {
    const { request, env } = context;

    if (!env.STRIPE_SECRET_KEY || !env.DOMAIN) {
        return new Response("Checkout is not configured.", { status: 500 });
    }

    const formData = await request.formData();
    const cart = cartFromForm(formData);
    if (cart.error) {
        return new Response(cart.error, { status: cart.status });
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        httpClient: Stripe.createFetchHttpClient(),
    });
    const origin = String(env.DOMAIN).replace(/\/$/, "");

    try {
        const session = await stripe.checkout.sessions.create({
            ui_mode: "hosted_page",
            billing_address_collection: "auto",
            phone_number_collection: { enabled: false },
            automatic_tax: { enabled: true },
            allow_promotion_codes: false,
            submit_type: "auto",
            consent_collection: { terms_of_service: "required" },
            locale: "en",
            integration_identifier: "hosted_web_0001",
            origin_context: "web",
            mode: "payment",
            success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/shop.html`,
            line_items: cart.lineItems,
        });

        return Response.redirect(session.url, 303);
    } catch (error) {
        const message = error && error.type
            ? error.message
            : "Stripe Checkout could not be started.";
        return new Response(message, { status: 500 });
    }
}
