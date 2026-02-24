/* ===========================
   EASYWEB — script.js
   =========================== */

'use strict';

/* ---- CUSTOM CURSOR ---- */
(function () {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .faq__question, .service__card, .why__item');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
})();


/* ---- HEADER SCROLL ---- */
(function () {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ---- HAMBURGER / MOBILE NAV ---- */
(function () {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  const links = nav.querySelectorAll('.mobile-nav__link');

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('active');
    nav.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();


/* ---- FADE-IN (hero elements via data-delay) ---- */
(function () {
  const els = document.querySelectorAll('.fade-in[data-delay]');
  els.forEach(el => {
    const delay = parseInt(el.dataset.delay || 0, 10);
    el.style.animationDelay = delay + 'ms';
  });
})();


/* ---- SCROLL REVEAL ---- */
(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  targets.forEach(el => observer.observe(el));
})();


/* ---- FAQ ACCORDION ---- */
(function () {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq__answer');
        const b = i.querySelector('.faq__question');
        if (a) a.style.maxHeight = null;
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ---- SMOOTH SCROLL (anchor links) ---- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      const headerH = document.getElementById('header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ---- NUMBER COUNTER ANIMATION ---- */
(function () {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  const animateCount = (el) => {
    const text = el.textContent.trim();
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return;

    const suffix = text.replace(/[0-9.,]/g, '');
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = num * ease;

      const formatted = Number.isInteger(num)
        ? Math.floor(current).toLocaleString('ja-JP')
        : current.toFixed(1);

      el.textContent = formatted + suffix;

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();


/* ---- PARALLAX HERO GRADIENT ---- */
(function () {
  const gradient = document.querySelector('.hero__gradient');
  if (!gradient) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const opacity = Math.max(0, 1 - scrollY / 500);
    gradient.style.opacity = opacity;
  }, { passive: true });
})();


/* ---- FORM SUBMIT FEEDBACK ---- */
(function () {
  const form = document.querySelector('.contact__form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;

    // Allow Netlify to handle submission
    btn.textContent = '送信中...';
    btn.disabled = true;
    btn.style.opacity = '0.6';
  });
})();


/* ---- WORKS GRID — hover tilt ---- */
(function () {
  const cards = document.querySelectorAll('.works__card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ---- ACTIVE NAV LINK ON SCROLL ---- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));
})();
