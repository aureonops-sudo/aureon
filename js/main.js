/**
 * ============================================================
 * AUREON - Main JavaScript (Optimized)
 * ============================================================
 */

// ==================== GOOGLE SHEETS CONFIG ====================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_e9ZcVFqdMQo6hq9TsQXvL6qfLAMwPQq9Dp8LFQcbBKcK17jBXeJj_dGRbo0JCRisNw/exec';

// ==================== DOM REFERENCES ====================
let preloader, navbar, hamburger, mobileMenu, heroLine, backToTopBtn, stickyCta;

function cacheDOMReferences() {
  preloader = document.getElementById('preloader');
  navbar = document.getElementById('navbar');
  hamburger = document.getElementById('hamburger');
  mobileMenu = document.getElementById('mobileMenu');
  heroLine = document.getElementById('heroLine');
  backToTopBtn = document.getElementById('backToTop');
  stickyCta = document.getElementById('stickyCta');
}

// ==================== PRELOADER & INIT ====================
window.addEventListener('load', () => {
  cacheDOMReferences();

  setTimeout(() => {
    if (preloader) preloader.classList.add('hidden');

    // Stagger initialization for smoother load
    setTimeout(() => {
      if (heroLine) heroLine.classList.add('drawn');
      initRevealObserver();
    }, 100);

    setTimeout(() => {
      initConstellationCanvases();
    }, 300);

    setTimeout(() => {
      initAirplaneProgress();
      initCarousel();
    }, 500);

    setTimeout(() => {
      initSmoothScroll();
      initTiltEffects();
      initLazyImages();
    }, 700);
  }, 2200);
});

// ==================== LAZY IMAGE LOADING ====================
function initLazyImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          imgObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50px' });

    images.forEach(img => imgObserver.observe(img));
  } else {
    images.forEach(img => img.classList.add('loaded'));
  }
}

// ==================== THROTTLED SCROLL HANDLER ====================
let scrollTicking = false;
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;

  if (!scrollTicking) {
    requestAnimationFrame(() => {
      handleScroll(lastScrollY);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

function handleScroll(scrollY) {
  // Navbar
  if (navbar) {
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Sticky CTA
  const hero = document.getElementById('hero');
  if (hero && stickyCta) {
    if (scrollY > hero.offsetHeight) {
      stickyCta.classList.add('show');
    } else {
      stickyCta.classList.remove('show');
    }
  }

  // Back to top
  if (backToTopBtn) {
    if (scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
}

// Back to top click
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('backToTop');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// ==================== MOBILE MENU ====================
document.addEventListener('DOMContentLoaded', () => {
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  if (ham && menu) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
  }
});

function closeMenu() {
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  if (ham && menu) {
    ham.classList.remove('active');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
}
window.closeMenu = closeMenu;

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ==================== REVEAL ON SCROLL ====================
function initRevealObserver() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate numbers
        const nums = entry.target.querySelectorAll('[data-target]');
        if (entry.target.hasAttribute('data-target')) {
          animateNumber(entry.target);
        }
        nums.forEach(n => animateNumber(n));

        // Pillar / result cards
        if (entry.target.classList.contains('pillar-card') ||
            entry.target.classList.contains('result-block')) {
          entry.target.classList.add('visible');
        }

        // Step connector
        if (entry.target.closest('#how-it-works')) {
          const line = document.querySelector('.step-connector-line');
          if (line) setTimeout(() => line.classList.add('drawn'), 500);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ==================== NUMBER ANIMATION ====================
function animateNumber(el) {
  if (el.dataset.animated) return;

  const target = parseFloat(el.dataset.target);
  if (isNaN(target)) return;

  el.dataset.animated = 'true';

  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 1600;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ==================== CONSTELLATION CANVAS (Optimized with Visibility) ====================
class ConstellationCanvas {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.isVisible = false;
    this.animId = null;

    this.options = {
      particleCount: options.particleCount || 45,
      colors: options.colors || [
        { r: 201, g: 169, b: 110 },
        { r: 74, g: 158, b: 255 },
        { r: 139, g: 92, b: 246 },
        { r: 45, g: 212, b: 191 }
      ],
      connectionDistance: options.connectionDistance || 110,
      speed: options.speed || 0.15,
      ...options
    };

    this.resize();
    this.createParticles();
    this.observeVisibility();

    window.addEventListener('resize', () => this.resize());
  }

  observeVisibility() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible && !this.animId) {
          this.animate();
        }
      });
    }, { threshold: 0 });

    obs.observe(this.canvas);
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  createParticles() {
    this.particles = [];
    const count = Math.min(
      this.options.particleCount,
      Math.floor((this.canvas.width * this.canvas.height) / 18000)
    );

    for (let i = 0; i < count; i++) {
      const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];

      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * this.options.speed,
        dy: (Math.random() - 0.5) * this.options.speed,
        alpha: Math.random() * 0.3 + 0.08,
        color,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.015 + Math.random() * 0.025
      });
    }
  }

  animate() {
    if (!this.isVisible) {
      this.animId = null;
      return;
    }

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.options.connectionDistance) {
          const alpha = 0.05 * (1 - dist / this.options.connectionDistance);
          ctx.beginPath();
          ctx.moveTo(this.particles[i].x, this.particles[i].y);
          ctx.lineTo(this.particles[j].x, this.particles[j].y);
          ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Particles
    this.particles.forEach(p => {
      p.twinkle += p.twinkleSpeed;
      const tw = 0.5 + 0.5 * Math.sin(p.twinkle);
      const a = p.alpha * (0.6 + 0.4 * tw);

      // Glow
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${a * 0.35})`);
      g.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.8})`;
      ctx.fill();

      // Move
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;
    });

    this.animId = requestAnimationFrame(() => this.animate());
  }
}

