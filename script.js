// Business WhatsApp number in international format (no '+' or spaces)
const WHATSAPP_NUMBER = '2349036414529';

// Cart State
let cart = [];

// ==================== MOBILE NAVIGATION ====================
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}

// ==================== RESELLER MODAL ====================
function toggleResellerModal(open) {
  const modal = document.getElementById('reseller-modal');
  const backdrop = document.getElementById('reseller-backdrop');
  if (!modal || !backdrop) return;

  if (open) {
    backdrop.classList.remove('hidden');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } else {
    backdrop.classList.add('hidden');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ==================== SLIDE-OUT CART DRAWER ====================
function toggleCart(open) {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');

  if (open) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    renderCart();
  } else {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
  }
}

function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  updateCartBadge();
  toggleCart(true);
}

function updateQuantity(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((entry) => entry.id !== id);
  }
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalCount;
}

function formatNaira(amount) {
  return '₦' + amount.toLocaleString('en-NG');
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center py-12">
        <p class="font-display font-bold text-lg text-brand-charcoal mb-1">Your bag is empty</p>
        <p class="text-sm text-brand-muted mb-6">Pick a Genz Tostone pack to start your order.</p>
        <button
          onclick="toggleCart(false)"
          class="bg-brand-orange text-white text-xs font-semibold px-5 py-2.5 rounded-full cursor-pointer"
        >
          Browse The Drop
        </button>
      </div>
    `;
    subtotalEl.textContent = '₦0';
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart
    .map((item) => {
      const lineTotal = item.price * item.qty;
      subtotal += lineTotal;
      return `
        <div class="flex items-center justify-between gap-4 p-4 rounded-xl border border-brand-border bg-brand-white">
          <div>
            <p class="font-display font-bold text-base text-brand-charcoal">${item.name}</p>
            <p class="text-xs text-brand-muted mt-0.5">${formatNaira(item.price)} each</p>
          </div>
          <div class="flex items-center gap-2.5">
            <button
              onclick="updateQuantity('${item.id}', -1)"
              class="w-7 h-7 rounded-lg border border-brand-border hover:border-brand-orange text-sm font-bold flex items-center justify-center cursor-pointer"
            >−</button>
            <span class="text-sm font-bold w-5 text-center">${item.qty}</span>
            <button
              onclick="updateQuantity('${item.id}', 1)"
              class="w-7 h-7 rounded-lg border border-brand-border hover:border-brand-orange text-sm font-bold flex items-center justify-center cursor-pointer"
            >+</button>
          </div>
        </div>
      `;
    })
    .join('');

  subtotalEl.textContent = formatNaira(subtotal);
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert('Please add at least one pack of Genz Tostone to your bag.');
    return;
  }

  const address = document.getElementById('delivery-address').value.trim();
  let subtotal = 0;

  const itemLines = cart
    .map((item) => {
      const lineTotal = item.price * item.qty;
      subtotal += lineTotal;
      return `• ${item.qty}x ${item.name} — ${formatNaira(lineTotal)}`;
    })
    .join('\n');

  const message =
    `Hi Genz Cravings! I'd like to place an order:\n\n` +
    `${itemLines}\n\n` +
    `Subtotal: ${formatNaira(subtotal)}\n` +
    `Delivery Location: ${address || 'Not specified yet'}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
}

// ==================== DOM READY INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  // Reviews Picture Slider
  const track = document.getElementById('reviews-track');
  const prevBtn = document.getElementById('prev-review-btn');
  const nextBtn = document.getElementById('next-review-btn');

  if (track && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -380, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 380, behavior: 'smooth' });
    });
  }

  // Reseller Form Handler -> Opens WhatsApp with pre-filled partnership inquiry
  const resellerForm = document.getElementById('reseller-form');
  if (resellerForm) {
    resellerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reseller-name').value.trim();
      const type = document.getElementById('reseller-type').value;
      const location = document.getElementById('reseller-location').value.trim();

      if (!name || !location) return;

      const message =
        `Hi Genz Cravings! I'd like to become a reseller/stockist:\n\n` +
        `• Name / Business: ${name}\n` +
        `• Category: ${type}\n` +
        `• Location: ${location}\n\n` +
        `Please share your wholesale pricing and minimum order details.`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener');
      resellerForm.reset();
      toggleResellerModal(false);
    });
  }

  // Close Reseller Modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleResellerModal(false);
    }
  });

  // Order Button (#order-button) WhatsApp Redirect
  const orderButton = document.getElementById('order-button');
  if (orderButton) {
    orderButton.addEventListener('click', (e) => {
      e.preventDefault();
      const message =
        `Hi Genz Cravings! I'd like to order Genz Tostone. Please share available packs and delivery details.`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  // Early Access Form Handlera
  const earlyForm = document.getElementById('early-access-form');
  const earlyInput = document.getElementById('early-access-input');
  const earlyMsg = document.getElementById('early-access-msg');

  if (earlyForm) {
    earlyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!earlyInput.value.trim()) return;
      earlyMsg.textContent = `You're on the list! We'll notify ${earlyInput.value.trim()} before Drop 02 goes live.`;
      earlyMsg.classList.remove('hidden');
      earlyInput.value = '';
    });
  }

  renderCart();
});