(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer:fine)').matches;
  document.documentElement.classList.add('js-motion');

  const esc = (value = '') => String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

  const visualFor = project => {
    if (project.live) return `https://image.thum.io/get/width/1600/crop/900/noanimate/${project.live}`;
    if (project.visibility === 'Public' && project.repo) return `https://opengraph.githubassets.com/portfolio-${encodeURIComponent(project.id)}/dharan1007/${encodeURIComponent(project.repo)}`;
    return null;
  };

  const projectHref = project => `/projects/${project.id}/`;

  function setActiveNav() {
    const page = document.body.dataset.page || 'home';
    $$('[data-nav]').forEach(link => {
      const active = link.dataset.nav === page || (page === 'project' && link.dataset.nav === 'projects');
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function initMenu() {
    const button = $('#navMenu');
    const menu = $('#mobileMenu');
    if (!button || !menu) return;
    const setOpen = open => {
      menu.setAttribute('aria-hidden', String(!open));
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Close' : 'Menu';
    };
    button.addEventListener('click', () => setOpen(menu.getAttribute('aria-hidden') === 'true'));
    $$('a', menu).forEach(link => link.addEventListener('click', () => setOpen(false)));
    addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  }

  function initProgress() {
    const line = $('#progressLine');
    if (!line) return;
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      line.style.width = `${max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0}%`;
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, {passive:true});
    update();
  }

  function initMotion() {
    if (reducedMotion) {
      document.documentElement.classList.remove('js-motion');
      return;
    }

    if (window.Lenis) {
      const lenis = new Lenis({
        autoRaf: true,
        duration: 1.02,
        smoothWheel: true,
        anchors: true,
        touchMultiplier: 1
      });
      if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    }

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      const revealTargets = new Set([
        ...document.querySelectorAll('[data-reveal]'),
        ...document.querySelectorAll('.project-row'),
        ...document.querySelectorAll('.project-tile'),
        ...document.querySelectorAll('.project-feature'),
        ...document.querySelectorAll('.fact-card'),
        ...document.querySelectorAll('.timeline-row')
      ]);

      revealTargets.forEach((element, index) => {
        element.classList.add('motion-up');
        gsap.fromTo(element,
          { opacity: 0, y: 28, filter: 'blur(5px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: .88,
            ease: 'power3.out',
            delay: Math.min(index * .012, .10),
            scrollTrigger: {
              trigger: element,
              start: 'top 91%',
              once: true
            }
          }
        );
      });

      document.querySelectorAll('main > section, main > header, .timeline-group, .about-details').forEach(element => {
        element.classList.add('motion-section');
        gsap.fromTo(element,
          { opacity: .45, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 1.05,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: element,
              start: 'top 94%',
              once: true
            }
          }
        );
      });

      const textTargets = [...document.querySelectorAll('main h1, main h2, main h3, main p, main small, main .kicker, main .mono, .site-footer span')]
        .filter(element => !element.hasAttribute('data-reveal') && !element.closest('.project-tile__copy'));

      textTargets.forEach(element => {
        element.classList.add('motion-text');
        gsap.fromTo(element,
          { opacity: 0, y: 12, filter: 'blur(3px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: .72,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: element,
              start: 'top 93%',
              once: true
            }
          }
        );
      });

      document.querySelectorAll('[data-parallax]').forEach(element => {
        gsap.fromTo(element, {yPercent:-2}, {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: .45
          }
        });
      });

      const track = $('#projectMarqueeTrack');
      if (track && track.scrollWidth > innerWidth) {
        gsap.to(track, {
          x: () => -(track.scrollWidth - innerWidth + 40),
          ease: 'none',
          scrollTrigger: {
            trigger: track.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: .8
          }
        });
      }
    } else {
      document.documentElement.classList.remove('js-motion');
    }

    if (finePointer && window.MouseFollower && window.gsap) {
      try {
        new MouseFollower({
          speed: .45,
          skewing: 1.2,
          skewingText: .6,
          stateDetection: {
            '-pointer': 'a,button,[data-cursor]',
            '-hidden': 'iframe'
          }
        });
        document.documentElement.classList.add('mf-ready');
      } catch (_) {
        document.documentElement.classList.remove('mf-ready');
      }
    }
  }

  function featureCard(project, index) {
    const visual = visualFor(project);
    return `
      <article class="project-feature" data-reveal>
        ${visual ? `<a class="project-feature__media" href="${projectHref(project)}" aria-label="Open ${esc(project.name)} case page">
          <img src="${esc(visual)}" alt="${esc(project.name)} live or repository preview" loading="${index < 2 ? 'eager' : 'lazy'}" decoding="async" ${index === 0 ? 'fetchpriority="high"' : ''}>
        </a>` : ''}
        <div class="project-feature__copy">
          <div class="project-feature__meta mono">
            <span>${esc(project.category)}</span>
            <span>${esc(project.status)}</span>
          </div>
          <h3 class="display"><a href="${projectHref(project)}">${esc(project.name)}</a></h3>
          <p class="project-feature__tagline">${esc(project.tagline)}</p>
          <div class="project-feature__actions">
            <a class="pill-link" href="${projectHref(project)}">Case page ↗</a>
            ${project.live ? `<a class="pill-link" href="${esc(project.live)}" target="_blank" rel="noopener noreferrer">Live ↗</a>` : ''}
            ${project.source ? `<a class="pill-link" href="${esc(project.source)}" target="_blank" rel="noopener noreferrer">Source ↗</a>` : ''}
          </div>
        </div>
      </article>`;
  }

  function renderHome() {
    const target = $('#featuredProjects');
    if (!target || !window.PROJECTS) return;
    const selected = PROJECTS.filter(project => project.featured).slice(0, 9);
    target.innerHTML = selected.map(featureCard).join('');

    const reel = $('#projectMarqueeTrack');
    if (reel) {
      const visuals = PROJECTS.filter(project => visualFor(project)).slice(0, 10);
      reel.innerHTML = visuals.map(project => `
        <a class="project-marquee__item" href="${projectHref(project)}" aria-label="${esc(project.name)}">
          <img src="${esc(visualFor(project))}" alt="${esc(project.name)} preview" loading="lazy" decoding="async">
        </a>`).join('');
    }
  }

  function filterMatch(project, filter) {
    if (filter === 'all') return true;
    if (filter === 'live') return Boolean(project.live);
    if (filter === 'public') return project.visibility === 'Public';
    if (filter === 'ai') return /AI|agent|research tooling|simulation|personal AI/i.test(project.category + ' ' + project.name + ' ' + project.tagline);
    if (filter === 'developer') return /developer|browser debugging|migration|agent integrity|programming language/i.test(project.category);
    if (filter === 'mobile') return /mobile|social|fitness|marketplace/i.test(project.category) || /Expo|React Native/.test(project.stack.join(' '));
    if (filter === 'research') return /research|beta|experiment|candidate/i.test(project.status + ' ' + project.category);
    return true;
  }

  function renderProjects() {
    const list = $('#projectIndex');
    if (!list || !window.PROJECTS) return;

    const visibleForTiles = PROJECTS.filter(project => visualFor(project)).slice(0, 8);
    const tiles = $('#projectsFeatureGrid');
    if (tiles) {
      tiles.innerHTML = visibleForTiles.map(project => `
        <a class="project-tile" href="${projectHref(project)}" data-reveal>
          <img src="${esc(visualFor(project))}" alt="${esc(project.name)} preview" loading="lazy" decoding="async">
          <span class="project-tile__copy">
            <span class="mono">${esc(project.category)} · ${esc(project.status)}</span>
            <h3 class="display">${esc(project.name)}</h3>
            <p>${esc(project.tagline)}</p>
          </span>
        </a>`).join('');
    }

    list.innerHTML = PROJECTS.map((project, index) => `
      <a class="project-row" href="${projectHref(project)}" data-project-row data-index="${index}">
        <span class="project-row__num mono">${String(index + 1).padStart(2,'0')}</span>
        <span class="project-row__name">${esc(project.name)}</span>
        <span class="project-row__summary">${esc(project.summary)}</span>
        <span class="project-row__cat">${esc(project.category)}</span>
        <span class="project-row__open" aria-hidden="true">↗</span>
      </a>`).join('');

    const buttons = $$('[data-filter]');
    const apply = filter => {
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
      $$('[data-project-row]', list).forEach(row => {
        const project = PROJECTS[Number(row.dataset.index)];
        row.hidden = !filterMatch(project, filter);
      });
    };
    buttons.forEach(button => button.addEventListener('click', () => apply(button.dataset.filter)));
    apply('all');
  }

  function renderProjectPage() {
    if (document.body.dataset.page !== 'project' || !window.PROJECTS_BY_ID) return;
    const id = document.body.dataset.project;
    const project = PROJECTS_BY_ID[id];
    if (!project) return;

    document.body.style.setProperty('--project-accent', project.accent || '#ef4c43');
    document.body.dataset.layout = String(project.layout ?? 0);
    document.title = `${project.name} — Dharantej Reddy`;
    const descriptionMeta = $('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.setAttribute('content', project.summary);

    const meta = $('#projectMeta');
    if (meta) meta.innerHTML = [
      project.category, project.status, project.visibility, project.year
    ].map(value => `<span>${esc(value)}</span>`).join('');

    const title = $('#projectTitle');
    const tagline = $('#projectTagline');
    if (title) title.textContent = project.name;
    if (tagline) tagline.textContent = project.tagline;

    const actions = $('#projectActions');
    if (actions) actions.innerHTML = [
      project.live ? `<a class="pill-link pill-link--accent" href="${esc(project.live)}" target="_blank" rel="noopener noreferrer">Open live ↗</a>` : '',
      project.source ? `<a class="pill-link" href="${esc(project.source)}" target="_blank" rel="noopener noreferrer">Open source ↗</a>` : '',
      `<a class="pill-link" href="/projects/">All projects</a>`
    ].join('');

    const hero = $('#projectHero');
    const media = $('#projectMedia');
    const visual = visualFor(project);
    if (media && visual) {
      media.innerHTML = `<img src="${esc(visual)}" alt="${esc(project.name)} real project preview" decoding="async" fetchpriority="high">`;
    } else if (media) {
      media.remove();
      hero?.classList.add('project-hero--text');
    }

    const summary = $('#projectSummary');
    if (summary) summary.textContent = project.summary;

    const facts = $('#projectFacts');
    if (facts) {
      const base = [
        ['Repository state', project.status],
        ['Visibility', project.visibility],
        ...project.verified.map((value, index) => [`Verified ${String(index + 1).padStart(2,'0')}`, value])
      ];
      facts.innerHTML = base.map(([label,value]) => `
        <article class="fact-card" data-reveal>
          <span>${esc(label)}</span>
          <p>${esc(value)}</p>
        </article>`).join('');
    }

    const stack = $('#projectStack');
    const stackSection = $('#projectStackSection');
    if (stack && project.stack.length) {
      stack.innerHTML = project.stack.map(item => `<span class="stack-chip">${esc(item)}</span>`).join('');
    } else {
      stackSection?.remove();
    }

    const sourceState = $('#sourceState');
    if (sourceState) {
      sourceState.textContent = project.source
        ? 'Public source repository is linked above.'
        : project.visibility === 'Private'
          ? 'The repository is private, so no public source URL is presented as if it were accessible.'
          : 'No public source link is attached to this case page.';
    }

    const index = PROJECTS.findIndex(item => item.id === id);
    const next = PROJECTS[(index + 1) % PROJECTS.length];
    const nextLink = $('#nextProject');
    if (nextLink) {
      nextLink.href = projectHref(next);
      nextLink.textContent = next.name;
    }
  }

  function fillMeta() {
    const year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
    $$('[data-email]').forEach(element => element.textContent = PORTFOLIO_META.email);
  }


  /* === LIGHT HERO PARTICLES 2026 === */
  function initHeroParticles() {
    const host = $('#heroParticles');
    if (!host || !window.tsParticles) return;

    const staticMode = reducedMotion;
    const particleCount = innerWidth < 640 ? 120 : innerWidth < 1000 ? 230 : 430;

    tsParticles.load({
      id: 'heroParticles',
      options: {
        fullScreen: { enable: false },
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        detectRetina: true,
        particles: {
          number: {
            value: particleCount,
            density: { enable: true, area: 920 }
          },
          color: {
            value: ['#11120f','#2e3029','#c7cf2c','#8f9624']
          },
          shape: { type: 'circle' },
          opacity: {
            value: { min: 0.18, max: 0.82 },
            animation: { enable: !staticMode, speed: 0.22, sync: false }
          },
          size: {
            value: { min: 0.65, max: 2.35 }
          },
          links: { enable: false },
          move: {
            enable: !staticMode,
            speed: 0.34,
            direction: 'none',
            random: true,
            straight: false,
            outModes: { default: 'out' }
          }
        },
        interactivity: {
          detectsOn: 'canvas',
          events: {
            onHover: {
              enable: !staticMode && finePointer,
              mode: 'repulse'
            },
            resize: { enable: true }
          },
          modes: {
            repulse: {
              distance: 145,
              duration: 0.42,
              speed: 0.8
            }
          }
        },
        pauseOnBlur: true,
        pauseOnOutsideViewport: true
      }
    }).catch(() => {});
  }

  setActiveNav();
  initMenu();
  initProgress();
  renderHome();
  renderProjects();
  renderProjectPage();
  fillMeta();
  initHeroParticles();

  requestAnimationFrame(() => requestAnimationFrame(initMotion));
})();