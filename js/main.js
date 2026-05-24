// Scroll Progress Bar
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  if (scrollProgress) scrollProgress.style.width = progress + '%';
});

// Particles
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37, 99, 235, ${p.opacity})`;
      ctx.fill();

      // Connect nearby particles
      particles.slice(i + 1).forEach(p2 => {
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    animId = requestAnimationFrame(draw);
  }
  draw();
}

// Typing Effect
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const text = el.dataset.text || el.textContent;
  el.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.style.cssText = 'display:inline-block;width:2px;height:1em;background:#2563EB;margin-left:2px;animation:blink 1s infinite;vertical-align:middle;';
  el.appendChild(cursor);

  const style = document.createElement('style');
  style.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
  document.head.appendChild(style);

  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(type, 40);
    } else {
      setTimeout(() => { cursor.style.display = 'none'; }, 2000);
    }
  }
  setTimeout(type, 600);
}

// Scroll Reveal
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// Counter Animation
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  function update() {
    start += step;
    if (start >= target) { el.textContent = target + '+'; return; }
    el.textContent = Math.floor(start) + '+';
    requestAnimationFrame(update);
  }
  update();
}

function initCounters() {
  const counters = document.querySelectorAll('.proof-num');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        animateCounter(entry.target, target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// FAQ Accordion
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ROI Calculator
function initROI() {
  const slider = document.getElementById('salary-slider');
  const display = document.getElementById('salary-display');
  const payback = document.getElementById('payback-days');
  if (!slider) return;

  function update() {
    const salary = parseInt(slider.value);
    const monthly = salary * 100000 / 12;
    const daily = monthly / 30;
    const days = Math.ceil(7999 / daily);
    display.textContent = '₹' + salary + ' LPA';
    payback.textContent = days + ' days';
  }
  slider.addEventListener('input', update);
  update();
}

// Delivery Date
function setDeliveryDate() {
  const el = document.getElementById('delivery-date');
  if (!el) return;
  const d = new Date();
  d.setDate(d.getDate() + 7);
  el.textContent = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// Init all
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTyping();
  initReveal();
  initCounters();
  initFAQ();
  initROI();
  setDeliveryDate();
});
