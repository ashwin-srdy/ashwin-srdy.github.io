/**
 * CYBERPUNK 2077 // REDENGINE UI JAVASCRIPT SYSTEM
 * Ashwin Kumar Sangareddypeta — Portfolio OS v2.077
 */

(function () {
  "use strict";

  /* ================================================================
     1. WEB AUDIO API SYNTHESIZER (CYBERPUNK HUD SFX)
     ================================================================ */
  let audioCtx = null;
  let audioEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  // Play synthetic cyberpunk UI blip
  function playCyberSound(type) {
    if (!audioEnabled || !audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === "hover") {
        // High-pitched microscopic tick
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(1900, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "click") {
        // Cyber resonance confirm blip
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "breach") {
        // Low cybernetic pulse
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Audio Toggle Button
  const audioBtn = document.getElementById("audioToggleBtn");
  if (audioBtn) {
    audioBtn.addEventListener("click", () => {
      initAudio();
      audioEnabled = !audioEnabled;
      audioBtn.innerHTML = audioEnabled
        ? `<i class="bi bi-volume-up"></i> SFX: ON`
        : `<i class="bi bi-volume-mute"></i> SFX: OFF`;
      if (audioEnabled) playCyberSound("click");
    });
  }

  // Attach sound triggers to interactive elements
  function attachSounds() {
    const clickable = document.querySelectorAll("a, button, .cp-kpi-card, .cp-shard-card, .cp-tech-card");
    clickable.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        initAudio();
        playCyberSound("hover");
      });
      el.addEventListener("click", () => {
        initAudio();
        playCyberSound("click");
      });
    });
  }

  /* ================================================================
     2. CYBER CANVAS PARTICLES
     ================================================================ */
  function initCyberParticles() {
    const canvas = document.getElementById("cyber-particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;
    const CONNECTION_DIST = 140;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      seed();
    }

    function seed() {
      const count = Math.min(Math.floor(w / 22), 65);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size: Math.random() < 0.3 ? 3.5 : 2,
          color: Math.random() < 0.5 ? "#00f0ff" : "#fcee0a",
          alpha: 0.2 + Math.random() * 0.5,
          type: Math.random() < 0.2 ? "bit" : "node",
          val: Math.random() < 0.5 ? "0" : "1",
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.type === "bit") {
          ctx.fillStyle = p.color;
          ctx.font = "10px 'Share Tech Mono', monospace";
          ctx.fillText(p.val, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();
  }

  /* ================================================================
     3. CYBER TYPEWRITER EFFECT
     ================================================================ */
  function initTypewriter() {
    const el = document.getElementById("typewriterTarget");
    if (!el) return;

    const phrases = [
      "Agentic AI Engineer @ SmarterDx",
      "LangGraph & Clinical Agent Architect",
      "DAG Pre-Gen Pipelines & EHR Chart Reasoning",
      "AWS Bedrock Model Parallelism Specialist",
      "Custom MCP Tooling for Claude Code & Codex",
      "Netrunner // Systems Architect // Dallas, TX",
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function tick() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          setTimeout(() => {
            deleting = true;
            tick();
          }, 2200);
          return;
        }
      } else {
        charIdx--;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(tick, 400);
          return;
        }
      }
      setTimeout(tick, deleting ? 40 : 80);
    }

    tick();
  }

  /* ================================================================
     4. TELEMETRY KPI COUNTER ANIMATION
     ================================================================ */
  function initKpiCounters() {
    const counters = document.querySelectorAll(".cp-kpi-value[data-target]");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseFloat(entry.target.getAttribute("data-target"));
            const prefix = entry.target.getAttribute("data-prefix") || "";
            const suffix = entry.target.getAttribute("data-suffix") || "";
            let current = 0;
            const duration = 1200;
            const startTime = performance.now();

            function updateCounter(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const ease = 1 - Math.pow(1 - progress, 3);
              current = Math.floor(target * ease);

              entry.target.textContent = `${prefix}${current}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                entry.target.textContent = `${prefix}${target}${suffix}`;
              }
            }

            requestAnimationFrame(updateCounter);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  /* ================================================================
     5. SHARD PROJECT FILTERING
     ================================================================ */
  function initProjectFilters() {
    const filterBtns = document.querySelectorAll(".cp-filter-btn");
    const shardCards = document.querySelectorAll(".cp-shard-card");

    if (!filterBtns.length || !shardCards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        shardCards.forEach((card) => {
          const category = card.getAttribute("data-category") || "";
          if (filter === "all" || category.includes(filter)) {
            card.style.display = "flex";
            card.style.animation = "fadeIn 0.4s ease forwards";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  /* ================================================================
     6. MOBILE NAV DRAWER
     =============================================================== */
  function initMobileNav() {
    const toggle = document.querySelector(".cp-menu-toggle");
    const menu = document.querySelector(".cp-nav-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
    });

    document.querySelectorAll(".cp-nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
      });
    });
  }

  /* ================================================================
     7. CONTACT FORM UPLINK SIMULATION
     ================================================================ */
  function initContactForm() {
    const form = document.getElementById("cyberContactForm");
    const responseBox = document.getElementById("formResponseBox");

    if (!form || !responseBox) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      playCyberSound("breach");

      responseBox.style.display = "block";
      responseBox.style.color = "var(--cp-yellow)";
      responseBox.textContent = "// TRANSMITTING ENCRYPTED PACKET TO RELAY NODE...";

      setTimeout(() => {
        responseBox.style.color = "var(--cp-green)";
        responseBox.textContent = "✔ TRANSMISSION CONFIRMED. PACKET DELIVERED TO ASHWIN'S TERMINAL.";
        form.reset();
      }, 1400);
    });
  }

  /* ================================================================
     8. KONAMI CODE (BREACH PROTOCOL MATRIX RAIN)
     ================================================================ */
  function initEasterEgg() {
    const code = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let pos = 0;

    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === code[pos].toLowerCase()) {
        pos++;
        if (pos === code.length) {
          triggerBreachProtocol();
          pos = 0;
        }
      } else {
        pos = 0;
      }
    });

    function triggerBreachProtocol() {
      playCyberSound("breach");
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.background = "rgba(0, 240, 255, 0.9)";
      overlay.style.zIndex = "99999";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.fontFamily = "'Orbitron', sans-serif";
      overlay.style.fontSize = "2.5rem";
      overlay.style.color = "#000";
      overlay.style.fontWeight = "900";
      overlay.style.letterSpacing = "0.2em";
      overlay.textContent = "BREACH PROTOCOL OVERRIDE // SYSTEMS UNLOCKED";

      document.body.appendChild(overlay);

      setTimeout(() => {
        overlay.style.transition = "opacity 0.6s ease";
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 600);
      }, 2000);
    }
  }

  /* Initialize All Systems */
  window.addEventListener("DOMContentLoaded", () => {
    initCyberParticles();
    initTypewriter();
    initKpiCounters();
    initProjectFilters();
    initMobileNav();
    initContactForm();
    initEasterEgg();
    attachSounds();
  });
})();
