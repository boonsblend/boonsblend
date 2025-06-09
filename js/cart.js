const cart = JSON.parse(localStorage.getItem('cart') || '[]');
fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById('cart');
    const items = cart.map(id => products.find(p => p.id === id));
    container.innerHTML = items.map(p => `<p>${p.name} - ₹${p.price}</p>`).join('');
    const total = items.reduce((sum, p) => sum + p.price, 0);
    container.innerHTML += `<h3>Total: ₹${total}</h3>`;
  });