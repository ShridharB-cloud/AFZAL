/* ── app.js — Al Ni'mah Housewarming ── */

(function () {
  'use strict';

  // ── DOM refs ──
  const intro       = document.getElementById('intro');
  const tapPrompt   = document.getElementById('tapPrompt');
  const wrapper     = document.getElementById('invitationWrapper');
  const heroCard    = document.getElementById('heroCard');
  const ctaBtn      = document.getElementById('ctaBtn');
  const msgSection  = document.getElementById('msgSection');
  const detailsBtn  = document.getElementById('detailsBtn');
  const detailsSec  = document.getElementById('detailsSection');
  const soundBtn    = document.getElementById('soundBtn');
  const soundOn     = document.getElementById('soundOnIcon');
  const soundOff    = document.getElementById('soundOffIcon');

  // ── Particles on Intro ──
  const particleContainer = document.getElementById('introParticles');
  function spawnParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left    = Math.random() * 100 + 'vw';
    p.style.width   = (Math.random() * 2 + 1) + 'px';
    p.style.height  = p.style.width;
    p.style.animationDuration = (Math.random() * 8 + 6) + 's';
    p.style.animationDelay   = (Math.random() * 5) + 's';
    p.style.opacity = Math.random() * 0.6 + 0.2;
    particleContainer.appendChild(p);
    setTimeout(() => p.remove(), 14000);
  }
  for (let i = 0; i < 30; i++) spawnParticle();
  setInterval(spawnParticle, 600);

  // ── Tap intro → show invitation ──
  function openInvitation() {
    intro.classList.add('fade-out');
    setTimeout(() => {
      intro.style.display = 'none';
      wrapper.classList.remove('hidden');
      soundBtn.style.display = 'flex';
      // Trigger hero card reveal after slight delay
      setTimeout(() => heroCard.classList.add('revealed'), 400);
      // Animate scroll-reveal elements
      initScrollReveal();
      // Start countdown
      startCountdown();
    }, 900);
  }

  intro.addEventListener('click', openInvitation);
  tapPrompt.addEventListener('click', openInvitation);

  // ── CTA → scroll to message ──
  ctaBtn.addEventListener('click', () => {
    msgSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ── Details btn → scroll to details ──
  detailsBtn.addEventListener('click', () => {
    detailsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ── Scroll Reveal ──
  function initScrollReveal() {
    const items = document.querySelectorAll('.animate-in');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(el => observer.observe(el));
  }

  // ── Countdown ──
  const EVENT_DATE = new Date('2026-06-27T12:30:00+05:30');

  function startCountdown() {
    const daysEl  = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl  = document.getElementById('cdMins');
    const secsEl  = document.getElementById('cdSecs');
    const labelEl = document.querySelector('.countdown-label');

    function tick() {
      const now  = new Date();
      const diff = EVENT_DATE - now;

      if (diff <= 0) {
        if (labelEl) labelEl.textContent = 'THE CELEBRATION HAS BEGUN';
        daysEl.textContent  = '00';
        hoursEl.textContent = '00';
        minsEl.textContent  = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      daysEl.textContent  = String(d).padStart(2, '0');
      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent  = String(m).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
    }

    tick();
    setInterval(tick, 1000);
  }

  // ── Audio (optional ambient) ──
  let audio = null;
  let muted = true;

  soundBtn.addEventListener('click', () => {
    if (!audio) {
      // Using a gentle ambient tone via Web Audio API
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        audio = { ctx, osc, gain, playing: true };
        muted = false;
      } catch(e) { return; }
    } else {
      if (muted) {
        audio.gain.gain.setValueAtTime(0.05, audio.ctx.currentTime);
        muted = false;
      } else {
        audio.gain.gain.setValueAtTime(0, audio.ctx.currentTime);
        muted = true;
      }
    }
    soundOn.style.display  = muted ? 'none'  : 'block';
    soundOff.style.display = muted ? 'block' : 'none';
  });

  // ── Parallax on hero image (subtle) ──
  window.addEventListener('scroll', () => {
    const heroImg = document.getElementById('heroImg');
    if (!heroImg) return;
    const scrollY = window.scrollY;
    heroImg.style.transform = `scale(1) translateY(${scrollY * 0.25}px)`;
  }, { passive: true });

  // ── Confetti on event-cards hover (subtle gold sparkle) ──
  document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 0 20px rgba(201,168,76,0.15)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

})();
