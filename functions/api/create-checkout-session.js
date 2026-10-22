import Stripe from "stripe";

export async function onRequestPost(context) {
    const { env } = context;
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        httpClient: Stripe.createFetchHttpClient(),
    });

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
            success_url: `${env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${env.DOMAIN}`,
            line_items: [{ price: "price_...", quantity: 1 }],
        });

        return Response.redirect(session.url, 303);
    } catch (error) {
        const message = error && error.type
            ? error.message
            : "Stripe Checkout could not be started.";
        return new Response(message, { status: 500 });
    }
}
