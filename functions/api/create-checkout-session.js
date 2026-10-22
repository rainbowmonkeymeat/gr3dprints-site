export async function onRequestPost(context) {
    const { env } = context;
    const mode = "payment";
    const params = new URLSearchParams({
        ui_mode: "hosted_page",
        billing_address_collection: "auto",
        "phone_number_collection[enabled]": "false",
        "automatic_tax[enabled]": "true",
        allow_promotion_codes: "false",
        submit_type: "auto",
        "consent_collection[terms_of_service]": "required",
        locale: "en",
        integration_identifier: "hosted_web_0001",
        origin_context: "web",
        mode,
        success_url: `${env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.DOMAIN}`,
        "line_items[0][price]": "price_...",
        "line_items[0][quantity]": "1",
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });
    const session = await response.json();

    if (!response.ok) {
        const message = session.error && session.error.message
            ? session.error.message
            : "Stripe Checkout could not be started.";
        return new Response(message, { status: 500 });
    }

    return Response.redirect(session.url, 303);
}
