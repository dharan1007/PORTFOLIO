/* ===================================================
   PORTFOLIO WEBSITE INTERACTIVITY
   Effects, Animations, and Project Rendering
=================================================== */

// ===================================================
// Footer year
// ===================================================
document.getElementById('year').textContent = new Date().getFullYear();


// ===================================================
// Active nav highlighting
// ===================================================
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-list a')];

window.addEventListener('scroll', () => {
  const y = window.scrollY + 120;
  let current = sections[0]?.id;
  for (const sec of sections) {
    if (y >= sec.offsetTop) current = sec.id;
  }
  navLinks.forEach(a =>
    a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`)
  );
});


// ===================================================
// Grain overlay generator
// ===================================================
(function grain() {
  const canvas = document.getElementById('grain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function frame() {
    const w = canvas.width, h = canvas.height;
    const id = ctx.createImageData(w, h);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.random() * 255;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
      id.data[i + 3] = 18;
    }
    ctx.putImageData(id, 0, 0);
    requestAnimationFrame(frame);
  }
  frame();
})();


// ===================================================
// Projects list (7 real + 7 dummy)
// ===================================================
const projects = [
  {
    title: "Fuy",
    subtitle: "Healthcare AI Assistant",
    img: "assets/proj-fuy-bw.jpg",
    url: "https://fuy-ysil.onrender.com/",
    bullets: ["NLP chatbot", "Medical record analysis", "https://fuy-ysil.onrender.com/"]
  },
  {
    title: "Stenius",
    subtitle: "Stock Market Analyzer • AI-driven",
    img: "assets/proj-stenius-bw.jpg",
    bullets: [
      "ML-LSTM model for trend prediction",
      "Improved accuracy by 14%",
      "Portfolio optimizer with auto-balancing"
    ]
  },
  {
    title: "Dooki",
    subtitle: "AI Personal Recipe Ecosystem",
    img: "assets/proj-dooki-bw.jpg",
    bullets: [
      "NLP-based recipe recommendation",
      "Food image classification",
      "Custom BERT recipe parser"
    ]
  },
  {
    title: "Swud",
    subtitle: "Urban Mobility Data AI Platform",
    img: "assets/proj-swud-bw.jpg",
    bullets: [
      "Reinforcement learning agent for optimization",
      "Unsupervised demand prediction",
      "Streaming analytics for planners"
    ]
  },
  {
    title: "Boof",
    subtitle: "Book Summarization & Sentiment AI",
    img: "assets/proj-boof-bw.jpg",
    bullets: [
      "Extractive + abstractive NLP pipeline",
      "Audio-to-text transcription",
      "Sentiment-based tagging"
    ]
  },
  {
    title: "Driver Safety",
    subtitle: "Face-Based Emotion & Fatigue Recognition",
    img: "assets/proj-driving-bw.jpg",
    bullets: [
      "CNN for fatigue detection",
      "LSTM for temporal modeling",
      "Deployed on Raspberry Pi"
    ]
  },
  {
    title: "BizDev Challenge",
    subtitle: "Business Development Simulation",
    img: "assets/proj-biz-bw.jpg",
    bullets: [
      "Segment-based messaging",
      "Conversion tracking in Excel",
      "Presented findings in simulation"
    ]
  },
  {
    title: "Event Outreach",
    subtitle: "Coordination & Engagement",
    img: "assets/proj-event-bw.jpg",
    bullets: [
      "Scaled signups 30 → 120+",
      "Targeted outreach campaigns",
      "Managed participant communications"
    ]
  },
  // Dummy placeholders
  {
    title: "Project Alpha",
    subtitle: "Experimental AI Platform",
    img: "assets/dummy1.jpg",
    bullets: ["Prototype build", "Benchmark tests", "API integrations"]
  },
  {
    title: "Project Beta",
    subtitle: "Next-Gen Data Visualizations",
    img: "assets/dummy2.jpg",
    bullets: ["Interactive dashboards", "Custom chart library", "Faster pipelines"]
  },
  {
    title: "Project Delta",
    subtitle: "Smart IoT Monitoring",
    img: "assets/dummy4.jpg",
    bullets: ["Sensor anomaly detection", "Time-series processing", "Mobile alerts"]
  },
  {
    title: "Project Epsilon",
    subtitle: "Generative Design AI",
    img: "assets/dummy5.jpg",
    bullets: ["GAN design gen", "Feedback loop", "Style transfer"]
  },
  {
    title: "Project Zeta",
    subtitle: "Blockchain Data Insights",
    img: "assets/dummy6.jpg",
    bullets: ["Transaction parsing", "Anomaly detector", "Blockchain graphs"]
  },
  {
    title: "Project Omega",
    subtitle: "Quantum Computing Demo",
    img: "assets/dummy7.jpg",
    bullets: ["Quantum circuits", "ML prototype", "Qiskit simulations"]
  }
];


// ===================================================
// Render projects dynamically
// ===================================================
function renderProjects() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;
  grid.innerHTML = "";
  projects.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "project-card fade-up";
    card.style.transitionDelay = `${i * 0.1}s`; // staggered

    // Make card keyboard-focusable and clickable if project has a url
    if (p.url) {
      card.style.cursor = 'pointer';
      card.tabIndex = 0;
      card.setAttribute('role', 'link');
      card.setAttribute('aria-label', `${p.title} - opens in a new tab`);
      card.addEventListener('click', () => {
        window.open(p.url, '_blank');
      });
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          window.open(p.url, '_blank');
        }
      });
    }

    card.innerHTML = `
      <div class="project-media">
        <img src="${p.img}" alt="${p.title}">
      </div>
      <div class="project-body">
        <h4 class="project-title">${p.title} — ${p.subtitle}</h4>
        <ul>${p.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
      </div>
    `;
    grid.appendChild(card);
  });
}
renderProjects();


// ===================================================
// Scroll reveal (fade-up, slide-left, etc.)
// ===================================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

function watchElements() {
  document.querySelectorAll(
    '.fade-up, .slide-left, .slide-right, .zoom-in, .blur-in, .project-card'
  ).forEach(el => observer.observe(el));
}
watchElements();


// ===================================================
// Hero glitch + parallax effect
// ===================================================
const heroText = document.querySelector('.mega');
window.addEventListener('scroll', () => {
  if (!heroText) return;
  const offset = window.scrollY * 0.2;
  heroText.style.transform = `translateY(${offset}px)`;
});


// ===================================================
// Typing effect for subtitle
// ===================================================
function typeEffect(el, text, speed = 100) {
  let i = 0;
  function typing() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}
const subtitle = document.querySelector('.subtitle');
if (subtitle) {
  const txt = subtitle.textContent;
  subtitle.textContent = "";
  typeEffect(subtitle, txt, 80);
}


// ===================================================
// Ripple effect on buttons
// ===================================================
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const circle = document.createElement('span');
    const diameter = Math.max(this.clientWidth, this.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - this.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - this.offsetTop - radius}px`;
    circle.classList.add('ripple');
    const ripple = this.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();
    this.appendChild(circle);
  });
});


