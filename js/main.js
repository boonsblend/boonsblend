fetch('data/products.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('product-list');
    container.innerHTML = data.map(p => `
      <div>
        <h2>${p.name}</h2>
        <p>₹${p.price}</p>
        <img src="${p.image}" alt="${p.name}" width="150">
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>`).join('');
  });

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(id);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart');
}