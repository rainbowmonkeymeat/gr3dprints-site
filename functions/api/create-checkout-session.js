import Stripe from "stripe";

export async function onRequestPost(context) {
    const stripe = new Stripe(context.env.STRIPE_SECRET_KEY, {
        httpClient: Stripe.createFetchHttpClient(),
    });

    // One-time prints. payment_method_collection is only valid for subscriptions.
    const mode = "payment";

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
        mode,
        success_url: `${context.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${context.env.DOMAIN}`,
        line_items: [{ price: "price_...", quantity: 1 }],
    });

    return Response.redirect(session.url, 303);
}
