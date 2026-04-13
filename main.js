/* SoloBuildTW Landing Page — main.js */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Language (Chinese-only page, EN/JA have standalone pages) ----
  const currentLang = 'zh';

  // ---- Tab switcher (Tutorial / Soul) ----
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const content = document.getElementById(`tab-${target}`);
      if (content) content.classList.add('active');
    });
  });

  // ---- Platform toggle (TW / International) ----
  const platformBtns = document.querySelectorAll('.platform-btn');

  function applyPlatform(platform) {
    platformBtns.forEach(b => b.classList.toggle('active', b.dataset.platform === platform));

    // Toggle price displays
    document.querySelectorAll('.price-tw').forEach(el => {
      el.classList.toggle('hidden', platform !== 'tw');
    });
    document.querySelectorAll('.price-intl').forEach(el => {
      el.classList.toggle('hidden', platform !== 'intl');
    });
    document.querySelectorAll('.orig-tw').forEach(el => {
      el.classList.toggle('hidden', platform !== 'tw');
    });
    document.querySelectorAll('.orig-intl').forEach(el => {
      el.classList.toggle('hidden', platform !== 'intl');
    });

    // Swap buy button hrefs and lemonsqueezy-button class
    document.querySelectorAll('[data-href-tw][data-href-intl]').forEach(el => {
      const href = platform === 'intl' ? el.dataset.hrefIntl : el.dataset.hrefTw;
      el.setAttribute('href', href);
      el.classList.toggle('lemonsqueezy-button', platform === 'intl');
    });
  }

  platformBtns.forEach(btn => {
    btn.addEventListener('click', () => applyPlatform(btn.dataset.platform));
  });

  // Auto-select International when lang=en
  if (currentLang === 'en') applyPlatform('intl');

  // ---- Affiliate ref tracking ----
  // Capture ref from URL on page load and persist in localStorage (30 days)
  // With cookie fallback and language link injection
  const REF_KEY = 'solobuild-ref';
  const REF_TIMESTAMP_KEY = 'solobuild-ref-ts';
  const REF_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

  function setRefWithCookie(ref) {
    if (!ref || ref.trim().length === 0) return;
    ref = ref.trim();
    const now = Date.now();

    // Store in localStorage with timestamp
    localStorage.setItem(REF_KEY, ref);
    localStorage.setItem(REF_TIMESTAMP_KEY, now.toString());

    // Also set cookie for fallback (30 days)
    const expiryDate = new Date(now + REF_EXPIRY_MS);
    document.cookie = `solobuild_ref=${encodeURIComponent(ref)}; max-age=2592000; path=/; expires=${expiryDate.toUTCString()}`;
  }

  function getRef() {
    // Try localStorage first
    const storedRef = localStorage.getItem(REF_KEY);
    const storedTs = localStorage.getItem(REF_TIMESTAMP_KEY);

    if (storedRef && storedTs) {
      const age = Date.now() - parseInt(storedTs, 10);
      if (age < REF_EXPIRY_MS) {
        return storedRef;
      }
      // Expired, clean up
      localStorage.removeItem(REF_KEY);
      localStorage.removeItem(REF_TIMESTAMP_KEY);
    }

    // Fallback to cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === 'solobuild_ref') {
        return decodeURIComponent(value);
      }
    }

    return '';
  }

  (function captureRef() {
    const params = new URLSearchParams(window.location.search);
    const urlRef = params.get('ref');
    if (urlRef && urlRef.trim().length > 0) {
      setRefWithCookie(urlRef);
    }
  })();

  // Inject ref into language switcher links
  (function injectRefIntoLangLinks() {
    const ref = getRef();
    if (!ref) return;

    const langLinks = document.querySelectorAll('a[href^="/"], a[href^="/en/"], a[href^="/ja/"]');
    langLinks.forEach(link => {
      const href = link.getAttribute('href');
      // Skip if already has ref param
      if (href.includes('?ref=') || href.includes('&ref=')) return;
      // Only inject into language pages
      if (href === '/' || href === '/en/' || href === '/ja/') {
        link.href = href + (href.endsWith('/') ? '' : '/') + `?ref=${encodeURIComponent(ref)}`;
      }
    });
  })();

  // ---- UTM capture (persist in sessionStorage for this session) ----
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  (function captureUtm() {
    const params = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach(k => {
      const v = params.get(k);
      if (v) sessionStorage.setItem(k, v);
    });
  })();
  function getUtm() {
    const out = {};
    UTM_KEYS.forEach(k => {
      const v = sessionStorage.getItem(k);
      if (v) out[k] = v;
    });
    return out;
  }

  // ---- Checkout via CF Worker (TW) or LemonSqueezy (INTL) ----
  const CF_WORKER = 'https://pay.solobuildtw.com';
  const PRODUCT_MAP = { teaching: 'handbook', soul: 'soulpack', combo: 'combo' };

  async function checkoutTW(productId, btnEl) {
    const mapped = PRODUCT_MAP[productId] || productId;
    const ref = getRef();
    // S86: redirect to /api/pay which shows email collection form first
    const lang = document.documentElement.lang === 'ja' ? 'ja' : document.documentElement.lang === 'en' ? 'en' : 'tw';
    const payUrl = `${CF_WORKER}/api/pay?product=${encodeURIComponent(mapped)}&ref=${encodeURIComponent(ref)}&lang=${encodeURIComponent(lang)}`;
    window.location.href = payUrl;
    return; // below is legacy code kept for reference
    btnEl.textContent = '處理中...';
    btnEl.style.pointerEvents = 'none';
    try {
      const res = await fetch(`${CF_WORKER}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: mapped, ref: ref, email: '', lang: 'tw' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      // Create hidden form and submit to NewebPay
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.PaymentURL;
      ['MerchantID', 'TradeInfo', 'TradeSha', 'Version'].forEach(k => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = data[k];
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      alert('付款頁面載入失敗，請稍後再試。');
      btnEl.textContent = btnEl.getAttribute('data-' + currentLang) || '購買';
      btnEl.style.pointerEvents = '';
    }
  }

  document.querySelectorAll('[data-href-tw][data-href-intl]').forEach(el => {
    el.addEventListener('click', (e) => {
      const card = el.closest('[data-product]');
      const productId = card ? card.dataset.product : 'unknown';

      // GA4 tracking (with UTM enrichment)
      if (typeof gtag === 'function') {
        const utm = getUtm();
        gtag('event', 'begin_checkout', Object.assign({
          items: [{ item_id: productId, item_name: el.textContent.trim() }],
          campaign_source: utm.utm_source || '',
          campaign_medium: utm.utm_medium || '',
          campaign_name: utm.utm_campaign || productId
        }, utm));
      }

      // All payments go through CF Worker (藍新) — EPG links are 403
      e.preventDefault();
      checkoutTW(productId, el);
    });
  });

  // ---- Compare table toggle ----
  const compareToggle = document.querySelector('.compare-toggle');
  const compareTable = document.querySelector('.compare-table');

  if (compareToggle && compareTable) {
    compareToggle.addEventListener('click', () => {
      const isHidden = compareTable.classList.contains('hidden');
      compareTable.classList.toggle('hidden', !isHidden);
      if (isHidden) {
        compareToggle.setAttribute('data-zh', '收起比較表 ▴');
        compareToggle.setAttribute('data-en', 'Collapse ▴');
        compareToggle.textContent = currentLang === 'en' ? 'Collapse ▴' : '收起比較表 ▴';
      } else {
        compareToggle.setAttribute('data-zh', '詳細比較三種方案 ▾');
        compareToggle.setAttribute('data-en', 'Compare All Plans ▾');
        compareToggle.textContent = currentLang === 'en' ? 'Compare All Plans ▾' : '詳細比較三種方案 ▾';
      }
    });
  }

  // ---- Mobile nav toggle ----
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const headerNav = document.querySelector('.header-nav');

  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = headerNav.style.display === 'flex';
      headerNav.style.display = isOpen ? '' : 'flex';
      headerNav.style.flexDirection = 'column';
      headerNav.style.position = 'absolute';
      headerNav.style.top = '64px';
      headerNav.style.left = '0';
      headerNav.style.right = '0';
      headerNav.style.background = 'rgba(250,247,242,0.98)';
      headerNav.style.padding = '16px 24px 24px';
      headerNav.style.gap = '16px';
      headerNav.style.borderBottom = '1px solid rgba(30,58,95,0.1)';
      if (isOpen) {
        headerNav.removeAttribute('style');
      }
    });

    // Close mobile nav on link click
    headerNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        headerNav.removeAttribute('style');
      });
    });
  }

  // ---- Smooth scroll offset for sticky header ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---- Intersection Observer: fade-in on scroll ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.feature-card, .pricing-card, .pain-card, .faq-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

});
