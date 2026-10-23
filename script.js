// Paste the Square Online shop link here. Every Shop menu item and button uses it.
const SQUARE_SHOP_URL = "https://gr3dprints.square.site";

function applyShopLinks() {
    if (!SQUARE_SHOP_URL) {
        return;
    }
    document.querySelectorAll("a.shop-link").forEach(link => {
        link.href = SQUARE_SHOP_URL;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });
    if (/(^|\/)shop\.html$/.test(location.pathname)) {
        location.replace(SQUARE_SHOP_URL);
    }
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form submission handling for Formspree
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Let Formspree handle the submission
        // We'll just show a loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Formspree will handle the redirect and success message
        // We'll reset the button after a delay in case of errors
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 5000);
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.portfolio-item, .about-content, .contact-content');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Add hover effects for portfolio items
document.addEventListener('DOMContentLoaded', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Contact form field validation
document.addEventListener('DOMContentLoaded', () => {
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            return false;
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            field.classList.add('error');
            return false;
        }
    }
    
    return true;
}

// Add CSS for form validation
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
`;
document.head.appendChild(style);

// Add scroll-to-top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #2563eb;
    color: white;
    border: none;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    font-size: 1.2rem;
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll-to-top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll-to-top button
scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'translateY(-3px)';
    scrollToTopBtn.style.boxShadow = '0 5px 15px rgba(37, 99, 235, 0.3)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'translateY(0)';
    scrollToTopBtn.style.boxShadow = 'none';
});

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatPrice(price) {
    if (typeof price !== 'number' || Number.isNaN(price)) {
        return '';
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

const CART_KEY = 'gr3d-cart';

function productList() {
    return typeof PRODUCTS === 'undefined' ? [] : PRODUCTS;
}

function findProduct(id) {
    return productList().find(product => product.id === id);
}

function renderProductCard(product) {
    const price = formatPrice(product.price);
    const soldOut = product.available === false;
    const action = soldOut
        ? '<span class="btn btn-solid is-disabled">Sold out</span>'
        : `<button type="button" class="btn btn-solid add-to-cart" data-product-id="${escapeHtml(product.id)}">Add to cart</button>`;

    return `
        <article class="product-card${soldOut ? ' is-sold-out' : ''}">
            <a class="product-link" href="shop.html#${encodeURIComponent(product.id)}">
                <div class="product-image">
                    <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="product-img">
                    ${soldOut ? '<span class="product-badge">Sold out</span>' : ''}
                </div>
                <div class="product-body">
                    <h3>${escapeHtml(product.name)}</h3>
                    ${price ? `<p class="product-price">${escapeHtml(price)}</p>` : ''}
                    <p class="product-description">${escapeHtml(product.description)}</p>
                </div>
            </a>
            <div class="product-actions">
                ${action}
            </div>
        </article>
    `;
}

function renderProductDetail(product) {
    const price = formatPrice(product.price);
    const soldOut = product.available === false;
    const action = soldOut
        ? '<span class="btn btn-solid is-disabled">Sold out</span>'
        : `<button type="button" class="btn btn-solid add-to-cart" data-product-id="${escapeHtml(product.id)}">Add to cart</button>`;

    return `
        <a class="product-back" href="shop.html">All prints</a>
        <div class="product-detail-image">
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
        </div>
        <div class="product-detail-info">
            <h2>${escapeHtml(product.name)}</h2>
            ${price ? `<p class="product-price">${escapeHtml(price)}</p>` : ''}
            <p>${escapeHtml(product.description)}</p>
            ${action}
        </div>
    `;
}

function renderShop() {
    const featured = document.getElementById('featured-products');
    if (featured && productList().length) {
        const items = productList().filter(product => product.featured);
        if (items.length) {
            featured.innerHTML = items.map(renderProductCard).join('');
        }
    }

    const catalog = document.getElementById('shop-catalog');
    if (catalog && productList().length) {
        catalog.innerHTML = productList().map(renderProductCard).join('');
    }

    showProductFromHash();
}

function showProductFromHash() {
    const catalog = document.getElementById('shop-catalog');
    const detail = document.getElementById('product-detail');
    if (!catalog || !detail) {
        return;
    }

    const id = decodeURIComponent(location.hash.replace(/^#/, ''));
    const product = findProduct(id);
    if (!product) {
        detail.hidden = true;
        detail.innerHTML = '';
        catalog.hidden = false;
        return;
    }

    detail.innerHTML = renderProductDetail(product);
    detail.hidden = false;
    catalog.hidden = true;
}

function readCart() {
    try {
        const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.filter(item => item && item.id && item.qty > 0);
    } catch (error) {
        return [];
    }
}

function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    renderCart();
}

function addToCart(id) {
    const product = findProduct(id);
    if (!product || product.available === false) {
        return;
    }
    const cart = readCart();
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, qty: 1 });
    }
    writeCart(cart);
    openCart();
}

function changeQty(id, delta) {
    const cart = readCart()
        .map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter(item => item.qty > 0);
    writeCart(cart);
}

function removeFromCart(id) {
    writeCart(readCart().filter(item => item.id !== id));
}

function renderCart() {
    const items = readCart();
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count').forEach(badge => {
        badge.textContent = String(count);
        badge.classList.toggle('is-empty', count === 0);
    });

    const list = document.querySelector('.cart-items');
    const totalEl = document.querySelector('.cart-total');
    if (!list || !totalEl) {
        return;
    }

    const checkoutForm = document.querySelector('.cart-checkout');
    if (checkoutForm) {
        checkoutForm.hidden = items.length === 0;
    }

    if (!items.length) {
        list.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        totalEl.textContent = '';
        return;
    }

    let total = 0;
    let everyItemHasPrice = true;
    list.innerHTML = items.map(item => {
        const product = findProduct(item.id);
        const name = product ? product.name : 'Unavailable print';
        const image = product ? product.image : '';
        const price = product ? formatPrice(product.price) : '';
        if (product && typeof product.price === 'number') {
            total += product.price * item.qty;
        } else {
            everyItemHasPrice = false;
        }
        return `
            <div class="cart-row">
                ${image ? `<img src="${escapeHtml(image)}" alt="" class="cart-thumb">` : ''}
                <div class="cart-row-info">
                    <h3>${escapeHtml(name)}</h3>
                    ${price ? `<p class="product-price">${escapeHtml(price)}</p>` : ''}
                    <div class="cart-qty">
                        <button type="button" data-cart-action="decrease" data-product-id="${escapeHtml(item.id)}" aria-label="Decrease quantity">−</button>
                        <span>${item.qty}</span>
                        <button type="button" data-cart-action="increase" data-product-id="${escapeHtml(item.id)}" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button type="button" class="cart-remove" data-cart-action="remove" data-product-id="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(name)}">×</button>
            </div>
        `;
    }).join('');

    totalEl.textContent = everyItemHasPrice ? `Total ${formatPrice(total)}` : '';
}

function mountCart() {
    if (!document.getElementById('cart-drawer')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="cart-drawer" class="cart-drawer" hidden>
                <button type="button" class="cart-backdrop" aria-label="Close cart"></button>
                <aside class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
                    <div class="cart-header">
                        <h2 id="cart-title">Cart</h2>
                        <button type="button" class="cart-close" aria-label="Close cart">×</button>
                    </div>
                    <div class="cart-items"></div>
                    <p class="cart-total"></p>
                    <form class="cart-checkout" method="POST" action="/api/create-checkout-session" hidden>
                        <button type="submit" class="btn btn-solid">Checkout</button>
                    </form>
                </aside>
            </div>
        `);
        document.querySelector('.cart-close').addEventListener('click', closeCart);
        document.querySelector('.cart-backdrop').addEventListener('click', closeCart);
        const checkoutForm = document.querySelector('.cart-checkout');
        checkoutForm.addEventListener('submit', () => {
            checkoutForm.querySelectorAll('[data-cart-line]').forEach(input => input.remove());
            readCart().forEach(item => {
                const idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.name = 'line_id';
                idInput.value = item.id;
                idInput.dataset.cartLine = 'true';
                const qtyInput = document.createElement('input');
                qtyInput.type = 'hidden';
                qtyInput.name = 'line_qty';
                qtyInput.value = String(item.qty);
                qtyInput.dataset.cartLine = 'true';
                checkoutForm.append(idInput, qtyInput);
            });
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeCart();
            }
        });
    }

    document.querySelectorAll('.cart-toggle').forEach(button => {
        if (button.dataset.bound === 'true') {
            return;
        }
        button.dataset.bound = 'true';
        button.addEventListener('click', openCart);
    });
    renderCart();
}

