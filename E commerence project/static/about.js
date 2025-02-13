// Get cart count from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCount = document.getElementById('cartCount');

if (cartCount) {
    cartCount.textContent = cart.length; // Corrected assignment
}

// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to sections when they come into view
const sections = document.querySelectorAll('.about-section');
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.5s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.style.opacity = '0';
    observer.observe(section);
});
