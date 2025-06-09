let cart = [];

function addToCart(product, price) {
  const existing = cart.find(item => item.name === product);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: product, price: price, qty: 1 });
  }
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cartList");
  list.innerHTML = "";
  if (cart.length === 0) {
    list.innerHTML = "<li class='text-gray-500'>Your cart is empty.</li>";
    return;
  }
  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "mb-1";
    li.textContent = `${item.name} x${item.qty} — ₹${item.price * item.qty}`;
    list.appendChild(li);
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItem = document.createElement("li");
  totalItem.className = "font-bold mt-2";
  totalItem.textContent = `Total: ₹${total}`;
  list.appendChild(totalItem);
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  const message = encodeURIComponent(
    "Hi, I’d like to order Boon’s Blend:\n" +
    cart.map(item => `• ${item.name} x${item.qty}`).join("\n") +
    `\nTotal: ₹${cart.reduce((sum, item) => sum + item.price * item.qty, 0)}`
  );
  window.location.href = `https://wa.me/919188840848?text=${message}`;
}
