// Load cart data from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartTotal = 0;

// DOM Elements
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalElement = document.getElementById('cartTotal');
const cartSubtotalElement = document.getElementById('cartSubtotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const successModal = document.getElementById('successModal');

// Update cart display
function updateCart() {
    cartCount.textContent = cart.length;
    cartTotal = cart.reduce((total, item) => total + item.price, 0);
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    cartSubtotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
        </div>
    `).join('');
}

// Remove item from cart
window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Generate random order number
function generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FEEL-${timestamp}-${random}`;
}

// Event listeners
checkoutBtn.addEventListener('click', () => {
    checkoutModal.style.display = 'block';
});

closeCheckout.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
});

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Hide checkout modal
    checkoutModal.style.display = 'none';
    
    // Generate and display order number
    const orderNumber = generateOrderNumber();
    document.getElementById('orderNumber').textContent = orderNumber;
    
    // Show success modal with animation
    successModal.style.display = 'block';
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    
    // Reset form
    checkoutForm.reset();
    
    // Add confetti effect (optional animation)
    const colors = ['#d4af37', '#ffffff', '#0a1551'];
    for (let i = 0; i < 100; i++) {
        createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }
});

// Confetti animation
function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.borderRadius = '50%';
    confetti.style.zIndex = '2001';
    document.body.appendChild(confetti);

    const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0)', opacity: 1 },
        { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
        duration: Math.random() * 2000 + 1000,
        easing: 'cubic-bezier(.37,0,.63,1)'
    });

    animation.onfinish = () => confetti.remove();
}

// Initialize cart display
updateCart();