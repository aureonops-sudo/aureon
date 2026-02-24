/**
 * ============================================================
 * AUREON - Main JavaScript
 * ============================================================
 */

// ==================== DOM ELEMENTS ====================
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const heroLine = document.getElementById('heroLine');
const backToTopBtn = document.getElementById('backToTop');
const stickyCta = document.getElementById('stickyCta');
const carouselTrack = document.getElementById('carouselTrack');
const carouselProgress = document.getElementById('carouselProgress');

// ==================== GOOGLE SHEETS CONFIG ====================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_e9ZcVFqdMQo6hq9TsQXvL6qfLAMwPQq9Dp8LFQcbBKcK17jBXeJj_dGRbo0JCRisNw/exec';

// ==================== PRELOADER ====================
window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => {
      if (heroLine) heroLine.classList.add('drawn');
      initRevealObserver();
      initConstellationCanvases();
      initAirplaneProgress();
      initTiltEffects();
      initCarousel();
      initSmoothScroll();
    }, 300);
  }, 2400);
});

// ==================== NAVIGATION ====================
window.addEventListener('scroll', () => {
  // Navbar scroll effect
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Sticky CTA visibility
  const hero = document.getElementById('hero');
  if (hero && stickyCta) {
    if (window.scrollY > hero.offsetHeight) {
      stickyCta.classList.add('show');
    } else {
      stickyCta.classList.remove('show');
    }
  }

  // Back to top button visibility
  if (backToTopBtn) {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
});

// Back to top click handler
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== MOBILE MENU ====================
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}

