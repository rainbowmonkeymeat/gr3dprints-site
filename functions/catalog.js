// Server catalog for Checkout. The browser sends product ids and quantities only.
// The amount charged is unitAmount, in cents. Never a price from the browser.
// available  false rejects the item at checkout

export const CATALOG = [
    {
        id: "sea-turtle",
        name: "Articulated Sea Turtle",
        unitAmount: 500,
        available: true,
    },
    {
        id: "flower-dragon",
        name: "Flower Dragon",
        unitAmount: 4000,
        available: true,
    },
    {
        id: "articulated-unicorn",
        name: "Articulated Unicorn",
        unitAmount: 500,
        available: true,
    },
];
