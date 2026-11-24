// Interacciones de Burger House: filtros, carrito visual, menú móvil y formulario.
const cart = [];
const money = value => new Intl.NumberFormat("es-AR", {style:"currency", currency:"ARS", maximumFractionDigits:0}).format(value);

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

// FLEXBOX: los filtros muestran u ocultan tarjetas sin cambiar la estructura flexible de la galería.
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const category = button.dataset.filter;
    document.querySelectorAll(".product-card").forEach(card => {
      card.hidden = category !== "all" && card.dataset.category !== category;
    });
  });
});

// Carrito de demostración: permite agregar productos, quitar unidades y calcular el total.
function renderCart() {
  const container = document.getElementById("cartItems");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);

  if (!cart.length) {
    container.innerHTML = '<p class="empty-cart">Todavía no agregaste productos. ¡Elegí algo del menú!</p>';
    return;
  }
  container.innerHTML = cart.map((item, index) => `
    <div class="cart-line">
      <div><strong>${item.name}</strong><small>${item.quantity} × ${money(item.price)}</small></div>
      <div><strong>${money(item.price * item.quantity)}</strong> <button class="remove-item" data-remove="${index}" aria-label="Quitar una unidad">Quitar</button></div>
    </div>`).join("");
  container.querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => {
      const item = cart[Number(button.dataset.remove)];
      item.quantity -= 1;
      if (item.quantity <= 0) cart.splice(Number(button.dataset.remove), 1);
      renderCart();
    });
  });
}

document.querySelectorAll(".add-btn").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({name, price, quantity:1});
    renderCart();
    showToast(`${name} agregado al pedido`);
  });
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return showToast("Primero agregá algún producto al pedido");
  const summary = cart.map(item => `${item.quantity} x ${item.name}`).join(", ");
  showToast(`Pedido preparado: ${summary}`);
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const message = document.getElementById("customerMessage").value.trim();
  const subject = encodeURIComponent("Consulta desde Burger House");
  const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`);
  // Cambiá este correo de ejemplo por el correo real del negocio.
  window.location.href = `mailto:contacto@burgerhouse.com?subject=${subject}&body=${body}`;
});