function closeMenu() {
  if (hamburger && mobileMenu) {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Make closeMenu globally available
window.closeMenu = closeMenu;

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        
        // Animate numbers if present
        const nums = entry.target.querySelectorAll('[data-target]');
        if (entry.target.hasAttribute('data-target')) {
          animateNumber(entry.target);
        }
        nums.forEach(n => animateNumber(n));
        
        // Add visible class to cards
        if (entry.target.classList.contains('pillar-card')) {
          entry.target.classList.add('visible');
        }
        if (entry.target.classList.contains('result-block')) {
          entry.target.classList.add('visible');
        }
        
        // Draw step connector
        if (entry.target.closest('#how-it-works')) {
          const connectorLine = document.querySelector('.step-connector-line');
          if (connectorLine) {
            setTimeout(() => connectorLine.classList.add('drawn'), 500);
          }
        }
        
        // Mission divider
        const missionDiv = document.getElementById('missionDivider');
        if (missionDiv && entry.target === missionDiv) {
          setTimeout(() => missionDiv.classList.add('drawn'), 300);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
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
  const duration = 1800;
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

// ==================== CONSTELLATION CANVAS CLASS ====================
class ConstellationCanvas {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.options = {
      particleCount: options.particleCount || 60,
      colors: options.colors || [
        { r: 201, g: 169, b: 110 },
        { r: 74, g: 158, b: 255 },
        { r: 139, g: 92, b: 246 },
        { r: 45, g: 212, b: 191 }
      ],
      connectionDistance: options.connectionDistance || 120,
      speed: options.speed || 0.2,
      ...options
    };
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
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
      Math.floor((this.canvas.width * this.canvas.height) / 15000)
    );
    
    for (let i = 0; i < count; i++) {
      const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
      const isBright = Math.random() < 0.25;
      
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: isBright ? (Math.random() * 2 + 1) : (Math.random() * 1.5 + 0.3),
        dx: (Math.random() - 0.5) * this.options.speed,
        dy: (Math.random() - 0.5) * this.options.speed,
        baseAlpha: isBright ? (Math.random() * 0.4 + 0.3) : (Math.random() * 0.2 + 0.05),
        color: color,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
        isBright: isBright
      });
    }
  }
  
  animate() {
    if (!this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.options.connectionDistance) {
          const alpha = 0.06 * (1 - dist / this.options.connectionDistance);
          const p1 = this.particles[i];
          const p2 = this.particles[j];
          
          const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          gradient.addColorStop(0, `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${alpha})`);
          gradient.addColorStop(1, `rgba(${p2.color.r}, ${p2.color.g}, ${p2.color.b}, ${alpha})`);
          
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
    
    // Draw particles
    this.particles.forEach(p => {
      p.twinklePhase += p.twinkleSpeed;
      const twinkle = 0.5 + 0.5 * Math.sin(p.twinklePhase);
      const currentAlpha = p.baseAlpha * (0.6 + 0.4 * twinkle);
      
      // Glow
      const glow = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      glow.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.4})`);
      glow.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      this.ctx.fillStyle = glow;
      this.ctx.fill();
      
      // Core
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`;
      this.ctx.fill();
      
      // Move
      p.x += p.dx;
      p.y += p.dy;
      
      // Wrap
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// ==================== INITIALIZE CONSTELLATION CANVASES ====================
function initConstellationCanvases() {
  // Hero canvas (special enhanced version)
  initHeroCanvas();
  
  // Other dark section canvases
  new ConstellationCanvas('solution-canvas', { particleCount: 50 });
  new ConstellationCanvas('industries-canvas', { particleCount: 40 });
  new ConstellationCanvas('healthcare-canvas', { particleCount: 55 });
  new ConstellationCanvas('pricing-canvas', { particleCount: 45 });
  new ConstellationCanvas('about-canvas', { particleCount: 50 });
  new ConstellationCanvas('personality-canvas', { particleCount: 40 });
  new ConstellationCanvas('cofounder-canvas', { particleCount: 35 });
  new ConstellationCanvas('cta-canvas', { particleCount: 50 });
}

// ==================== HERO CANVAS (Enhanced) ====================
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = -1000;
  let mouseY = -1000;
  
  const colors = [
    { r: 201, g: 169, b: 110 },
    { r: 74, g: 158, b: 255 },
    { r: 139, g: 92, b: 246 },
    { r: 45, g: 212, b: 191 },
    { r: 255, g: 200, b: 120 },
    { r: 100, g: 180, b: 255 }
  ];
  
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    particles = [];
    createParticles();
  }
  
  function createParticles() {
    const density = Math.floor((canvas.width * canvas.height) / 8000);
    const count = Math.min(Math.max(density, 80), 200);
    
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isBright = Math.random() < 0.3;
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: isBright ? (Math.random() * 2.5 + 1.5) : (Math.random() * 1.8 + 0.3),
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        baseAlpha: isBright ? (Math.random() * 0.4 + 0.4) : (Math.random() * 0.25 + 0.05),
        color: color,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        isBright: isBright
      });
    }
  }
  
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  
  canvas.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const alpha = 0.08 * (1 - dist / 150);
          const p1 = particles[i];
          const p2 = particles[j];
          
          const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          gradient.addColorStop(0, `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${alpha})`);
          gradient.addColorStop(1, `rgba(${p2.color.r}, ${p2.color.g}, ${p2.color.b}, ${alpha})`);
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    
    // Draw mouse connections
    if (mouseX > 0 && mouseY > 0) {
      particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const alpha = 0.12 * (1 - dist / 200);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    }
    
    // Draw particles
    particles.forEach(p => {
      p.twinklePhase += p.twinkleSpeed;
      const twinkle = 0.5 + 0.5 * Math.sin(p.twinklePhase);
      let currentAlpha = p.baseAlpha * (0.6 + 0.4 * twinkle);
      let currentR = p.r;
      
      // Mouse interaction
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const mouseDist = Math.sqrt(dx * dx + dy * dy);
      
      if (mouseDist < 180) {
        const factor = 1 - mouseDist / 180;
        currentAlpha = Math.min(currentAlpha + factor * 0.4, 1);
        currentR = p.r + factor * 2;
        p.x -= dx * 0.003;
        p.y -= dy * 0.003;
      }
      
      // Outer glow for bright particles
      if (p.isBright) {
        const outerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentR * 12);
        outerGlow.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.15})`);
        outerGlow.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR * 12, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();
      }
      
      // Mid glow
      const midGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentR * 5);
      midGlow.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.4})`);
      midGlow.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentR * 5, 0, Math.PI * 2);
      ctx.fillStyle = midGlow;
      ctx.fill();
      
      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`;
      ctx.fill();
      
      // Move particle
      p.x += p.dx;
      p.y += p.dy;
      
      // Wrap around edges
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;
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
  
  const carouselWrapper = track.parentElement;
  carouselWrapper.style.overflowX = 'auto';
  carouselWrapper.style.scrollbarWidth = 'none';
  carouselWrapper.style.msOverflowStyle = 'none';
  
  // Update progress bar on scroll
  carouselWrapper.addEventListener('scroll', () => {
    const maxScroll = carouselWrapper.scrollWidth - carouselWrapper.clientWidth;
    const pct = maxScroll > 0 ? (carouselWrapper.scrollLeft / maxScroll) * 100 : 0;
    progressFill.style.width = Math.max(20, pct) + '%';
  });
  
  // Auto scroll
  let autoScrollInterval;
  
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      if (carouselWrapper.scrollLeft >= carouselWrapper.scrollWidth - carouselWrapper.clientWidth - 10) {
        carouselWrapper.scrollLeft = 0;
      } else {
        carouselWrapper.scrollLeft += 1;
      }
    }, 30);
  }
  
  startAutoScroll();
  
  carouselWrapper.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
  });
  
  carouselWrapper.addEventListener('mouseleave', () => {
    startAutoScroll();
  });
}

// ==================== TILT EFFECTS ====================
function initTiltEffects() {
  const tiltCards = document.querySelectorAll('.pillar-card, .mockup-card, .tier-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -3;
      const rotateY = (x - centerX) / centerX * 3;
      
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ==================== AIRPLANE PROGRESS INDICATOR ====================
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
  
  // Calculate chapter positions
  function calculatePositions() {
    isMobile = window.innerWidth <= 768;
    chapterPositions = [];
    
    const wrapperHeight = storyWrapper.offsetHeight;
    
    chapters.forEach((chapter, index) => {
      const chapterTop = chapter.offsetTop;
      const relativePosition = chapterTop / wrapperHeight;
      
      chapterPositions.push({
        element: chapter,
        position: relativePosition,
        top: chapterTop
      });
    });
    
    positionMilestones();
  }
  
  // Position milestone dots
  function positionMilestones() {
    milestoneDots.forEach((dot, index) => {
      if (index < chapterPositions.length) {
        if (isMobile) {
          const leftPercent = 5 + (chapterPositions[index].position * 90);
          dot.style.left = `${leftPercent}%`;
          dot.style.top = '50%';
        } else {
          const topPercent = chapterPositions[index].position * 100;
          dot.style.top = `${topPercent}%`;
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
  
  // Update progress
  function updateProgress() {
    const wrapperRect = storyWrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const wrapperHeight = wrapperRect.height;
    
    const startOffset = windowHeight * 0.7;
    const endOffset = windowHeight * 0.3;
    
    const scrolled = startOffset - wrapperRect.top;
    const totalDistance = wrapperHeight - (windowHeight - startOffset - endOffset);
    const rawProgress = scrolled / totalDistance;
    
    const progress = Math.max(0, Math.min(1, rawProgress));
    
    // Update track fill and airplane position
    if (isMobile) {
      const leftPosition = 5 + (progress * 90);
      airplane.style.left = `${leftPosition}%`;
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
    
    // Update chapters and milestones
    chapterPositions.forEach((chapterData, index) => {
      const chapter = chapterData.element;
      const chapterProgress = chapterData.position;
      const activationThreshold = Math.max(0, chapterProgress - 0.08);
      
      if (progress >= activationThreshold) {
        chapter.classList.add('active');
      } else {
        chapter.classList.remove('active');
      }
      
      if (milestoneDots[index]) {
        const dot = milestoneDots[index];
        
        if (progress >= chapterProgress - 0.02) {
          dot.classList.add('passed');
        } else {
          dot.classList.remove('passed');
        }
        
        const nextPosition = chapterPositions[index + 1]?.position || 1;
        const isNearMilestone = progress >= chapterProgress - 0.05 && progress < nextPosition - 0.05;
        
        if (isNearMilestone) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      }
    });
    
    // End milestone
    const endMilestone = document.querySelector('.milestone-end');
    if (endMilestone) {
      if (progress >= 0.95) {
        endMilestone.classList.add('passed', 'active');
      } else {
        endMilestone.classList.remove('passed', 'active');
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
  
  // Throttled scroll handler
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
  
  // Handle resize
  let resizeTimeout;
  function onResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      calculatePositions();
      updateProgress();
    }, 100);
  }
  
  // Initialize
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  
  setTimeout(() => {
    calculatePositions();
    updateProgress();
  }, 100);
  
  window.addEventListener('load', () => {
    calculatePositions();
    updateProgress();
  });
}

// ==================== FORM SUBMISSION TO GOOGLE SHEETS ====================
async function submitToGoogleSheets(data) {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    console.log('Form submitted successfully');
    return true;
  } catch (error) {
    console.error('Error submitting form:', error);
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
  const formData = {
    name: form.querySelector('input[placeholder="Your name"]').value,
    business: form.querySelector('input[placeholder="Your business"]').value,
    email: form.querySelector('input[type="email"]').value,
    phone: form.querySelector('input[type="tel"]').value,
    business_type: form.querySelector('select').value,
    form_type: 'Demo Request'
  };
  
  // Submit to Google Sheets
  submitToGoogleSheets(formData);
  
  // Show success message
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
  const formData = {
    name: inputs[0].value,
    email: inputs[1].value,
    message: form.querySelector('textarea').value,
    form_type: 'Contact Message'
  };
  
  // Submit to Google Sheets
  submitToGoogleSheets(formData);
  
  // Show success message
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('contactSuccess').style.display = 'block';
  
  setTimeout(closeContactModal, 2500);
}

// Make modal functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
window.submitForm = submitForm;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.submitContact = submitContact;

// ==================== MODAL OVERLAY CLICK HANDLERS ====================
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

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const demoModal = document.getElementById('demoModal');
    const contactModal = document.getElementById('contactModal');
    
    if (demoModal && demoModal.classList.contains('open')) {
      closeModal();
    }
    if (contactModal && contactModal.classList.contains('open')) {
      closeContactModal();
    }
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  }
});