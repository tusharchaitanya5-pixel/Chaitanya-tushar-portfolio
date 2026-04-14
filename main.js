/* ============================================================
   Chaitanya Tushar — BFSI Portfolio · main.js
   ============================================================ */

(function () {

  /* ── Theme Toggle ──────────────────────────────────────────── */
  const root   = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  const setIcon = () => {
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
  };

  setIcon();
  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    setIcon();
  });


  /* ── Custom Cursor ─────────────────────────────────────────── */
  const dot         = document.getElementById('cursorDot');
  const circle      = document.getElementById('cursorCircle');
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  let mouseX = 0, mouseY = 0, circleX = 0, circleY = 0;

  if (finePointer && dot && circle) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    const loop = () => {
      circleX += (mouseX - circleX) * 0.12;
      circleY += (mouseY - circleY) * 0.12;
      circle.style.left = circleX + 'px';
      circle.style.top  = circleY + 'px';
      requestAnimationFrame(loop);
    };
    loop();

    document.querySelectorAll('a, button, .stat-card, .timeline-card, .skill-group, .edu-card, .tag, .contact-link')
      .forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; circle.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; circle.style.opacity = '0.7'; });
  }


  /* ── Scroll Progress Bar ───────────────────────────────────── */
  const scrollBar = document.getElementById('scrollBar');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollBar.style.width = pct + '%';
  }, { passive: true });


  /* ── Reveal on Scroll (timeline, skills, education cards) ──── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('skill-group')) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.timeline-item, .skill-group, .edu-card')
    .forEach(el => revealObserver.observe(el));


  /* ── Animated Stat Counters ────────────────────────────────── */
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const raw = el.dataset.raw;
        if (raw) { el.textContent = raw; return; }

        const target   = Number(el.dataset.count || 0);
        const suffix   = el.dataset.suffix || '';
        const start    = performance.now();
        const duration = 1500;

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });

      observer.disconnect();
    });
  }, { threshold: 0.4 });

  const statsWrap = document.querySelector('.hero-stats');
  if (statsWrap) statObserver.observe(statsWrap);


  /* ── Floating Particles ────────────────────────────────────── */
  const particleContainer = document.getElementById('particles');
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.setProperty('--dur',   (6 + Math.random() * 9) + 's');
    p.style.setProperty('--delay', (Math.random() * 10) + 's');
    p.style.setProperty('--drift', ((Math.random() - 0.5) * 80) + 'px');
    p.style.width  = (1 + Math.random() * 2) + 'px';
    p.style.height = p.style.width;
    particleContainer.appendChild(p);
  }


  /* ── Active Nav Link on Scroll ─────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const setActive = () => {
    let current = 'about';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 140) current = section.id;
    });
    navLinks.forEach(link =>
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current)
    );
  };

  setActive();
  window.addEventListener('scroll', setActive, { passive: true });


  /* ── Mobile Nav Toggle ─────────────────────────────────────── */
  const mobileToggle = document.getElementById('mobileToggle');
  const nav          = document.getElementById('navLinks');

  mobileToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });

  // Close mobile nav when a link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.setAttribute('aria-label', 'Open navigation');
    });
  });

})();
