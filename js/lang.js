// Load cart or create a new one
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* -------------------- 🧺 Function to save cart -------------------- */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* -------------------- ✅ Menu Page -------------------- */
if (document.querySelector(".add-to-cart")) {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      // Check if the item already exists
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      saveCart();
      updateCartCount();
      alert(`${name} has been added to your cart ✅`);
    });
  });
}

/* -------------------- 🛒 Cart Page -------------------- */
if (document.querySelector(".cart")) {
  const cartContainer = document.querySelector(".cart");

  function renderCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="text-center p-5">
          <h2>Your cart is empty</h2>
          <a href="index-eng.html" class="btn btn-warning mt-3">Back to Menu</a>
        </div>
      `;
      updateCartCount();
      return;
    }

    let total = 0;
    let html = `
      <div class="container p-4">
        <h2 class="text-center mb-4" style="color:#9c4a1a;">🛒 Your Items</h2>
        <table class="table table-striped text-center">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
    `;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      html += `
        <tr>
          <td>${item.name}</td>
          <td>${item.price} EGP</td>
          <td>
            <button class="btn btn-sm btn-outline-danger" onclick="updateQty(${index}, -1)">-</button>
            ${item.quantity}
            <button class="btn btn-sm btn-outline-success" onclick="updateQty(${index}, 1)">+</button>
          </td>
          <td>${itemTotal} EGP</td>
          <td><button class="btn btn-sm btn-danger" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button></td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
        <h4 class="text-end">Total: ${total} EGP</h4>
        <div class="text-center mt-4">
          <button class="btn btn-success" onclick="checkout()">Confirm Order ✅</button>
        </div>
      </div>
    `;

    cartContainer.innerHTML = html;
    updateCartCount();
  }

  // Update quantity
  window.updateQty = function (i, delta) {
    cart[i].quantity += delta;
    if (cart[i].quantity <= 0) cart.splice(i, 1);
    saveCart();
    renderCart();
  };

  // Remove item
  window.removeItem = function (i) {
    cart.splice(i, 1);
    saveCart();
    renderCart();
  };

  // WhatsApp checkout
  window.checkout = function () {
    if (cart.length === 0) return alert("Your cart is empty");
    const msg = cart.map(i => `${i.name} x${i.quantity}`).join("%0A");
    const url = `https://wa.me/201503391411?text=New%20Order%20from%20Website:%0A${msg}`;
    window.open(url, "_blank");
  };

  renderCart();
}

/* -------------------- 🔴 Cart Icon Counter -------------------- */
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

// Update the counter when the page loads
updateCartCount();
