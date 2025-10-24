const products = [
  { id: 1, name: "Stylish T-Shirt", price: 499, category: "clothing" },
  { id: 2, name: "Smart Watch", price: 1299, category: "electronics" },
  { id: 3, name: "Casual Shoes", price: 999, category: "clothing" },
  { id: 4, name: "Wireless Earbuds", price: 1499, category: "electronics" },
  { id: 5, name: "Leather Wallet", price: 799, category: "accessories" },
  { id: 6, name: "Backpack", price: 1199, category: "accessories" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let filteredProducts = [...products];

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const clearCartBtn = document.getElementById("clear-cart");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");


function displayProducts(items) {
  if (items.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  productList.innerHTML = items.map(p => `
    <div class="product">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('');
}
function addToCart(id) {
  const item = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);

  if (existing) existing.quantity += 1;
  else cart.push({ ...item, quantity: 1 });

  saveCart();
  renderCart();
}
function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
}
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = "<li>Your cart is empty.</li>";
    cartTotal.textContent = "0";
    cartCount.textContent = "0";
    return;
  }

  cartItems.innerHTML = cart.map(c => `
    <li>
      ${c.name} x ${c.quantity} 
      <button onclick="removeItem(${c.id})">❌</button>
    </li>
  `).join('');

   const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  cartTotal.textContent = total;
  cartCount.textContent = cart.reduce((sum, c) => sum + c.quantity, 0);
}

// Clear cart
clearCartBtn.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

// 🔍 Search Functionality
searchInput.addEventListener("input", applyFilters);

// 📂 Category Filter
categoryFilter.addEventListener("change", applyFilters);

function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchText);
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  displayProducts(filteredProducts);
}

// Initialize
displayProducts(products);
renderCart();