// ===================================================
// Scroll progress bar
// ===================================================
const progressBar = document.createElement('div');
progressBar.style.position = 'fixed';
progressBar.style.top = '0';
progressBar.style.left = '0';
progressBar.style.height = '3px';
progressBar.style.background = '#fff';
progressBar.style.zIndex = '9999';
progressBar.style.transition = 'width 0.25s';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const width = (scrollTop / docHeight) * 100;
  progressBar.style.width = `${width}%`;
});


// ===================================================
// Back-to-top button
// ===================================================
const backToTop = document.createElement('button');
backToTop.textContent = "↑";
backToTop.style.position = 'fixed';
backToTop.style.bottom = '30px';
backToTop.style.right = '30px';
backToTop.style.padding = '10px 16px';
backToTop.style.fontSize = '20px';
backToTop.style.background = '#fff';
backToTop.style.color = '#000';
backToTop.style.border = 'none';
backToTop.style.borderRadius = '50%';
backToTop.style.cursor = 'pointer';
backToTop.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
backToTop.style.opacity = '0';
backToTop.style.transition = 'opacity 0.3s';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.style.opacity = '1';
  } else {
    backToTop.style.opacity = '0';
  }
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ===================================================
// Utility: throttle (for performance)
// ===================================================
function throttle(fn, wait) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= wait) {
      fn.apply(this, args);
      last = now;
    }
  };
}


// ===================================================
// Debug log for devs
// ===================================================
console.log("%cPortfolio Loaded!", "color: white; background: black; font-size: 14px; padding: 4px;");

// Animate skills list items one by one
const skillItems = document.querySelectorAll("#skills li");
const skillsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      skillItems.forEach((li, i) => {
        setTimeout(() => li.classList.add("visible"), i * 250); // 0.25s stagger
      });
      skillsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

if (skillItems.length) {
  skillsObserver.observe(skillItems[0]);
}


// ===================================================
// NAV TOGGLE (added for mobile)
// ===================================================
(function () {
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // Close the nav when a link is clicked (mobile)
  document.querySelectorAll('#navList a').forEach(a => {
    a.addEventListener('click', () => {
      if (navList) {
        navList.classList.remove('open');
      }
      if (navToggle) {
        navToggle.classList.remove('open');
      }
    });
  });
})();


// ===================================================
// Resume download fallback (non-intrusive)
// If a user holds SHIFT while clicking the anchor, we fetch the PDF and force a programmatic download.
// This preserves native download behavior while providing a tested fallback for environments where PDF viewers intercept the link.
// ===================================================
(function () {
  const resumeLink = document.querySelector('a.btn-download');
  if (!resumeLink) return;

  resumeLink.addEventListener('click', function (e) {
    const href = resumeLink.getAttribute('href');
    const downloadAttr = resumeLink.getAttribute('download');

    if (!href) return;

    // Force programmatic download when Shift is held (optional testing/debug)
    if (e.shiftKey) {
      e.preventDefault();
      if (!navigator.onLine) {
        alert('You appear to be offline. Please ensure you are connected to download the resume.');
        return;
      }
      fetch(href, { method: 'GET' })
        .then(resp => {
          if (!resp.ok) throw new Error('Network response was not ok');
          return resp.blob();
        })
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const tempA = document.createElement('a');
          tempA.style.display = 'none';
          tempA.href = blobUrl;
          tempA.download = downloadAttr || 'resume.pdf';
          document.body.appendChild(tempA);
          tempA.click();
          setTimeout(() => {
            document.body.removeChild(tempA);
            window.URL.revokeObjectURL(blobUrl);
          }, 200);
        })
        .catch(err => {
          console.error('Resume download failed:', err);
          alert('Unable to download resume automatically. The link will open the PDF — use your browser Save/Download option.');
          window.open(href, '_blank', 'noopener');
        });
    }
    // otherwise let the anchor's native behavior proceed
  });
})();
