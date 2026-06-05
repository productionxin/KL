/**
 * KomalaLeela — Theme JavaScript
 */

// ── Scroll Reveal ──────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Cart Drawer ────────────────────────────────
function toggleCart() {
  const drawer = document.querySelector('.cart-drawer');
  if (drawer) drawer.classList.toggle('open');
}

// Overlay click to close
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('cart-overlay')) toggleCart();
});

// Keyboard close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelector('.cart-drawer')?.classList.remove('open');
  }
});

// ── Add to Cart ────────────────────────────────
document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const variantId = btn.dataset.variantId;
    if (!variantId) return;

    btn.disabled = true;
    btn.textContent = 'Adding...';

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      });

      if (res.ok) {
        btn.textContent = 'Added!';
        await updateCartCount();
        setTimeout(() => {
          btn.textContent = 'Add to Cart';
          btn.disabled = false;
        }, 2000);
      }
    } catch (err) {
      btn.textContent = 'Try Again';
      btn.disabled = false;
    }
  });
});

async function updateCartCount() {
  try {
    const res = await fetch('/cart.js');
    const cart = await res.json();
    const badge = document.querySelector('.cart-count');
    if (badge) {
      badge.textContent = cart.item_count;
      badge.style.display = cart.item_count > 0 ? 'grid' : 'none';
    }
  } catch (e) {}
}

// ── Sticky Header Shadow ───────────────────────
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 60
      ? '0 4px 30px rgba(26,18,8,0.08)'
      : 'none';
  }, { passive: true });
}

// ── Lazy Load Images (polyfill) ────────────────
if ('loading' in HTMLImageElement.prototype === false) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ── Search ─────────────────────────────────────
function openSearch() {
  // Implement predictive search drawer here
  const searchUrl = '/search?q=';
  const term = prompt('Search KomalaLeela:');
  if (term) window.location.href = searchUrl + encodeURIComponent(term);
}
