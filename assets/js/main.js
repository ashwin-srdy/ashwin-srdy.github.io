/**
 * ASHWIN.SYS — INTELLIGENCE IN MOTION
 * Architecture Engine: Interactive Topology, Node Inspector, Scroll Progress, Card Tilt
 */

(function () {
  'use strict';

  /* ==========================================================================
     01. SCROLL PROGRESS INDICATOR
     ========================================================================== */
  function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  /* ==========================================================================
     02. INTERACTIVE AI AGENT TOPOLOGY (REASONING, ORCHESTRATION, RETRIEVAL, TOOL, EVAL)
     ========================================================================== */
  function initAgentCanvas() {
    const canvas = document.getElementById('agentTopologyCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let animationFrameId;
    let isVisible = true;

    // Node Inspector Elements
    const inspectorTitle = document.getElementById('inspectorNodeTitle');
    const inspectorDesc = document.getElementById('inspectorNodeDesc');

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resize);
    resize();

    // Exactly the 5 requested core nodes + 2 supporting nodes
    const nodes = [
      {
        id: 'orchestration',
        name: 'Orchestration',
        tag: 'CORE AGENT',
        color: '#45D9F5',
        x: 0.5,
        y: 0.48,
        radius: 18,
        pulse: 0,
        desc: 'LangGraph state machines orchestrating multi-agent decision graphs with checkpoint persistence.'
      },
      {
        id: 'reasoning',
        name: 'Reasoning',
        tag: 'MULTI-MODEL LLM',
        color: '#A78BFA',
        x: 0.5,
        y: 0.16,
        radius: 14,
        pulse: 0,
        desc: 'AWS Bedrock model parallelism & candidate routing across Claude 3.5 Sonnet and Haiku.'
      },
      {
        id: 'retrieval',
        name: 'Retrieval',
        tag: 'HYBRID RAG',
        color: '#45D9F5',
        x: 0.2,
        y: 0.38,
        radius: 14,
        pulse: 0,
        desc: 'OpenSearch hybrid dense/sparse vector search with paragraph-exact clinical EHR citation grounding.'
      },
      {
        id: 'tool_exec',
        name: 'Tool Execution',
        tag: 'MCP PROTOCOL',
        color: '#A78BFA',
        x: 0.26,
        y: 0.78,
        radius: 14,
        pulse: 0,
        desc: 'Model Context Protocol (MCP) tool connectors executing sandboxed external API and database calls.'
      },
      {
        id: 'evaluation',
        name: 'Evaluation',
        tag: 'LLM-AS-A-JUDGE',
        color: '#10B981',
        x: 0.8,
        y: 0.38,
        radius: 15,
        pulse: 0,
        desc: 'Automated multi-metric benchmarking (semantic similarity, judge scoring) & clinical safety guardrails.'
      },
      {
        id: 'ehr_ingest',
        name: 'EHR Ingestion',
        tag: 'DATA PIPELINE',
        color: '#45D9F5',
        x: 0.74,
        y: 0.78,
        radius: 13,
        pulse: 0,
        desc: 'Apache Airflow DAG pipelines transforming raw HL7 FHIR records into enriched vector indexes.'
      }
    ];

    // Interconnections
    const links = [
      { from: 'orchestration', to: 'reasoning', speed: 0.009, packets: [0.1, 0.6] },
      { from: 'orchestration', to: 'retrieval', speed: 0.008, packets: [0.2, 0.7] },
      { from: 'orchestration', to: 'tool_exec', speed: 0.007, packets: [0.35, 0.85] },
      { from: 'orchestration', to: 'evaluation', speed: 0.008, packets: [0.15, 0.65] },
      { from: 'orchestration', to: 'ehr_ingest', speed: 0.006, packets: [0.4, 0.9] },
      { from: 'retrieval', to: 'ehr_ingest', speed: 0.005, packets: [0.3] },
      { from: 'reasoning', to: 'evaluation', speed: 0.007, packets: [0.5] }
    ];

    let mouse = { x: -1000, y: -1000, active: false };
    let activeNode = nodes[0];

    function updateInspector(node) {
      if (!inspectorTitle || !inspectorDesc) return;
      inspectorTitle.textContent = `${node.name} // [${node.tag}]`;
      inspectorDesc.textContent = node.desc;
    }
    updateInspector(nodes[0]);

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // Check hovered node
      nodes.forEach((n) => {
        const nx = n.x * width;
        const ny = n.y * height;
        const dist = Math.hypot(mouse.x - nx, mouse.y - ny);
        if (dist < n.radius + 14) {
          activeNode = n;
          updateInspector(n);
        }
      });
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      nodes.forEach((n) => {
        const nx = n.x * width;
        const ny = n.y * height;
        const dist = Math.hypot(clickX - nx, clickY - ny);
        if (dist < n.radius + 15) {
          n.pulse = 6;
          activeNode = n;
          updateInspector(n);
          links.forEach((l) => {
            if (l.from === n.id || l.to === n.id) {
              l.packets.push(0);
            }
          });
        }
      });
    });

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !animationFrameId) {
        animate();
      }
    }, { threshold: 0.1 });
    observer.observe(canvas);

    let time = 0;

    function animate() {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      // Gentle floating physics
      nodes.forEach((n) => {
        n.x += Math.sin(time + n.radius) * 0.0003;
        n.y += Math.cos(time + n.radius) * 0.0003;

        // Subtle mouse pull
        if (mouse.active) {
          const nx = n.x * width;
          const ny = n.y * height;
          const dist = Math.hypot(mouse.x - nx, mouse.y - ny);
          if (dist < 110) {
            const angle = Math.atan2(mouse.y - ny, mouse.x - nx);
            const force = (110 - dist) / 110 * 0.5;
            n.x -= Math.cos(angle) * force * 0.0008;
            n.y -= Math.sin(angle) * force * 0.0008;
          }
        }
      });

      // Draw Connection Lines & Packets
      links.forEach((link) => {
        const fromNode = nodes.find((n) => n.id === link.from);
        const toNode = nodes.find((n) => n.id === link.to);
        if (!fromNode || !toNode) return;

        const x1 = fromNode.x * width;
        const y1 = fromNode.y * height;
        const x2 = toNode.x * width;
        const y2 = toNode.y * height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(146, 158, 173, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Animated signal packets
        link.packets.forEach((p, index) => {
          link.packets[index] = (p + link.speed) % 1;
          const progress = link.packets[index];
          const px = x1 + (x2 - x1) * progress;
          const py = y1 + (y2 - y1) * progress;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = fromNode.color;
          ctx.shadowColor = fromNode.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      });

      // Draw Nodes
      nodes.forEach((n) => {
        const nx = n.x * width;
        const ny = n.y * height;
        const isHovered = (activeNode && activeNode.id === n.id);

        // Pulse wave on click
        if (n.pulse > 0) {
          ctx.beginPath();
          ctx.arc(nx, ny, n.radius + (6 - n.pulse) * 4, 0, Math.PI * 2);
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = Math.max(0, n.pulse / 6);
          ctx.stroke();
          ctx.globalAlpha = 1;
          n.pulse = Math.max(0, n.pulse - 0.05);
        }

        // Ambient radial glow
        const gradient = ctx.createRadialGradient(nx, ny, n.radius * 0.3, nx, ny, n.radius * 2.2);
        gradient.addColorStop(0, n.color + (isHovered ? '55' : '33'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nx, ny, n.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Node disc
        ctx.beginPath();
        ctx.arc(nx, ny, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0E141C';
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#ffffff' : n.color;
        ctx.lineWidth = isHovered ? 2.5 : 1.75;
        ctx.stroke();

        // Node center core
        ctx.beginPath();
        ctx.arc(nx, ny, n.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        // Label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = isHovered ? '#ffffff' : '#929EAD';
        ctx.textAlign = 'center';
        ctx.fillText(n.name, nx, ny + n.radius + 14);
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();
  }

  /* ==========================================================================
     03. 3D CARD TILT & HOVER LIGHTING
     ========================================================================== */
  function initCardTilt() {
    const cards = document.querySelectorAll('.project-card, .metric-card');
    if (!cards.length || window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     04. IMPACT METRIC COUNTERS
     ========================================================================== */
  function initMetricCounters() {
    const metricCards = document.querySelectorAll('.metric-card');
    if (!metricCards.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.classList.add('revealed');
          const valueEl = card.querySelector('.metric-value');
          if (valueEl && !valueEl.dataset.counted) {
            valueEl.dataset.counted = 'true';
            animateValue(valueEl);
          }
        }
      });
    }, { threshold: 0.25 });

    metricCards.forEach((card) => observer.observe(card));

    function animateValue(el) {
      const targetStr = el.dataset.target || '';
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const target = parseFloat(targetStr);

      if (isNaN(target)) {
        el.textContent = prefix + targetStr + suffix;
        return;
      }

      const duration = 1400;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(ease * target);

        el.textContent = prefix + current + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = prefix + targetStr + suffix;
        }
      }

      requestAnimationFrame(update);
    }
  }

  /* ==========================================================================
     05. PROJECT CASE STUDY MODAL DIRECTORY
     ========================================================================== */
  const projectDirectory = {
    travel: {
      category: 'Agentic AI & Voice Streaming',
      title: 'Agentic Virtual Travel Assistant',
      tagline: 'LangGraph Deep Agent autonomously planning multi-day itineraries with live APIs & LiveKit voice-to-voice streaming.',
      problem: 'Traditional travel booking forces users to manually juggle airline sites, lodging inventories, and itinerary schedules with zero persistent contextual memory.',
      solution: 'Engineered an autonomous travel agent powered by LangGraph that plans complete end-to-end multi-day itineraries using live flight APIs, lodging inventories, and local event aggregators. Integrated streaming token execution and LiveKit for real-time WebRTC voice interaction.',
      architecture: `[User Voice / Text Stream]
       ↓ (LiveKit WebRTC Low-Latency Stream)
[LangGraph Multi-Agent Orchestrator]
   ├── [Flight Search Sub-Agent] ──→ Amadeus & Skyscanner APIs
   ├── [Lodging Evaluation Agent] ──→ Real-Time Rate Ingestion
   ├── [Itinerary Optimization Node] ──→ Topological Route Planner
   └── [Constraint & Safety Agent] ──→ Budget & Time Guardrails
       ↓
[Real-Time Synthesized Audio & Dynamic Visual Plan Delivery]`,
      challenges: 'Handling long-horizon tool execution without compounding hallucinations; implemented checkpoint state serialization and strict constraint verification.',
      outcomes: 'Sub-second initial voice turn response, 100% deterministic constraint checking on budget limits, and fully automated multi-day route generation.',
      tech: ['LangGraph', 'LiveKit WebRTC', 'Open-WebUI', 'Python', 'FastAPI', 'Vector Search'],
      repo: 'https://github.com/ashwin-srdy'
    },
    smarterdx: {
      category: 'Healthcare AI & Clinical Agents',
      title: 'SmarterNotes & Clinical Chart Enrichment',
      tagline: 'Multi-agent clinical documentation system transforming full EHR charts into evidence-backed notes with exact paragraph citations.',
      problem: 'Physicians lose over 2 hours daily on documentation and medical-necessity justifications. Manual clinical chart review is tedious and prone to missed diagnoses.',
      solution: 'Architected LangGraph-based clinical agents (SmarterNotes & SmarterUtilization) and DAG-orchestrated enrichment pipelines. Ingests full EHR records, extracts clinical evidence with exact paragraph citations, and drafts clinical notes reviewed by physicians.',
      architecture: `[Hospital EHR / HL7 Ingestion]
       ↓
[Airflow DAG: Document Chunking & OpenSearch Vector Embedding]
       ↓
[LangGraph Multi-Agent Ensemble]
   ├── [Clinical Evidence Extractor Agent] ──→ Grounded Citations
   ├── [Diagnosis Verification Node] ──→ ICD-10 / CPT Ontologies
   └── [LLM-as-Judge Evaluator] ──→ Automated Quality Metric Scoring
       ↓
[AWS Bedrock Model Parallelism (Claude 3.5 Sonnet / Haiku Fallback)]
       ↓
[Provider EHR Integration Interface]`,
      challenges: 'Strict zero-hallucination requirement for clinical claims. Implemented strict retrieval grounding with paragraph-level source pointer citations and automated LLM-as-judge safety checks.',
      outcomes: '50% reduction in Bedrock inference latency via model parallelism; 60% reduction in manual prompt-eval workload; 30% reduction in Airflow DAG execution runtime.',
      tech: ['LangGraph', 'AWS Bedrock', 'Apache Airflow', 'OpenSearch', 'FastAPI', 'Python', 'MCP'],
      repo: 'https://github.com/ashwin-srdy'
    },
    openclaw: {
      category: 'Agentic AI & Cloud Automation',
      title: 'OpenClaw Marketing Automation Bot',
      tagline: 'Autonomous marketing automation agent running on Google Cloud for lead enrichment and hyper-personalized outreach.',
      problem: 'Marketing teams waste hours manually identifying high-intent prospects, scouring LinkedIn/news sources for context, and composing cold emails with low conversion rates.',
      solution: 'Built OpenClaw, an autonomous marketing automation agent on Google Cloud that continuously monitors industry signals, extracts lead context, generates personalized outreach copy tailored to company milestones, and syncs scheduling links.',
      architecture: `[Target Domain & Profile List]
       ↓
[Web Scraping & Signal Extraction (Selenium / BS4)]
       ↓
[LLM Reasoning & Tone Synthesis (Google Cloud)]
       ↓
[Outreach Orchestrator: Scheduling & CRM Webhook Sync]`,
      challenges: 'Overcoming bot detection on dynamic targets and ensuring generated emails maintain high personalization without sounding like generic templated spam.',
      outcomes: 'Automated 100% of initial lead context enrichment and cut manual marketing prep time by over 40%.',
      tech: ['Google Cloud', 'Python', 'LLMs', 'Selenium', 'BeautifulSoup', 'FastAPI'],
      repo: 'https://github.com/ashwin-srdy'
    },
    afib: {
      category: 'Healthcare AI & Machine Learning',
      title: 'Atrial Fibrillation Early Diagnostic Engine',
      tagline: 'GPU-accelerated predictive analytics system boosting early AFib diagnosis accuracy to 95%.',
      problem: 'Atrial fibrillation often goes undiagnosed until severe cardiac events occur. Processing massive ECG time-series datasets was computationally prohibitive on CPU pipelines, taking 13+ hours per training run.',
      solution: 'Developed an end-to-end predictive analytics pipeline utilizing CuDA ML (cuML) on GPU instances, slashing model training duration from 13 hours to just 13 minutes (a 400%+ efficiency boost) while reaching 95% early diagnostic accuracy.',
      architecture: `[Physiological ECG Signal Stream]
       ↓
[Signal Preprocessing: Wavelet Transform & Bandpass Filter]
       ↓
[Feature Engineering: HRV, RR Interval Variance, Spectral Power]
       ↓
[GPU-Accelerated CuDA ML Random Forest & Gradient Boosting]
       ↓
[Containerized Docker API on AWS EC2] ──→ Real-Time Cardiac Alert`,
      challenges: 'Handling extreme class imbalance in patient records and optimizing memory transfer between host and GPU VRAM for massive time-series arrays.',
      outcomes: '13 hours to 13 minutes training acceleration; 95% early diagnostic accuracy; Dockerized and deployed with high throughput.',
      tech: ['CUDA ML', 'PyTorch', 'Scikit-learn', 'Docker', 'AWS EC2', 'FastAPI'],
      repo: 'https://github.com/ashwin-srdy'
    },
    faceapi: {
      category: 'Computer Vision & Edge Systems',
      title: 'Edge Biometric Attendance API & Hardware Rig',
      tagline: 'Low-latency biometric verification system running on Raspberry Pi 3 edge hardware with MTCNN and FaceNet.',
      problem: 'Cloud-only facial recognition suffers from high network latency, intermittent connectivity, and recurring cloud API costs when scaled across remote physical sites.',
      solution: 'Designed and deployed an edge-first face recognition system using MTCNN face detection, FaceNet 128-d embeddings, and support vector clustering running locally on a cost-effective Raspberry Pi 3 rig with a FastAPI backend.',
      architecture: `[Camera Feed / Video Stream]
       ↓
[MTCNN Edge Alignment & Face Detection]
       ↓
[FaceNet Embedding Generation (128-d vector)]
       ↓
[Support Vector Clustering & Nearest Neighbor Verification]
       ↓
[FastAPI Local Endpoint] ──→ [Edge SQLite / Cloud Sync]`,
      challenges: 'Executing neural inference with limited ARM CPU and memory without dropping frames; implemented model quantization and optimized pipeline concurrency.',
      outcomes: '50% boost in overall system efficiency compared to baseline OpenCV Haar cascades, sub-second edge verification.',
      tech: ['FastAPI', 'MTCNN', 'FaceNet', 'OpenCV', 'Raspberry Pi', 'Docker'],
      repo: 'https://github.com/ashwin-srdy'
    },
    golfgpt: {
      category: 'Computer Vision & AI Coaching',
      title: 'GolfGPT AI Posture & Swing Coach',
      tagline: 'Real-time biomechanical swing analysis engine using MediaPipe pose keypoint kinematics and joint-angle tracking.',
      problem: 'Amateur golfers lack accessible, immediate kinematic feedback during swings without paying for expensive private instructors or specialized multi-sensor suits.',
      solution: 'Engineered a real-time computer vision posture analysis coach. Uses MediaPipe 33-point pose estimation to extract joint angles (shoulders, hips, spine angle) across backswing, top, and follow-through, delivering instant corrective feedback.',
      architecture: `[Single Smartphone Video / WebCam]
       ↓
[MediaPipe 33-Keypoint Skeletal Extraction]
       ↓
[Kinematic Joint Angle Calculation & Trajectory Smoothing]
       ↓
[Biomechanical Rule Engine & Phase Segmentation]
       ↓
[Real-Time Visual Overlay & LLM Form Coaching Feedback]`,
      challenges: 'Handling high-speed clubhead and body movement without motion blur skewing joint angle measurements; applied Kalman filtering for temporal smoothing.',
      outcomes: 'Real-time 30+ FPS tracking on standard video feeds without specialized hardware; instant actionable swing posture corrections.',
      tech: ['MediaPipe', 'OpenCV', 'Python', 'FastAPI', 'React', 'Streamlit'],
      repo: 'https://github.com/ashwin-srdy'
    },
    neolegal: {
      category: 'Applied AI & Enterprise RAG',
      title: 'Neo Legal AI Contract Intelligence',
      tagline: 'Enterprise RAG system for semantic contract indexing, clause analysis, and automated risk summarization.',
      problem: 'Attorneys and corporate compliance teams spend 40% of their billable hours manually reading lengthy agreements to identify non-standard indemnity clauses and obligations.',
      solution: 'Architected Neo Legal AI, a specialized Retrieval-Augmented Generation agent that indexes unstructured multi-page legal documents, performs cross-clause semantic search, and flags non-standard terms with exact page citations.',
      architecture: `[Legal PDF / DOCX Upload]
       ↓
[Hierarchical Clause Chunking & Legal Entity Recognition]
       ↓
[Dense & Sparse Hybrid Embedding Search (OpenSearch)]
       ↓
[RAG Synthesis: Contract Risk Assessment & Summarization]
       ↓
[Interactive Redline Comparison Dashboard]`,
      challenges: 'Ensuring absolute precision in legal language interpretations; engineered domain-specific prompt templates and strict citation verification.',
      outcomes: 'Reduced manual contract research time by 40% for enterprise early adopters; verified against gold-standard legal corpora.',
      tech: ['LangChain', 'FastAPI', 'OpenSearch', 'Python', 'Docker', 'AWS'],
      repo: 'https://github.com/ashwin-srdy'
    },
    shareprice: {
      category: 'Machine Learning & Time Series',
      title: 'Share Price Predictive Estimator',
      tagline: 'Multi-model time-series forecasting web application combining LSTM recurrent networks with SARIMAX statistical models.',
      problem: 'Financial forecasting models frequently overfit short-term market noise or fail to capture long-term macro trend seasonality.',
      solution: 'Developed an interactive full-stack financial forecasting platform that ensembles deep Long Short-Term Memory (LSTM) networks with classical SARIMAX models to forecast price trajectories with confidence bands.',
      architecture: `[Yahoo Finance Live Data Ingestion]
       ↓
[Technical Indicator Generation (RSI, MACD, Bollinger Bands)]
       ↓
[Parallel Model Forecasting: LSTM + SARIMAX]
       ↓
[Flask Web Interface with Interactive Plotly Charts]`,
      challenges: 'Tuning hyperparameters across different volatility regimes; prevented lookahead bias in backtesting pipelines.',
      outcomes: 'Interactive predictive dashboard providing traders with multi-horizon price projections and automated risk metrics.',
      tech: ['Python', 'LSTM', 'PyTorch', 'Flask', 'Pandas', 'Plotly'],
      repo: 'https://github.com/ashwin-srdy'
    }
  };

  function initProjectModals() {
    const modalOverlay = document.getElementById('caseStudyModal');
    if (!modalOverlay) return;

    const closeBtn = document.getElementById('modalCloseBtn');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalTagline = document.getElementById('modalTagline');
    const modalProblem = document.getElementById('modalProblem');
    const modalSolution = document.getElementById('modalSolution');
    const modalArch = document.getElementById('modalArch');
    const modalChallenges = document.getElementById('modalChallenges');
    const modalOutcomes = document.getElementById('modalOutcomes');
    const modalTechStack = document.getElementById('modalTechStack');
    const modalRepoLink = document.getElementById('modalRepoLink');

    function openModal(projectId) {
      const data = projectDirectory[projectId];
      if (!data) return;

      modalCategory.textContent = data.category;
      modalTitle.textContent = data.title;
      modalTagline.textContent = data.tagline;
      modalProblem.textContent = data.problem;
      modalSolution.textContent = data.solution;
      modalArch.textContent = data.architecture;
      modalChallenges.textContent = data.challenges;
      modalOutcomes.textContent = data.outcomes;

      modalTechStack.innerHTML = '';
      data.tech.forEach((t) => {
        const span = document.createElement('span');
        span.className = 'tech-pill';
        span.textContent = t;
        modalTechStack.appendChild(span);
      });

      modalRepoLink.href = data.repo;
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a') && !e.target.closest('.open-modal-trigger')) return;
        const id = card.dataset.project;
        openModal(id);
      });
    });

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     06. PROJECT CATEGORY FILTER
     ========================================================================== */
  function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach((card) => {
          const category = card.dataset.category || '';
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  /* ==========================================================================
     07. FUNCTIONAL CONTACT FORM & CLIPBOARD COPY SYSTEM
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('toastNotice');
    const feedbackBox = document.getElementById('formFeedback');
    const copyEmailBtn = document.getElementById('copyEmailBtn');

    function showToast(message) {
      if (!toast) return;
      toast.querySelector('.toast-text').textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }

    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = 'ashwinsang.work@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email address copied to clipboard!');
        });
      });
    }

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        feedbackBox.textContent = 'Please fill in all required fields.';
        feedbackBox.className = 'form-feedback error';
        return;
      }

      const mailtoSubject = encodeURIComponent(`[ASHWIN.SYS Inquiry] ${subject || 'Engineering Discussion'}`);
      const mailtoBody = encodeURIComponent(`Hi Ashwin,\n\n${message}\n\nBest regards,\n${name}\nContact: ${email}`);
      const mailtoUrl = `mailto:ashwinsang.work@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      const clipboardText = `To: ashwinsang.work@gmail.com\nSubject: [ASHWIN.SYS Inquiry] ${subject}\n\nHi Ashwin,\n\n${message}\n\nBest regards,\n${name}\n${email}`;

      navigator.clipboard.writeText(clipboardText).then(() => {
        feedbackBox.innerHTML = `<strong>Inquiry prepared!</strong> Launching your email client...<br><span style="opacity: 0.8; font-size: 0.78rem;">Message was copied to clipboard.</span>`;
        feedbackBox.className = 'form-feedback success';
        showToast('Message copied to clipboard & opening email client!');
        window.location.href = mailtoUrl;
      }).catch(() => {
        window.location.href = mailtoUrl;
      });
    });
  }

  /* ==========================================================================
     08. RESUME MODAL & VIEWER
     ========================================================================== */
  function initResumeModal() {
    const resumeModal = document.getElementById('resumeModal');
    const openBtns = document.querySelectorAll('.open-resume-btn');
    const closeBtn = document.getElementById('resumeModalClose');

    if (!resumeModal) return;

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        resumeModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeResume() {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeResume);
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResume();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
        closeResume();
      }
    });

    const printBtn = document.getElementById('printResumeBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  /* ==========================================================================
     09. NAVIGATION & ACTIVE SCROLLSPY
     ========================================================================== */
  function initNavigation() {
    const navBar = document.querySelector('.nav-bar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-drawer-link');

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;

      if (scrollY > 50) {
        navBar.style.background = 'rgba(14, 20, 28, 0.94)';
        navBar.style.boxShadow = '0 15px 35px -5px rgba(0, 0, 0, 0.75)';
      } else {
        navBar.style.background = 'rgba(14, 20, 28, 0.82)';
        navBar.style.boxShadow = '0 12px 35px -8px rgba(0, 0, 0, 0.65)';
      }

      let current = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        mobileToggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
          mobileToggle.innerHTML = '<i class="bi bi-list"></i>';
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ==========================================================================
     INITIALIZATION ON DOM LOAD
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initAgentCanvas();
    initCardTilt();
    initMetricCounters();
    initProjectModals();
    initProjectFilters();
    initContactForm();
    initResumeModal();
    initNavigation();
  });

})();
