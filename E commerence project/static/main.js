// Sample product data with luxury items
const products = [
    {
        id: 1,
        name: "Luxury Smart Watch",
        price: 599.99,
        description: "Premium smartwatch with gold finish and leather strap",
        image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500",
        category: "electronics"
    },
    {
        id: 2,
        name: "Designer Handbag",
        price: 1299.99,
        description: "Handcrafted leather bag with gold hardware",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        category: "fashion"
    },
    {
        id: 3,
        name: "Gold Bracelet",
        price: 899.99,
        description: "18K gold bracelet with diamond accents",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500",
        category: "jewelry"
    },
    {
        id: 4,
        name: "Premium Sunglasses",
        price: 449.99,
        description: "Luxury sunglasses with gold-plated frames",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
        category: "accessories"
    }
  ];
  
  // Initialize chatbot
  window.addEventListener("DOMContentLoaded", function() {
    window.AgentInitializer.init({
        rootId: "JotformAgent-0194fc0165cc7da1bc7aabdbccf5574f98b4",
        formID: "0194fc0165cc7da1bc7aabdbccf5574f98b4",
        queryParams: ["skipWelcome=1", "maximizable=1"],
        domain: "https://www.jotform.com",
        isInitialOpen: false,
        isDraggable: false,
        background: "linear-gradient(180deg, #C8CEED 0%, #C8CEED 100%)",
        buttonBackgroundColor: "#0a1551",
        buttonIconColor: "#fff",
        variant: false,
        customizations: {
            greeting: "Yes",
            greetingMessage: "Welcome to FEEL! How can I assist you today?",
            pulse: "Yes",
            position: "right"
        }
    });
  });
  
  // Cart functionality
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = document.getElementById('cartCount');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const productsGrid = document.getElementById('products');
  
  // Display products with animation
  function displayProducts(productsToShow = products) {
    productsGrid.innerHTML = '';
    productsToShow.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s backwards`;
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
  }
  
  // Add to cart with animation
  window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Animation feedback
        const button = event.target;
        button.textContent = 'Added!';
        button.style.backgroundColor = '#27ae60';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
        }, 1000);
    }
  }
  
  // Update cart count
  function updateCartCount() {
    cartCount.textContent = cart.length;
  }
  
  // Search and filter functionality
  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === '' || product.category === category;
        return matchesSearch && matchesCategory;
    });
    
    displayProducts(filtered);
  }
  
  // Event listeners
  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
  
  // Initialize the store
  displayProducts();
  updateCartCount();