function openCart() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) {
        return;
    }
    drawer.hidden = false;
    document.body.classList.add('cart-open');
    const closeButton = drawer.querySelector('.cart-close');
    if (closeButton) {
        closeButton.focus();
    }
}

function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer || drawer.hidden) {
        return;
    }
    drawer.hidden = true;
    document.body.classList.remove('cart-open');
}

document.addEventListener('click', event => {
    const addButton = event.target.closest('.add-to-cart');
    if (addButton) {
        addToCart(addButton.dataset.productId);
        return;
    }

    const actionButton = event.target.closest('[data-cart-action]');
    if (!actionButton) {
        return;
    }
    const id = actionButton.dataset.productId;
    const action = actionButton.dataset.cartAction;
    if (action === 'increase') {
        changeQty(id, 1);
    } else if (action === 'decrease') {
        changeQty(id, -1);
    } else if (action === 'remove') {
        removeFromCart(id);
    }
});

window.addEventListener('hashchange', showProductFromHash);

function clearCartAfterPayment() {
    if (document.body.dataset.clearCart !== 'paid') {
        return;
    }
    const sessionId = new URLSearchParams(location.search).get('session_id');
    if (sessionId) {
        localStorage.removeItem(CART_KEY);
    }
}

function startShop() {
    applyShopLinks();
    renderShop();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startShop);
} else {
    startShop();
} 