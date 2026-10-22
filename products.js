// Shop catalog. Add, edit, or remove objects in this list.
// The shop page and the homepage preview both read from here.
//
// id           short unique slug, also used in the product link
// name         card title
// description  short blurb on the card
// image        path to a photo in this project
// price        dollars, or null until you set one
// available    false marks the item sold out
// featured     true also shows the item on the homepage
const PRODUCTS = [
    {
        id: 'sea-turtle',
        name: 'Articulated Sea Turtle',
        description: 'A small poseable turtle with a two-color shell. Printed to order, so you can pick the colors.',
        image: 'photos/IMG_0400-EDIT.jpg',
        price: null,
        available: true,
        featured: true
    },
    {
        id: 'flower-dragon',
        name: 'Flower Dragon',
        description: 'A poseable dragon with printed flowers along the back. A show favorite when we have them on the table.',
        image: 'photos/IMG_6631-EDIT.jpg',
        price: null,
        available: true,
        featured: true
    },
    {
        id: 'articulated-unicorn',
        name: 'Articulated Unicorn',
        description: 'A tiny poseable unicorn, printed in the colors you want. Nice as a gift or a desk companion.',
        image: 'photos/IMG_1077.JPG',
        price: null,
        available: true,
        featured: true
    }
];
