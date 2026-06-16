// ════════════════════════════════════════════════
// PAGE NAVIGATION & TRANSITIONS
// ════════════════════════════════════════════════
function go(page) {
  const current = document.querySelector('.page.active');
  const next = document.getElementById(`page-${page}`);
  
  if (!next) return;
  
  current.classList.add('out');
  setTimeout(() => {
    current.classList.remove('active');
    next.classList.add('active');
  }, 350);
}

function goContact() {
  go('main');
  setTimeout(() => {
    document.getElementById('main-contact')?.scrollIntoView({ behavior: 'smooth' });
  }, 400);
}

// ════════════════════════════════════════════════
// MOBILE MENU
// ════════════════════════════════════════════════
function toggleMob() {
  const mob = document.getElementById('mob');
  const burger = document.getElementById('burger');
  mob.classList.toggle('open');
  burger.classList.toggle('on');
}

function closeMob() {
  const mob = document.getElementById('mob');
  const burger = document.getElementById('burger');
  mob.classList.remove('open');
  burger.classList.remove('on');
}

// ════════════════════════════════════════════════
// CURSOR GLOW EFFECT
// ════════════════════════════════════════════════
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
  if (cursorGlow) {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  }
});

// ════════════════════════════════════════════════
// FLOATING CTA VISIBILITY
// ════════════════════════════════════════════════
const floatingCta = document.getElementById('floatingCta');
const landingPage = document.getElementById('page-landing');

if (floatingCta && landingPage) {
  window.addEventListener('scroll', () => {
    const rect = landingPage.getBoundingClientRect();
    if (rect.bottom < window.innerHeight) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  });
}

// ════════════════════════════════════════════════
// STAT COUNTER ANIMATION
// ════════════════════════════════════════════════
function animateCounters() {
  const counters = document.querySelectorAll('.stat-n');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'), 10);
    const increment = target / 30;
    let current = 0;
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(interval);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 50);
  });
}

// Trigger on page load and when main page becomes active
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id === 'page-main') {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  });
  observer.observe(document.getElementById('page-main') || {});
});

// ════════════════════════════════════════════════
// REVEAL ON SCROLL ANIMATION
// ════════════════════════════════════════════════
function setupRevealAnimation() {
  const revealElements = document.querySelectorAll('.rev');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
      }
    });
  }, { threshold: 0.1 });
  
  revealElements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', setupRevealAnimation);

// ════════════════════════════════════════════════
// PARTICLES CANVAS (LANDING PAGE)
// ════════════════════════════════════════════════
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x < 0) this.x = this.canvas.width;
    if (this.x > this.canvas.width) this.x = 0;
    if (this.y < 0) this.y = this.canvas.height;
    if (this.y > this.canvas.height) this.y = 0;
  }
  
  draw(ctx) {
    ctx.fillStyle = 'rgba(0, 229, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  let particles = [];
  
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle(canvas));
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

document.addEventListener('DOMContentLoaded', initParticles);

// ════════════════════════════════════════════════
// 3D CANVAS PLACEHOLDER (THREEJS INTEGRATION)
// ════════════════════════════════════════════════
function init3DCanvas() {
  const canvas = document.getElementById('proj-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Simple placeholder gradient for 3D canvas
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#003DBF');
  gradient.addColorStop(1, '#00E5FF');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('3D Project Viewer', canvas.width / 2, canvas.height / 2);
}

document.addEventListener('DOMContentLoaded', init3DCanvas);

// ════════════════════════════════════════════════
// FIELD SCENE CANVAS PLACEHOLDER
// ════════════════════════════════════════════════
function initFieldScene() {
  const canvas = document.getElementById('field-scene');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  // Simple animated background effect
  let time = 0;
  
  function animate() {
    time += 0.01;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle animated waves
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    for (let x = 0; x < canvas.width; x += 50) {
      const y = Math.sin((x + time * 50) * 0.01) * 20 + canvas.height / 2;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

document.addEventListener('DOMContentLoaded', initFieldScene);

// ════════════════════════════════════════════════
// TESTIMONIAL SCROLL DUPLICATION
// ════════════════════════════════════════════════
function setupTestimonialScroll() {
  const scroll = document.getElementById('testiScroll');
  if (!scroll) return;
  
  const items = Array.from(scroll.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    scroll.appendChild(clone);
  });
}

document.addEventListener('DOMContentLoaded', setupTestimonialScroll);

// ════════════════════════════════════════════════
// 3D PAGE FILTER BUTTONS
// ════════════════════════════════════════════════
function setup3DFilters() {
  const filterBtns = document.querySelectorAll('.f-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('on'));
      this.classList.add('on');
    });
  });
  
  // Set first button active
  if (filterBtns.length > 0) {
    filterBtns[0].classList.add('on');
  }
}

document.addEventListener('DOMContentLoaded', setup3DFilters);

// ════════════════════════════════════════════════
// 3D PANEL ITEM SELECTION
// ════════════════════════════════════════════════
function setup3DPanel() {
  const items = document.querySelectorAll('.t3-item');
  const detailPanel = document.querySelector('.t3-detail');
  
  items.forEach(item => {
    item.addEventListener('click', function() {
      items.forEach(i => i.classList.remove('on'));
      this.classList.add('on');
      
      if (detailPanel) {
        detailPanel.classList.add('vis');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', setup3DPanel);

// ════════════════════════════════════════════════
// GALLERY IMAGE MODAL (OPTIONAL)
// ════════════════════════════════════════════════
function setupGallery() {
  const figures = document.querySelectorAll('.gal figure');
  figures.forEach(fig => {
    fig.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (img && img.src) {
        // Could open a modal or lightbox here
        console.log('Gallery image clicked:', img.src);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', setupGallery);

// ════════════════════════════════════════════════
// SMOOTH SCROLL ANCHOR LINKS
// ════════════════════════════════════════════════
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  
  const href = link.getAttribute('href');
  const target = document.querySelector(href);
  
  if (target && href !== '#') {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  }
});

// ════════════════════════════════════════════════
// INIT: RUN ALL SETUP FUNCTIONS
// ════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  console.log('Austine Tech Innovation Hub initialized');
});
