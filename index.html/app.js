// ====================================
// ULTIMATE PRICE COMPARISON - JavaScript
// ====================================

// ========== GLOBAL VARIABLES ==========
let allProducts = {};
let displayedProducts = [];
let currentCurrency = 'INR';
const exchangeRate = 83.5;
let currentSort = 'relevance';

// ========== INITIALIZATION ==========

/**
 * Initialize application on page load
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initializing Ultimate Price Comparison...');
    await loadProducts();
    setupEventListeners();
    displayAllProducts();
    console.log('✅ Initialization complete!');
});

// ========== DATA LOADING ==========

/**
 * Load products from JSON database
 * Falls back to sample data if file not found
 */
async function loadProducts() {
    try {
        console.log('📂 Loading product database...');
        const response = await fetch('super-comparison-database.json');
        if (!response.ok) throw new Error('Database not found');
        
        const data = await response.json();
        allProducts = data.products || data || {};
        console.log(`✅ Loaded ${Object.keys(allProducts).length} products`);
    } catch(error) {
        console.log('⚠️ Database file not found, using sample data');
        loadSampleProducts();
    }
    updateProductCount();
}

/**
 * Sample products for demonstration
 * Replace with your actual data
 */
function loadSampleProducts() {
    allProducts = {
        "iPhone 15 Pro Max": [
            { 
                "platform": "Amazon.in", 
                "price": 134000, 
                "original": 159900, 
                "shipping": "Free", 
                "discount": "16%" 
            },
            { 
                "platform": "Flipkart", 
                "price": 129900, 
                "original": 159900, 
                "shipping": "Free", 
                "discount": "19%" 
            },
            { 
                "platform": "Apple Store", 
                "price": 159900, 
                "original": 159900, 
                "shipping": "Free", 
                "discount": "0%" 
            },
            { 
                "platform": "Myntra", 
                "price": 139000, 
                "original": 159900, 
                "shipping": "Free", 
                "discount": "13%" 
            }
        ],
        "MacBook Air M3 13-inch": [
            { 
                "platform": "Amazon.in", 
                "price": 99999, 
                "original": 129999, 
                "shipping": "Free", 
                "discount": "23%" 
            },
            { 
                "platform": "Flipkart", 
                "price": 94999, 
                "original": 129999, 
                "shipping": "Free", 
                "discount": "27%" 
            },
            { 
                "platform": "Apple Store", 
                "price": 129999, 
                "original": 129999, 
                "shipping": "Free", 
                "discount": "0%" 
            }
        ],
        "Samsung Galaxy S25": [
            { 
                "platform": "Amazon.in", 
                "price": 79999, 
                "original": 99999, 
                "shipping": "Free", 
                "discount": "20%" 
            },
            { 
                "platform": "Flipkart", 
                "price": 74999, 
                "original": 99999, 
                "shipping": "Free", 
                "discount": "25%" 
            },
            { 
                "platform": "Samsung Store", 
                "price": 99999, 
                "original": 99999, 
                "shipping": "Free", 
                "discount": "0%" 
            }
        ],
        "Milton Water Bottle 1L": [
            { 
                "platform": "Amazon.in", 
                "price": 599, 
                "original": 999, 
                "shipping": "Free", 
                "discount": "40%" 
            },
            { 
                "platform": "BigBasket", 
                "price": 499, 
                "original": 999, 
                "shipping": "Free", 
                "discount": "50%" 
            },
            { 
                "platform": "Flipkart", 
                "price": 549, 
                "original": 999, 
                "shipping": "Free", 
                "discount": "45%" 
            }
        ],
        "Lay's Magic Masala 40g": [
            { 
                "platform": "Amazon.in", 
                "price": 20, 
                "original": 30, 
                "shipping": "Free", 
                "discount": "33%" 
            },
            { 
                "platform": "Flipkart", 
                "price": 18, 
                "original": 30, 
                "shipping": "Free", 
                "discount": "40%" 
            },
            { 
                "platform": "BigBasket", 
                "price": 19, 
                "original": 30, 
                "shipping": "Free", 
                "discount": "37%" 
            }
        ],
        "Parle-G Biscuits 200g": [
            { 
                "platform": "Flipkart", 
                "price": 30, 
                "original": 50, 
                "shipping": "Free", 
                "discount": "40%" 
            },
            { 
                "platform": "BigBasket", 
                "price": 35, 
                "original": 50, 
                "shipping": "Free", 
                "discount": "30%" 
            }
        ],
        "Nescafe Instant Coffee 200g": [
            { 
                "platform": "Amazon.in", 
                "price": 399, 
                "original": 599, 
                "shipping": "Free", 
                "discount": "33%" 
            },
            { 
                "platform": "Flipkart", 
                "price": 349, 
                "original": 599, 
                "shipping": "Free", 
                "discount": "42%" 
            }
        ]
    };
    console.log(`✅ Loaded ${Object.keys(allProducts).length} sample products`);
}