// ==================== INIT CONSTELLATION CANVASES ====================
function initConstellationCanvases() {
  initHeroCanvas();

  const canvases = [
    'solution-canvas', 'industries-canvas', 'healthcare-canvas',
    'pricing-canvas', 'about-canvas', 'cofounder-canvas',
    'philosophy-canvas'
  ];

  canvases.forEach(id => {
    new ConstellationCanvas(id, { particleCount: 35 });
  });
}

// ==================== HERO CANVAS (Enhanced) ====================
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = -1000;
  let mouseY = -1000;
  let isVisible = true;

  const colors = [
    { r: 201, g: 169, b: 110 },
    { r: 74, g: 158, b: 255 },
    { r: 139, g: 92, b: 246 },
    { r: 45, g: 212, b: 191 },
    { r: 255, g: 200, b: 120 }
  ];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 10000));

    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isBright = Math.random() < 0.25;

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: isBright ? (Math.random() * 2.5 + 1) : (Math.random() * 1.5 + 0.3),
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25,
        baseAlpha: isBright ? (Math.random() * 0.4 + 0.3) : (Math.random() * 0.2 + 0.05),
        color,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
        isBright
      });
    }
  }

  // Throttled mouse
  let mouseThrottle = false;
  canvas.addEventListener('mousemove', (e) => {
    if (mouseThrottle) return;
    mouseThrottle = true;
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    setTimeout(() => mouseThrottle = false, 16);
  }, { passive: true });

  canvas.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  // Visibility
  const obs = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  });
  obs.observe(canvas);

  function animate() {
    if (!isVisible) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = 0.07 * (1 - dist / 130);
          const p1 = particles[i];
          const p2 = particles[j];

          const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          grad.addColorStop(0, `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${alpha})`);
          grad.addColorStop(1, `rgba(${p2.color.r}, ${p2.color.g}, ${p2.color.b}, ${alpha})`);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Mouse connections
    if (mouseX > 0 && mouseY > 0) {
      particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const alpha = 0.1 * (1 - dist / 180);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    }

    // Particles
    particles.forEach(p => {
      p.twinkle += p.twinkleSpeed;
      const tw = 0.5 + 0.5 * Math.sin(p.twinkle);
      let currentAlpha = p.baseAlpha * (0.6 + 0.4 * tw);
      let currentR = p.r;

      // Mouse interaction
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const mouseDist = Math.sqrt(dx * dx + dy * dy);

      if (mouseDist < 160) {
        const factor = 1 - mouseDist / 160;
        currentAlpha = Math.min(currentAlpha + factor * 0.35, 0.95);
        currentR = p.r + factor * 1.5;
      }

      // Bright outer glow
      if (p.isBright) {
        const outerG = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentR * 10);
        outerG.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.12})`);
        outerG.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR * 10, 0, Math.PI * 2);
        ctx.fillStyle = outerG;
        ctx.fill();
      }

      // Mid glow
      const midG = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentR * 4);
      midG.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.35})`);
      midG.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentR * 4, 0, Math.PI * 2);
      ctx.fillStyle = midG;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.85})`;
      ctx.fill();

      // Move
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < -15) p.x = canvas.width + 15;
      if (p.x > canvas.width + 15) p.x = -15;
      if (p.y < -15) p.y = canvas.height + 15;
      if (p.y > canvas.height + 15) p.y = -15;
    });

    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  animate();
}

// ==================== CAROUSEL ====================
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const progressFill = document.getElementById('carouselProgress');

  if (!track || !progressFill) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.parentElement.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.parentElement.scrollLeft = scrollLeft - walk;
  });

  const wrapper = track.parentElement;
  wrapper.style.overflowX = 'auto';
  wrapper.style.scrollbarWidth = 'none';
  wrapper.style.msOverflowStyle = 'none';

  // Throttled progress update
  let scrollThrottle = false;
  wrapper.addEventListener('scroll', () => {
    if (scrollThrottle) return;
    scrollThrottle = true;
    requestAnimationFrame(() => {
      const max = wrapper.scrollWidth - wrapper.clientWidth;
      const pct = max > 0 ? (wrapper.scrollLeft / max) * 100 : 0;
      progressFill.style.width = Math.max(20, pct) + '%';
      scrollThrottle = false;
    });
  }, { passive: true });

  // Auto scroll
  let autoScroll;
  let paused = false;

  function startAuto() {
    if (autoScroll) return;
    autoScroll = setInterval(() => {
      if (paused) return;
      if (wrapper.scrollLeft >= wrapper.scrollWidth - wrapper.clientWidth - 10) {
        wrapper.scrollLeft = 0;
      } else {
        wrapper.scrollLeft += 1;
      }
    }, 35);
  }

  startAuto();

  wrapper.addEventListener('mouseenter', () => paused = true);
  wrapper.addEventListener('mouseleave', () => paused = false);
}

// ==================== TILT EFFECTS ====================
function initTiltEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.pillar-card, .mockup-card, .tier-card');

  cards.forEach(card => {
    let tiltThrottle = false;

    card.addEventListener('mousemove', (e) => {
      if (tiltThrottle) return;
      tiltThrottle = true;

      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = (y - cy) / cy * -2.5;
        const ry = (x - cx) / cx * 2.5;

        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        tiltThrottle = false;
      });
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ==================== AIRPLANE PROGRESS ====================
function initAirplaneProgress() {
  const storyWrapper = document.querySelector('.story-timeline-wrapper');
  const airplane = document.getElementById('airplaneIcon');
  const trackFill = document.getElementById('trackLineFill');
  const chapters = document.querySelectorAll('.story-chapter');
  const milestoneDots = document.querySelectorAll('.milestone-dot');
  const journeyComplete = document.querySelector('.journey-complete');

  if (!storyWrapper || !airplane || !trackFill || chapters.length === 0) return;

  let chapterPositions = [];
  let isMobile = window.innerWidth <= 768;

  function calculatePositions() {
    isMobile = window.innerWidth <= 768;
    chapterPositions = [];

    const wrapperHeight = storyWrapper.offsetHeight;

    chapters.forEach((chapter) => {
      const relPos = chapter.offsetTop / wrapperHeight;
      chapterPositions.push({
        element: chapter,
        position: relPos,
        top: chapter.offsetTop
      });
    });

    positionMilestones();
  }

  function positionMilestones() {
    milestoneDots.forEach((dot, i) => {
      if (i < chapterPositions.length) {
        if (isMobile) {
          dot.style.left = `${5 + chapterPositions[i].position * 90}%`;
          dot.style.top = '50%';
        } else {
          dot.style.top = `${chapterPositions[i].position * 100}%`;
        }
      } else if (dot.classList.contains('milestone-end')) {
        if (isMobile) {
          dot.style.left = '95%';
          dot.style.top = '50%';
        } else {
          dot.style.top = '100%';
        }
      }
    });
  }

  function updateProgress() {
    const wrapperRect = storyWrapper.getBoundingClientRect();
    const winH = window.innerHeight;
    const wrapperH = wrapperRect.height;

    const startOff = winH * 0.7;
    const endOff = winH * 0.3;

    const scrolled = startOff - wrapperRect.top;
    const totalDist = wrapperH - (winH - startOff - endOff);
    const progress = Math.max(0, Math.min(1, scrolled / totalDist));

    // Position airplane and fill
    if (isMobile) {
      const leftPos = 5 + progress * 90;
      airplane.style.left = `${leftPos}%`;
      airplane.style.top = '50%';
      airplane.style.transform = 'translate(-50%, -50%)';
      trackFill.style.width = `${progress * 100}%`;
      trackFill.style.height = '100%';
    } else {
      airplane.style.top = `${progress * 100}%`;
      airplane.style.left = '50%';
      airplane.style.transform = 'translateX(-50%) translateY(-50%)';
      trackFill.style.height = `${progress * 100}%`;
    }

    // Chapters and milestones
    chapterPositions.forEach((data, i) => {
      const threshold = Math.max(0, data.position - 0.08);

      if (progress >= threshold) {
        data.element.classList.add('active');
      } else {
        data.element.classList.remove('active');
      }

      if (milestoneDots[i]) {
        const dot = milestoneDots[i];

        if (progress >= data.position - 0.02) {
          dot.classList.add('passed');
        } else {
          dot.classList.remove('passed');
        }

        const nextPos = chapterPositions[i + 1]?.position || 1;
        const isNear = progress >= data.position - 0.05 && progress < nextPos - 0.05;

        if (isNear) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      }
    });

    // End milestone
    const endDot = document.querySelector('.milestone-end');
    if (endDot) {
      if (progress >= 0.95) {
        endDot.classList.add('passed', 'active');
      } else {
        endDot.classList.remove('passed', 'active');
      }
    }

    // Journey complete
    if (journeyComplete) {
      if (progress >= 0.9) {
        journeyComplete.classList.add('visible');
      } else {
        journeyComplete.classList.remove('visible');
      }
    }
  }

  // Throttled scroll
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Resize
  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      calculatePositions();
      updateProgress();
    }, 150);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  setTimeout(() => {
    calculatePositions();
    updateProgress();
  }, 200);
}

// ==================== GOOGLE SHEETS SUBMISSION ====================
async function submitToGoogleSheets(data) {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return true;
  } catch (err) {
    console.error('Form submission error:', err);
    return false;
  }
}

// ==================== MODAL FUNCTIONS ====================
function openModal(e) {
  e.preventDefault();
  const modal = document.getElementById('demoModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('demoModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      const form = document.getElementById('demoForm');
      const success = document.getElementById('formSuccess');
      if (form) form.style.display = '';
      if (success) success.style.display = 'none';
    }, 400);
  }
}

function submitForm(e) {
  e.preventDefault();

  const form = document.getElementById('demoForm');
  const data = {
    name: form.querySelector('input[placeholder="Your name"]')?.value || '',
    business: form.querySelector('input[placeholder="Your business"]')?.value || '',
    email: form.querySelector('input[type="email"]')?.value || '',
    phone: form.querySelector('input[type="tel"]')?.value || '',
    business_type: form.querySelector('select')?.value || '',
    form_type: 'Demo Request'
  };

  submitToGoogleSheets(data);

  document.getElementById('demoForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';

  setTimeout(closeModal, 2500);
}

function openContactModal(e) {
  e.preventDefault();
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      const form = document.getElementById('contactForm');
      const success = document.getElementById('contactSuccess');
      if (form) form.style.display = '';
      if (success) success.style.display = 'none';
    }, 400);
  }
}

function submitContact(e) {
  e.preventDefault();

  const form = document.getElementById('contactForm');
  const inputs = form.querySelectorAll('input');
  const data = {
    name: inputs[0]?.value || '',
    email: inputs[1]?.value || '',
    message: form.querySelector('textarea')?.value || '',
    form_type: 'Contact Message'
  };

  submitToGoogleSheets(data);

  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('contactSuccess').style.display = 'block';

  setTimeout(closeContactModal, 2500);
}

// Expose to global scope
window.openModal = openModal;
window.closeModal = closeModal;
window.submitForm = submitForm;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.submitContact = submitContact;

// ==================== MODAL OVERLAY CLICK & KEYBOARD ====================
document.addEventListener('DOMContentLoaded', () => {
  const demoModal = document.getElementById('demoModal');
  const contactModal = document.getElementById('contactModal');

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
  }

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeContactModal();
    });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const dm = document.getElementById('demoModal');
    const cm = document.getElementById('contactModal');
    const mm = document.getElementById('mobileMenu');

    if (dm && dm.classList.contains('open')) closeModal();
    if (cm && cm.classList.contains('open')) closeContactModal();
    if (mm && mm.classList.contains('open')) closeMenu();
  }
});
