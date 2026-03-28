/* SoloBuild Landing Page — main.js */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Language state (must be declared early) ----
  const langBtn = document.querySelector('.lang-toggle');
  const platformBtns = document.querySelectorAll('.platform-btn');
  let currentLang = localStorage.getItem('solobuild-lang') || 'zh';

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
    // 英文版預設國際定價，中文版預設台灣定價
    const platform = lang === 'en' ? 'intl' : 'tw';
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
    // 同步 platform 按鈕狀態
    platformBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.platform === platform);
    });
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
  // platformBtns already declared above

  platformBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;

      platformBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

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
