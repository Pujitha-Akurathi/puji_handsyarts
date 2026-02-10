document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(18, 18, 18, 1)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        } else {
            navbar.style.background = 'rgba(18, 18, 18, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Cart Sidebar Toggle
    const cartIcon = document.querySelector('.cart-icon');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');

    function toggleCart() {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }

    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
    });

    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Button Animation Listener
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn') || e.target.classList.contains('add-to-cart-btn') || e.target.classList.contains('checkout-btn')) {
            const btn = e.target;
            btn.classList.add('btn-clicked');
            setTimeout(() => {
                btn.classList.remove('btn-clicked');
            }, 200);
        }
    });

    // Dynamic Collection Loading Logic
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    const galleryGrid = document.getElementById('gallery-grid');

    if (categoryId && galleryGrid && typeof collectionsData !== 'undefined') {
        const data = collectionsData[categoryId];
        if (data) {
            // Update Title & Description
            document.title = `${data.title} | Puji_handsyarts`;
            document.getElementById('collection-title').innerText = data.title;
            document.getElementById('collection-desc').innerText = data.description;

            // Render Images
            galleryGrid.innerHTML = '';
            data.images.forEach(imgPath => {
                const item = document.createElement('div');
                item.classList.add('gallery-item');
                item.innerHTML = `
                    <img src="${imgPath}" alt="${data.title}" loading="lazy">
                    <div class="gallery-item-info">
                        <button class="btn btn-primary btn-block" onclick="enquireWhatsApp('${imgPath}', '${data.title}')">
                            Enquire on WhatsApp <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                `;
                galleryGrid.appendChild(item);
            });
        } else {
            galleryGrid.innerHTML = '<div class="error-msg">Collection not found.</div>';
        }
    }
});

function enquireWhatsApp(imagePath, collectionName) {
    const fullUrl = window.location.origin + '/' + imagePath;
    const message = `Hello! I'm interested in this piece from the *${collectionName}* collection: ${fullUrl}`;
    const whatsappUrl = `https://wa.me/917207460614?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Cart Logic
let cart = JSON.parse(localStorage.getItem('banglesCart')) || [];
const whatsappNumber = "7207460614";

function addToCart(name, price, image) {
    const item = {
        id: Date.now(), // Unique ID for simple removal
        name: name,
        price: price,
        image: image
    };

    cart.push(item);
    saveCart();
    updateCartUI();

    // Animate Cart Icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.3) rotate(-10deg)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1) rotate(0deg)';
    }, 300);

    // Open cart sidebar automatically to show feedback
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    if (!cartSidebar.classList.contains('active')) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('banglesCart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.querySelector('.cart-count');
    const cartTotalElement = document.getElementById('cart-total');

    // Update Count
    cartCountElement.innerText = cart.length;

    // Calculate Total
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalElement.innerText = '₹' + total.toLocaleString('en-IN');

    // Render Items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your bag is currently empty. <br> Start adding some sparkle! ✨</div>';
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price.toLocaleString('en-IN')}</p>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
}

// Modal & Checkout Logic
const checkoutModal = document.getElementById('checkout-modal');
const closeModalBtn = document.getElementById('close-modal');

function openCheckoutModal() {
    if (cart.length === 0) {
        alert("Your bag is empty! Please add items before checking out.");
        return;
    }
    // Close sidebar first
    document.getElementById('cart-sidebar').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');

    // Open modal
    checkoutModal.classList.add('active');
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeCheckoutModal);
}

// Close modal on outside click
if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            closeCheckoutModal();
        }
    });
}

function checkoutWhatsApp() {
    openCheckoutModal();
}

function submitCheckout(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;

    if (!name || !address) {
        alert("Please fill in all details.");
        return;
    }

    let message = `*New Order Request*%0A%0A`;
    message += `*Customer Details:*%0A`;
    message += `Name: ${name}%0A`;
    message += `Address: ${address}%0A%0A`;

    message += `*Order Summary:*%0A`;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ₹${item.price}%0A`;
    });

    let total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `%0A*Total Amount: ₹${total}*`;
    message += "%0A%0APlease confirm availability and payment details.";

    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, '_blank');

    closeCheckoutModal();
}

// Initial Render
updateCartUI();