// ========== EVENT SETUP ==========

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        if(query.length > 0) {
            searchProducts(query);
        } else {
            displayAllProducts();
        }
    });

    // Currency toggle
    document.getElementById('currencyToggle').addEventListener('click', toggleCurrency);

    // Price filter slider
    document.getElementById('priceFilter').addEventListener('input', function(e) {
        const value = parseInt(e.target.value);
        document.getElementById('priceValue').textContent = '₹' + value.toLocaleString('en-IN');
    });

    // Discount filter slider
    document.getElementById('discountFilter').addEventListener('input', function(e) {
        const value = e.target.value;
        document.getElementById('discountValue').textContent = value + '%';
    });

    // Close modal on outside click
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('filterModal');
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

    console.log('✅ Event listeners setup complete');
}

// ========== SEARCH FUNCTIONALITY ==========

/**
 * Search products by query string
 * @param {string} query - Search query
 */
function searchProducts(query) {
    console.log(`🔍 Searching for: "${query}"`);
    
    const results = Object.entries(allProducts).filter(([productName]) => 
        productName.toLowerCase().includes(query)
    );

    if(results.length === 0) {
        displayedProducts = [];
        showEmptyState();
        console.log(`❌ No results found for "${query}"`);
        return;
    }

    displayedProducts = results;
    renderProducts(results);
    updateResultCount();
    console.log(`✅ Found ${results.length} product(s)`);
}

/**
 * Display all products (clear search)
 */
function displayAllProducts() {
    console.log('📋 Displaying all products');
    displayedProducts = Object.entries(allProducts);
    renderProducts(displayedProducts);
    updateResultCount();
}

// ========== RENDERING ==========

/**
 * Render products to DOM
 * @param {Array} products - Array of [productName, retailers] pairs
 */
