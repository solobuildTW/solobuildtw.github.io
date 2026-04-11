/* SoloBuildTW Landing Page — main.js */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Language state (must be declared early) ----
  const langBtn = document.querySelector('.lang-toggle');
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  let currentLang = urlLang || localStorage.getItem('solobuild-lang') || 'zh';

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('solobuild-lang', lang);
    document.querySelectorAll('[data-zh]').forEach(el => {
      const val = el.getAttribute(`data-${lang}`);
      if (val) el.textContent = val;
    });
    document.querySelectorAll('[data-zh-html]').forEach(el => {
      const val = el.getAttribute(`data-${lang}-html`);
      if (val) el.innerHTML = val;
    });
    if (langBtn) {
      langBtn.textContent = lang === 'zh' ? '中 / EN' : 'EN / 中';
      langBtn.classList.toggle('active-en', lang === 'en');
    }
    document.title = lang === 'en'
      ? 'Claude Code Experience Pack — SoloBuildTW'
      : 'Claude Code 經驗包 — SoloBuildTW';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = lang === 'en'
      ? 'Your colleagues are already using AI. No coding needed — 10 AI roles start working for you tonight. Tutorial $16.99 / Soul $21.99 / Combo $32.99.'
      : '你的同事已經在用 AI 了，你呢？不用寫程式、不用懂技術，今晚就能讓 AI 開始幫你做事。早鳥限定：教學包 NT$499 / 靈魂包 NT$649 / 組合包 NT$999。';
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = lang === 'en'
      ? 'Claude Code Experience Pack — SoloBuildTW'
      : 'Claude Code 經驗包 — SoloBuildTW';
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = lang === 'en'
      ? 'Your colleagues are already using AI. No coding needed — let AI start working for you tonight.'
      : '你的同事已經在用 AI 了，你呢？不用寫程式、不用懂技術，今晚就能讓 AI 開始幫你做事。';
  }

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      setLang(currentLang === 'zh' ? 'en' : 'zh');
    });
  }

  if (currentLang === 'en') setLang('en');

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
  // Capture ref from URL on page load and persist in sessionStorage
  // Handles: ?ref=REF001, combined params like ?ref=REF001&lang=en, missing ref
  (function captureRef() {
    const params = new URLSearchParams(window.location.search);
    const urlRef = params.get('ref');
    if (urlRef && urlRef.trim().length > 0) {
      sessionStorage.setItem('solobuild-ref', urlRef.trim());
    }
  })();

  function getRef() {
    return sessionStorage.getItem('solobuild-ref') || '';
  }

  // ---- Checkout via CF Worker (TW) or LemonSqueezy (INTL) ----
  const CF_WORKER = 'https://solobuild-pay.harvey3630.workers.dev';
  const PRODUCT_MAP = { teaching: 'handbook', soul: 'soulpack', combo: 'combo' };

  async function checkoutTW(productId, btnEl) {
    const mapped = PRODUCT_MAP[productId] || productId;
    const ref = getRef();
    btnEl.textContent = '處理中...';
    btnEl.style.pointerEvents = 'none';
    try {
      const res = await fetch(`${CF_WORKER}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: mapped, ref: ref, email: '' })
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

      // GA4 tracking
      if (typeof gtag === 'function') {
        gtag('event', 'begin_checkout', {
          items: [{ item_id: productId, item_name: el.textContent.trim() }]
        });
      }

      // If TW platform selected, use CF Worker checkout instead of EPG link
      const isTW = !el.classList.contains('lemonsqueezy-button');
      if (isTW) {
        e.preventDefault();
        checkoutTW(productId, el);
      }
      // INTL: let LemonSqueezy handle normally via href
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
