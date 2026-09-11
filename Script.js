/* ==========================================================================
   Easy Shopping — Store logic
   Vanilla JS, no dependencies. Sections: data, state, render, events, init.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------- DATA ---------------- */
  const CATEGORIES = [
    { id: 'eletronicos', name: 'Eletrônicos', icon: iconBolt() },
    { id: 'moda', name: 'Moda', icon: iconShirt() },
    { id: 'casa', name: 'Casa', icon: iconHome() },
    { id: 'esporte', name: 'Esporte', icon: iconBall() },
    { id: 'beleza', name: 'Beleza', icon: iconSpark() },
    { id: 'acessorios', name: 'Acessórios', icon: iconBag() },
  ];

  // "image" is the product photo URL. "zoom" (1 = no zoom) and "focus" (CSS
  // object-position) compensate for photos with different compositions, so
  // every card shows the product at roughly the same visual size — tweak
  // these two if a swapped-in photo looks too big/small or is cropped wrong.
  const PRODUCTS = [
    { id: 'p1', name: 'Fone Bluetooth Over-Ear', category: 'eletronicos', price: 249.9, oldPrice: 349.9, seed: 'es-prod-headphone', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', zoom: 1, focus: 'center' },
    { id: 'p2', name: 'Smartwatch Fit Pro', category: 'eletronicos', price: 399.0, oldPrice: null, seed: 'es-prod-smartwatch', image: 'https://images.unsplash.com/photo-1777496410128-926b2d0083f9?auto=format&fit=crop&w=800&q=80', zoom: 1.15, focus: 'center' },
    { id: 'p3', name: 'Câmera Instantânea Retrô', category: 'eletronicos', price: 529.0, oldPrice: 599.0, seed: 'es-prod-camera', image: 'https://images.unsplash.com/photo-1613645540553-d98859ffeec5?auto=format&fit=crop&w=800&q=80', zoom: 1.1, focus: 'center' },
    { id: 'p4', name: 'Jaqueta Corta-Vento Unissex', category: 'moda', price: 189.9, oldPrice: 259.9, seed: 'es-prod-jacket', image: 'https://images.pexels.com/photos/8497715/pexels-photo-8497715.jpeg?auto=compress&cs=tinysrgb&w=800', zoom: 1.9, focus: 'center 25%' },
    { id: 'p5', name: 'Tênis Casual Urbano', category: 'moda', price: 279.0, oldPrice: null, seed: 'es-prod-sneaker', image: 'https://images.unsplash.com/photo-1662376567952-004fab001201?q=80&w=755&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', zoom: 1, focus: 'center' },
    { id: 'p6', name: 'Óculos de Sol Polarizado', category: 'acessorios', price: 149.0, oldPrice: 199.0, seed: 'es-prod-sunglasses', image: 'https://images.pexels.com/photos/29098550/pexels-photo-29098550.jpeg?auto=compress&cs=tinysrgb&w=800', zoom: 1.45, focus: 'center' },
    { id: 'p7', name: 'Mochila Executiva Impermeável', category: 'acessorios', price: 219.9, oldPrice: null, seed: 'es-prod-backpack', image: 'https://images.unsplash.com/photo-1528921581519-52b9d779df2b?auto=format&fit=crop&w=800&q=80', zoom: 1.5, focus: 'center' },
    { id: 'p8', name: 'Luminária de Mesa Minimalista', category: 'casa', price: 129.9, oldPrice: 169.9, seed: 'es-prod-lamp', image: 'https://images.pexels.com/photos/823841/pexels-photo-823841.jpeg?auto=compress&cs=tinysrgb&w=800', zoom: 1, focus: 'center' },
    { id: 'p9', name: 'Kit Panelas Antiaderentes', category: 'casa', price: 349.0, oldPrice: 429.0, seed: 'es-prod-cookware', image: 'https://images.pexels.com/photos/5782042/pexels-photo-5782042.jpeg?auto=compress&cs=tinysrgb&w=800', zoom: 1.2, focus: 'center' },
    { id: 'p10', name: 'Garrafa Térmica 1L', category: 'esporte', price: 89.9, oldPrice: null, seed: 'es-prod-bottle', image: 'https://images.pexels.com/photos/3737800/pexels-photo-3737800.jpeg?auto=compress&cs=tinysrgb&w=800', zoom: 1, focus: 'center' },
    { id: 'p11', name: 'Kit Yoga com Tapete', category: 'esporte', price: 159.0, oldPrice: 199.0, seed: 'es-prod-yoga', image: 'https://images.pexels.com/photos/7318664/pexels-photo-7318664.jpeg?auto=compress&cs=tinysrgb&w=800', zoom: 1.35, focus: 'center' },
    { id: 'p12', name: 'Kit Skincare Facial', category: 'beleza', price: 119.9, oldPrice: 149.9, seed: 'es-prod-skincare', image: 'https://images.pexels.com/photos/4841273/pexels-photo-4841273.jpeg?auto=compress&cs=tinysrgb&w=800', zoom: 1, focus: 'center' },
  ];

  // All photos are free-license stock photography (Unsplash License / Pexels
  // License — free for commercial use, no attribution required). To swap any
  // of them, replace "image" with another direct file link (must start with
  // https://images.unsplash.com/... or https://images.pexels.com/...), then
  // adjust "zoom" (1 = none, 1.5 = 50% closer) and "focus" (e.g. 'center 30%')
  // if the new photo looks too big/small or is cropped in the wrong place.

  /* ---------------- STATE ---------------- */
  let state = {
    category: 'all',
    search: '',
    sort: 'relevance',
    cart: loadCart(),
  };

  /* ---------------- HELPERS ---------------- */
  function formatPrice(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function discountPercent(product) {
    if (!product.oldPrice) return null;
    return Math.round((1 - product.price / product.oldPrice) * 100);
  }

  function productImage(product, size) {
    return product.image && product.image.trim() !== ''
      ? product.image
      : `https://picsum.photos/seed/${product.seed}/${size}/${size}`;
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem('easyshopping_cart');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem('easyshopping_cart', JSON.stringify(state.cart));
    } catch (e) { /* storage unavailable — cart still works in-memory */ }
  }

  /* ---------------- ICONS ---------------- */
  function iconBolt() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'; }
  function iconShirt() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M8 4 3 7l2 3 2-1v11h10V9l2 1 2-3-5-3-1.5 1.8h-3L8 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'; }
  function iconHome() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M4 11 12 4l8 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v9h12v-9" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'; }
  function iconBall() { return '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.2"/></svg>'; }
  function iconSpark() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'; }
  function iconBag() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M6 8h12l1 12H5L6 8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.6"/></svg>'; }
  function iconHeart() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.4-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'; }
  function iconCartSmall() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21.5 8H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function iconCheck() { return '<svg viewBox="0 0 24 24" fill="none"><path d="m5 13 4 4L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function iconTrash() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function iconEmptyCart() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21.5 8H6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="21" r="1.2" fill="currentColor"/><circle cx="18" cy="21" r="1.2" fill="currentColor"/></svg>'; }

  /* ---------------- RENDER: CATEGORIES ---------------- */
  function renderCategories() {
    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = CATEGORIES.map(cat => `
      <button class="category-card" type="button" data-category="${cat.id}">
        <span class="cat-icon">${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `).join('');

    const chips = document.getElementById('categoryChips');
    CATEGORIES.forEach(cat => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.type = 'button';
      chip.dataset.category = cat.id;
      chip.textContent = cat.name;
      chips.appendChild(chip);
    });

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.category-card');
      if (!card) return;
      setCategory(card.dataset.category);
      document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
    });

    chips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      setCategory(chip.dataset.category);
    });
  }

  function setCategory(categoryId) {
    state.category = categoryId;
    document.querySelectorAll('.chip').forEach(chip => {
      chip.classList.toggle('is-active', chip.dataset.category === categoryId);
    });
    renderProducts();
  }

  /* ---------------- RENDER: PRODUCTS ---------------- */
  function getFilteredProducts() {
    let list = PRODUCTS.filter(p => {
      const matchesCategory = state.category === 'all' || p.category === state.category;
      const matchesSearch = p.name.toLowerCase().includes(state.search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    switch (state.sort) {
      case 'price-asc': list = list.slice().sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = list.slice().sort((a, b) => b.price - a.price); break;
      case 'discount': list = list.slice().sort((a, b) => (discountPercent(b) || 0) - (discountPercent(a) || 0)); break;
      default: break;
    }
    return list;
  }

  function renderProducts() {
    const grid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');
    const list = getFilteredProducts();

    resultsCount.textContent = list.length === 1 ? '1 produto encontrado' : `${list.length} produtos encontrados`;

    if (list.length === 0) {
      grid.innerHTML = '';
      grid.hidden = true;
      emptyState.hidden = false;
      return;
    }

    grid.hidden = false;
    emptyState.hidden = true;

    grid.innerHTML = list.map(p => {
      const discount = discountPercent(p);
      const inCart = state.cart.find(item => item.id === p.id);
      return `
      <article class="product-card">
        <div class="product-media">
          ${discount ? `<span class="product-badge">-${discount}%</span>` : ''}
          <button class="product-fav" type="button" aria-label="Favoritar ${p.name}" aria-pressed="false">${iconHeart()}</button>
          <img src="${productImage(p, 400)}" alt="${p.name}" loading="lazy" width="400" height="400" style="object-position:${p.focus || 'center'};transform:scale(${p.zoom || 1});">
        </div>
        <div class="product-info">
          <span class="product-category">${categoryName(p.category)}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-price-row">
            <span class="product-price">${formatPrice(p.price)}</span>
            ${p.oldPrice ? `<span class="product-price-old">${formatPrice(p.oldPrice)}</span>` : ''}
          </div>
          <button class="add-to-cart-btn ${inCart ? 'is-added' : ''}" type="button" data-add="${p.id}">
            ${inCart ? iconCheck() : iconCartSmall()}
            <span>${inCart ? 'Adicionado' : 'Adicionar'}</span>
          </button>
        </div>
      </article>`;
    }).join('');
  }

  function categoryName(id) {
    const found = CATEGORIES.find(c => c.id === id);
    return found ? found.name : id;
  }

  /* ---------------- CART ---------------- */
  function addToCart(productId) {
    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ id: productId, qty: 1 });
    }
    saveCart();
    renderProducts();
    renderCartBadge();
    renderCartDrawer();
    showToast(`${PRODUCTS.find(p => p.id === productId).name} adicionado ao carrinho`);
  }

  function updateQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(i => i.id !== productId);
    }
    saveCart();
    renderCartBadge();
    renderCartDrawer();
    renderProducts();
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    saveCart();
    renderCartBadge();
    renderCartDrawer();
    renderProducts();
  }

  function cartTotals() {
    let subtotal = 0;
    state.cart.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (product) subtotal += product.price * item.qty;
    });
    return { subtotal, total: subtotal };
  }

  function renderCartBadge() {
    const badge = document.getElementById('cartBadge');
    const count = state.cart.reduce((sum, i) => sum + i.qty, 0);
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }

  function renderCartDrawer() {
    const body = document.getElementById('cartBody');
    const footer = document.getElementById('cartFooter');

    if (state.cart.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          ${iconEmptyCart()}
          <h3>Seu carrinho está vazio</h3>
          <p>Adicione produtos para vê-los aqui.</p>
        </div>`;
      footer.hidden = true;
      return;
    }

    footer.hidden = false;

    body.innerHTML = state.cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return '';
      return `
      <div class="cart-item">
        <img src="${productImage(product, 120)}" alt="" width="64" height="64" loading="lazy" style="object-position:${product.focus || 'center'};transform:scale(${product.zoom || 1});">
        <div>
          <p class="cart-item-name">${product.name}</p>
          <p class="cart-item-price">${formatPrice(product.price)}</p>
          <div class="qty-control">
            <button type="button" aria-label="Diminuir quantidade" data-qty-down="${product.id}">−</button>
            <span>${item.qty}</span>
            <button type="button" aria-label="Aumentar quantidade" data-qty-up="${product.id}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" type="button" aria-label="Remover ${product.name}" data-remove="${product.id}">${iconTrash()}</button>
      </div>`;
    }).join('');

    const { subtotal, total } = cartTotals();
    document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('cartTotal').textContent = formatPrice(total);
  }

  function openCart() {
    document.getElementById('cartDrawer').classList.add('is-open');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
    document.getElementById('drawerOverlay').hidden = false;
    document.getElementById('cartToggle').setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    document.getElementById('cartDrawer').classList.remove('is-open');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'true');
    document.getElementById('drawerOverlay').hidden = true;
    document.getElementById('cartToggle').setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ---------------- TOAST ---------------- */
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `${iconCheck()}<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  /* ---------------- EVENTS ---------------- */
  function bindEvents() {
    // Mobile menu
    const header = document.getElementById('site-header');
    const menuToggle = document.getElementById('menuToggle');
    menuToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.getElementById('mobileNav').addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        header.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Search
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    searchForm.addEventListener('submit', (e) => e.preventDefault());
    searchInput.addEventListener('input', () => {
      state.search = searchInput.value.trim();
      renderProducts();
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      state.sort = e.target.value;
      renderProducts();
    });

    // Clear filters
    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
      state.category = 'all';
      state.search = '';
      searchInput.value = '';
      document.querySelectorAll('.chip').forEach(chip => chip.classList.toggle('is-active', chip.dataset.category === 'all'));
      renderProducts();
    });

    // Product grid delegation (add to cart + favorite)
    document.getElementById('productGrid').addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add]');
      if (addBtn) { addToCart(addBtn.dataset.add); return; }

      const favBtn = e.target.closest('.product-fav');
      if (favBtn) {
        const active = favBtn.classList.toggle('is-active');
        favBtn.setAttribute('aria-pressed', String(active));
      }
    });

    // Cart drawer delegation
    document.getElementById('cartBody').addEventListener('click', (e) => {
      const up = e.target.closest('[data-qty-up]');
      const down = e.target.closest('[data-qty-down]');
      const remove = e.target.closest('[data-remove]');
      if (up) updateQty(up.dataset.qtyUp, 1);
      if (down) updateQty(down.dataset.qtyDown, -1);
      if (remove) removeFromCart(remove.dataset.remove);
    });

    // Cart open/close
    document.getElementById('cartToggle').addEventListener('click', openCart);
    document.getElementById('cartClose').addEventListener('click', closeCart);
    document.getElementById('drawerOverlay').addEventListener('click', closeCart);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCart();
    });

    // Checkout (demo only)
    document.getElementById('checkoutBtn').addEventListener('click', () => {
      showToast('Pedido simulado com sucesso — ambiente de demonstração');
      state.cart = [];
      saveCart();
      renderCartBadge();
      renderCartDrawer();
      renderProducts();
      setTimeout(closeCart, 900);
    });

    // Newsletter (demo only)
    document.getElementById('newsletterForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = document.getElementById('newsletterFeedback');
      feedback.textContent = 'Inscrição confirmada! Fique de olho no seu e-mail.';
      e.target.reset();
    });
  }

  /* ---------------- INIT ---------------- */
  function init() {
    renderCategories();
    renderProducts();
    renderCartBadge();
    renderCartDrawer();
    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', init);
})();