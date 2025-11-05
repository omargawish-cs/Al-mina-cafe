// تحميل السلة أو إنشاء واحدة جديدة
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* -------------------- 🧺 دالة لحفظ السلة -------------------- */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* -------------------- ✅ صفحة المنيو -------------------- */
if (document.querySelector(".add-to-cart")) {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      // شوف لو المنتج موجود
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      saveCart();
      updateCartCount();
      alert(`${name} تمت إضافته للسلة ✅`);
    });
  });
}

/* -------------------- 🛒 صفحة الكارت -------------------- */
if (document.querySelector(".cart")) {
  const cartContainer = document.querySelector(".cart");

  function renderCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="text-center p-5">
          <h2>السلة فاضية</h2>
          <a href="../index.html" class="btn btn-warning mt-3">رجوع إلى المنيو</a>
        </div>
      `;
      updateCartCount();
      return;
    }

    let total = 0;
    let html = `
      <div class="container p-4">
        <h2 class="text-center mb-4" style="color:#9c4a1a;">🛒 منتجاتك</h2>
        <table class="table table-striped text-center">
          <thead>
            <tr>
              <th>المنتج</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الإجمالي</th>
              <th>حذف</th>
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
        <h4 class="text-end">الإجمالي: ${total} EGP</h4>
        <div class="text-center mt-4">
          <button class="btn btn-success" onclick="checkout()">تأكيد الطلب ✅</button>
        </div>
      </div>
    `;

    cartContainer.innerHTML = html;
    updateCartCount();
  }

  // تحديث كمية
  window.updateQty = function (i, delta) {
    cart[i].quantity += delta;
    if (cart[i].quantity <= 0) cart.splice(i, 1);
    saveCart();
    renderCart();
  };

  // حذف منتج
  window.removeItem = function (i) {
    cart.splice(i, 1);
    saveCart();
    renderCart();
  };

  // واتساب
  window.checkout = function () {
    if (cart.length === 0) return alert("السلة فاضية");
    const msg = cart.map(i => `${i.name} x${i.quantity}`).join("%0A");
    const url = `https://wa.me/201503391411?text=طلب%20جديد%20من%20الموقع:%0A${msg}`;
    window.open(url, "_blank");
  };

  renderCart();
}

/* -------------------- 🔴 عداد الأيقونة -------------------- */
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

// تحديث العداد عند تحميل الصفحة
updateCartCount();