function renderProducts(products) {
    const container = document.getElementById('productsContainer');
    const emptyState = document.getElementById('emptyState');

    if(products.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    
    container.innerHTML = products.map(([productName, retailers]) => 
        createProductCard(productName, retailers)
    ).join('');

    console.log(`✅ Rendered ${products.length} product card(s)`);
}

/**
 * Create HTML for a single product card
 * @param {string} productName - Name of product
 * @param {Array} retailers - Array of retailer objects
 * @returns {string} HTML for product card
 */
function createProductCard(productName, retailers) {
    // Calculate price statistics
    const prices = retailers.map(r => parseFloat(r.price) || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const bestRetailer = retailers.find(r => parseFloat(r.price) === minPrice);
    const avgDiscount = calculateAvgDiscount(retailers);
    const savings = (parseFloat(bestRetailer.original) - minPrice).toFixed(0);

    // Detect category
    const category = getCategory(productName);

    return `
        <div class="product-card">
            <!-- Product Header -->
            <div class="product-header">
                <div class="product-name">${escapeHtml(productName)}</div>
                <span class="product-category">${escapeHtml(category)}</span>
            </div>

            <!-- Price Comparison List -->
            <div class="price-comparison">
                ${retailers.map(retailer => `
                    <div class="retailer-price">
                        <div class="retailer-info">
                            <div class="retailer-name">${escapeHtml(retailer.platform)}</div>
                            <div class="shipping-info">
                                📦 ${escapeHtml(retailer.shipping)}
                            </div>
                        </div>
                        <div class="retailer-prices">
                            <span class="price-current">${formatPrice(retailer.price)}</span>
                            <span class="price-original">${formatPrice(retailer.original)}</span>
                            <span class="discount-badge">${escapeHtml(retailer.discount)}</span>
                        </div>
                    </div>
                `).join('')}

                <!-- Best Deal Highlight -->
                ${bestRetailer ? `
                    <div class="best-deal-badge">
                        ✨ Best Deal: ${formatPrice(minPrice)} at ${escapeHtml(bestRetailer.platform)}
                    </div>
                ` : ''}

                <!-- Price Range Summary -->
                <div class="price-range">
                    <div class="range-label">Price Range</div>
                    <div class="range-values">
                        <span>${formatPrice(minPrice)}</span>
                        <span>${formatPrice(maxPrice)}</span>
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #10b981; font-weight: 600;">
                        💰 Save up to: ${formatPrice(savings)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Escape HTML special characters for security
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ========== FORMATTING & CALCULATION ==========

/**
 * Format price based on current currency
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    if(!price) return currentCurrency === 'USD' ? '$0' : '₹0';
    
    const numPrice = parseFloat(price);
    
    if(currentCurrency === 'USD') {
        return '$' + (numPrice / exchangeRate).toFixed(2);
    }
    
    return '₹' + numPrice.toLocaleString('en-IN');
}

/**
 * Detect product category from name
 * @param {string} productName - Product name
 * @returns {string} Category name
 */
function getCategory(productName) {
    const categories = {
        'iPhone': 'Smartphones',
        'MacBook': 'Apple',
        'iPad': 'Apple',
        'RTX': 'Graphics Cards',
        'Ryzen': 'Processors',
        'Galaxy': 'Smartphones',
        'Watch': 'Smartwatches',
        'Pixl': 'Smartphones',
        'OnePlus': 'Smartphones',
        'TV': 'Televisions',
        'Water': 'Bottles',
        'Lay': 'Snacks',
        'Kurkure': 'Snacks',
        'Haldiram': 'Snacks',
        'Tea': 'Beverages',
        'Coffee': 'Beverages',
        'Juice': 'Beverages',
        'Mixer': 'Kitchen Appliances',
        'Air Fryer': 'Kitchen Appliances',
        'Notebook': 'Stationery',
        'Pen': 'Stationery',
        'Furniture': 'Furniture',
        'Sofa': 'Furniture'
    };

    for(let key in categories) {
        if(productName.includes(key)) {
            return categories[key];
        }
    }
    
    return 'Electronics';
}

/**
 * Calculate average discount across all retailers
 * @param {Array} retailers - Array of retailer objects
 * @returns {string} Average discount as percentage string
 */
function calculateAvgDiscount(retailers) {
    const discounts = retailers.map(r => {
        const discountStr = String(r.discount || '0%').replace('%', '');
        return parseFloat(discountStr) || 0;
    });
    
    const avg = discounts.reduce((a, b) => a + b, 0) / discounts.length;
    return avg.toFixed(0) + '%';
}

// ========== SORTING ==========

/**
 * Sort displayed products
 * @param {string} sortType - Type of sort (relevance, price-low, price-high, discount)
 */
function sortBy(sortType) {
    console.log(`📊 Sorting by: ${sortType}`);
    
    // Update active button
    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentSort = sortType;

    if(sortType === 'price-low') {
        displayedProducts.sort((a, b) => {
            const priceA = Math.min(...a[1].map(r => parseFloat(r.price) || 0));
            const priceB = Math.min(...b[1].map(r => parseFloat(r.price) || 0));
            return priceA - priceB;
        });
    } 
    else if(sortType === 'price-high') {
        displayedProducts.sort((a, b) => {
            const priceA = Math.min(...a[1].map(r => parseFloat(r.price) || 0));
            const priceB = Math.min(...b[1].map(r => parseFloat(r.price) || 0));
            return priceB - priceA;
        });
    } 
    else if(sortType === 'discount') {
        displayedProducts.sort((a, b) => {
            const discountA = parseFloat(calculateAvgDiscount(a[1]));
            const discountB = parseFloat(calculateAvgDiscount(b[1]));
            return discountB - discountA;
        });
    }
    // 'relevance' - maintain original order

    renderProducts(displayedProducts);
    console.log('✅ Sorting complete');
}

// ========== FILTERING ==========

/**
 * Apply all active filters
 */
function applyFilters() {
    console.log('🔎 Applying filters...');
    
    const category = document.getElementById('categoryFilter').value;
    const maxPrice = parseInt(document.getElementById('priceFilter').value);
    const minDiscount = parseInt(document.getElementById('discountFilter').value);

    displayedProducts = Object.entries(allProducts).filter(([productName, retailers]) => {
        // Category filter
        const categoryMatch = !category || getCategory(productName).toLowerCase().includes(category.toLowerCase());
        
        // Price filter
        const minPriceInList = Math.min(...retailers.map(r => parseFloat(r.price) || 0));
        const priceMatch = minPriceInList <= maxPrice;
        
        // Discount filter
        const avgDiscount = parseFloat(calculateAvgDiscount(retailers));
        const discountMatch = avgDiscount >= minDiscount;

        return categoryMatch && priceMatch && discountMatch;
    });

    renderProducts(displayedProducts);
    updateResultCount();
    toggleFilterModal();
    console.log(`✅ Filters applied - ${displayedProducts.length} product(s) match`);
}

/**
 * Reset all filters to default
 */
function resetFilters() {
    console.log('🔄 Resetting filters...');
    
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceFilter').value = '500000';
    document.getElementById('discountFilter').value = '0';
    document.getElementById('priceValue').textContent = '₹500,000';
    document.getElementById('discountValue').textContent = '0%';
    
    toggleFilterModal();
    displayAllProducts();
    console.log('✅ Filters reset');
}

// ========== CURRENCY & DISPLAY ==========

/**
 * Toggle between USD and INR
 */
function toggleCurrency() {
    currentCurrency = currentCurrency === 'INR' ? 'USD' : 'INR';
    document.getElementById('currencyToggle').textContent = 
        currentCurrency === 'INR' ? '💱 USD / INR' : '💱 INR / USD';
    
    renderProducts(displayedProducts);
    console.log(`💱 Currency switched to ${currentCurrency}`);
}

/**
 * Update total product count in header
 */
function updateProductCount() {
    const count = Object.keys(allProducts).length;
    document.getElementById('totalProducts').textContent = count.toLocaleString('en-IN');
    console.log(`📊 Total products: ${count}`);
}

/**
 * Update result count display
 */
function updateResultCount() {
    const count = displayedProducts.length;
    const text = `Showing ${count} product${count !== 1 ? 's' : ''}`;
    document.getElementById('resultCount').textContent = text;
}

/**
 * Show empty state when no results
 */
function showEmptyState() {
    document.getElementById('emptyState').style.display = 'block';
    document.getElementById('resultCount').textContent = 'No results found';
    document.getElementById('productsContainer').innerHTML = '';
}

// ========== MODAL MANAGEMENT ==========

/**
 * Toggle filter modal visibility
 */
function toggleFilterModal() {
    const modal = document.getElementById('filterModal');
    modal.classList.toggle('active');
}

// ========== GLOBAL SEARCH FUNCTION ==========

/**
 * Global search function (called from suggestion buttons)
 * @param {string} query - Search query
 */
function search(query) {
    document.getElementById('searchInput').value = query;
    searchProducts(query.toLowerCase());
}

// ========== CONSOLE LOGGING ==========

console.log(`
╔════════════════════════════════════════════════════╗
║   🛒 ULTIMATE PRICE COMPARISON PLATFORM           ║
║   Version 1.0                                      ║
║   1000+ Products | 20 Retailers | Real Prices     ║
╚════════════════════════════════════════════════════╝
`);
console.log('✅ JavaScript loaded successfully');
console.log('💡 Try searching for: "iPhone", "MacBook", "Water Bottle"');
console.log('🔍 Use filters to refine results');
console.log('💱 Toggle currency with the button');
