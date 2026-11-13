import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  certificateCollection,
  certificateCategories,
  certificateUrl,
  validCertificates,
} from "./certificate-data.js";
import {
  wrap,
  smoothstep,
  tapePose,
  shortestTarget,
} from "./certificate-motion.js";
import "./academic-fonts.css";
import "./certifications-section.css";

const EASE = "cubic-bezier(.2,.8,.2,1)";
const SHEET_EASE = "cubic-bezier(.76,0,.18,1)";
const INK = [
  [150, 330, 0],
  [340, 600, 120],
  [250, 120, 220],
  [90, 760, 300],
  [400, 250, 360],
  [260, 860, 420],
  [230, 470, 180],
];
const dateOf = (record) =>
  record.issuedDate || record.completionDate || "Date not specified";
const yearOf = (record) => dateOf(record).match(/\d{4}/)?.[0] || "UNDATED";
const numberOf = (index) => String(index + 1).padStart(2, "0");

function OriginalImage({ record, className = "" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [record.id]);
  return failed ? (
    <span className="cred-image-error">
      Preview unavailable. The original document remains available.
    </span>
  ) : (
    <img
      className={className}
      src={certificateUrl(record.preview)}
      alt={`${record.title}, issued by ${record.issuer} to ${record.recipient}`}
      loading="lazy"
      draggable="false"
      onError={() => setFailed(true)}
    />
  );
}

function Metadata({ record }) {
  return (
    <dl className="cred-metadata">
      <div>
        <dt>ISSUING ORGANIZATION</dt>
        <dd>{record.issuer}</dd>
      </div>
      {record.provider && record.provider !== record.issuer && (
        <div>
          <dt>PROVIDER</dt>
          <dd>{record.provider}</dd>
        </div>
      )}
      <div>
        <dt>{record.issuedDate ? "ISSUED" : "COMPLETED"}</dt>
        <dd>{dateOf(record)}</dd>
      </div>
      <div>
        <dt>RECIPIENT</dt>
        <dd>{record.recipient}</dd>
      </div>
      {record.credentialId && (
        <div>
          <dt>CREDENTIAL ID</dt>
          <dd>{record.credentialId}</dd>
        </div>
      )}
      {record.expirationDate && (
        <div>
          <dt>EXPIRES</dt>
          <dd>{record.expirationDate}</dd>
        </div>
      )}
      {record.duration && (
        <div>
          <dt>DURATION</dt>
          <dd>{record.duration}</dd>
        </div>
      )}
    </dl>
  );
}

function Actions({ record, children }) {
  return (
    <div className="cred-actions">
      <a
        className="cred-box"
        href={certificateUrl(record.document)}
        target="_blank"
        rel="noopener noreferrer"
      >
        VIEW ORIGINAL DOCUMENT <span aria-hidden="true">↗</span>
      </a>
      {certificateUrl(record.verificationUrl) && (
        <a
          className="cred-box"
          href={certificateUrl(record.verificationUrl)}
          target="_blank"
          rel="noopener noreferrer"
        >
          VERIFY CREDENTIAL ↗
        </a>
      )}
      {children}
    </div>
  );
}

export default function CertificationsSection({ paused = false, onMeasure }) {
  const records = useMemo(
    () => validCertificates(certificateCollection.records),
    [],
  );
  const categories = useMemo(() => certificateCategories(records), [records]);
  const root = useRef(null),
    scene = useRef(null),
    shelf = useRef(null),
    stage = useRef(null),
    probe = useRef(null),
    detailBelow = useRef(null),
    dialog = useRef(null),
    cursor = useRef(null),
    play = useRef(null),
    indicator = useRef(null);
  const tapeRefs = useRef([]),
    captionRefs = useRef([]),
    tabRefs = useRef([]),
    inkRefs = useRef([]),
    controls = useRef({});
  const [active, setActive] = useState(0),
    [opened, setOpened] = useState(false);
  const uid = useId().replace(/:/g, "");
  const state = useRef({
    s: records.length,
    T: records.length,
    hover: -1,
    tx: 0,
    ty: 0,
    mx: 0,
    my: 0,
    cx: 0,
    cy: 0,
    pointer: false,
    button: false,
    dragging: false,
    visible: false,
    reading: false,
    inside: false,
    active: 0,
    hold: 0,
    inkStart: null,
    isOpen: false,
    busy: false,
    fine: false,
  });
  const record = records[active];

  useLayoutEffect(() => {
    if (!onMeasure || !root.current) return;
    const observer = new ResizeObserver(() =>
      onMeasure(root.current.getBoundingClientRect().height),
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [onMeasure]);

  useEffect(() => {
    if (!records.length) return;
    const motion = state.current,
      count = records.length,
      total = count * 3;
    const elements = tapeRefs.current;
    let raf = 0,
      last = 0,
      wheelTimer = 0,
      initialTimer = 0,
      autoClock = 0,
      initialDone = false,
      stopped = false;
    let drag = null,
      suppressed = false,
      returnFocus = null,
      animations = [],
      geometry = {
        H: 300,
        ws: 50,
        d: 158,
        gap: 9,
        width: 1000,
        left: 0,
        cy: 0,
      };
    const lift = new Float32Array(total);
    const duration = (value) => (paused ? 1 : value);
    const track = (animation) => {
      animations.push(animation);
      animation.finished
        .then(() => {
          if (stopped) return;
          try {
            animation.commitStyles();
          } catch {
            /* Detached caption lines need no retained styles. */
          }
          animation.cancel();
          animations = animations.filter((entry) => entry !== animation);
        })
        .catch(() => {});
      return animation;
    };
    const manual = () => {
      motion.hold = performance.now() + 10000;
      autoClock = 0;
      initialDone = true;
      clearTimeout(initialTimer);
    };
    const measure = () => {
      if (stopped || !scene.current || !shelf.current || !probe.current) return;
      const rect = scene.current.getBoundingClientRect(),
        sr = shelf.current.getBoundingClientRect();
      const H = probe.current.getBoundingClientRect().height;
      geometry = {
        H,
        ws: (H * 142) / 840,
        d: (H * 474) / 900,
        gap: H * 0.03,
        width: rect.width,
        left: rect.left,
        cy: sr.top + sr.height / 2,
      };
      stage.current.style.setProperty("--tape-H", `${H}px`);
      stage.current.style.setProperty("--ws", `${geometry.ws}px`);
      stage.current.style.setProperty("--d", `${geometry.d}px`);
      updateIndicator(motion.active);
      wake();
    };
    const updateIndicator = (index) => {
      const cat = records[index].category;
      const tab = tabRefs.current[categories.indexOf(cat) + 1];
      if (tab && indicator.current) {
        indicator.current.style.width = `${tab.offsetWidth}px`;
        indicator.current.style.transform = `translateX(${tab.offsetLeft}px)`;
      }
    };
    const caption = (index, direction) => {
      const item = records[index];
      [item.title, `${item.issuer} / ${item.category}`, dateOf(item)].forEach(
        (text, i) => {
          const mask = captionRefs.current[i];
          if (!mask) return;
          const old = [...mask.children],
            span = document.createElement("span");
          span.textContent = text;
          mask.append(span);
          if (paused) old.forEach((child) => child.remove());
          else {
            track(
              span.animate(
                [
                  { transform: `translateY(${direction * 105}%)` },
                  { transform: "translateY(0)" },
                ],
                { duration: 650, easing: EASE, fill: "both" },
              ),
            );
            old.forEach((child) => {
              if (child.dataset.leaving) return;
              child.dataset.leaving = "true";
              const computed = getComputedStyle(child).transform;
              const animation = track(
                child.animate(
                  [
                    {
                      transform:
                        computed === "none" ? "translateY(0)" : computed,
                    },
                    { transform: `translateY(${-direction * 105}%)` },
                  ],
                  { duration: 650, easing: EASE, fill: "both" },
                ),
              );
              animation.finished.then(() => child.remove()).catch(() => {});
            });
          }
        },
      );
      updateIndicator(index);
      setActive(index);
    };
    const revealBelow = () => {
      manual();
      detailBelow.current?.scrollIntoView({
        behavior: paused ? "instant" : "smooth",
        block: "start",
      });
    };
    const advance = (amount, scroll = false) => {
      if (motion.isOpen || motion.busy) return;
      manual();
      motion.T = Math.round(motion.T) + amount;
      if (scroll) {
        clearTimeout(initialTimer);
        initialTimer = window.setTimeout(revealBelow, paused ? 0 : 1000);
      }
      wake();
    };
    const coverRect = () => {
      let nearest = 0,
        distance = Infinity;
      elements.forEach((element, index) => {
        const r = wrap(index - motion.s + total / 2, total) - total / 2;
        if (Math.abs(r) < distance) {
          distance = Math.abs(r);
          nearest = index;
        }
      });
      return (
        elements[nearest]
          ?.querySelector(".cred-cover")
          .getBoundingClientRect() || scene.current.getBoundingClientRect()
      );
    };
    const clipFor = (rect) =>
      `inset(${Math.max(0, rect.top)}px ${Math.max(0, innerWidth - rect.right)}px ${Math.max(0, innerHeight - rect.bottom)}px ${Math.max(0, rect.left)}px round 3px)`;
    const openDetail = () => {
      if (motion.isOpen || motion.busy) return;
      manual();
      motion.T = Math.round(motion.s);
      const index = wrap(Math.round(motion.s), count);
      if (motion.active !== index) {
        motion.active = index;
        caption(index, 1);
      }
      const box = dialog.current,
        rect = coverRect();
      if (!box) return;
      returnFocus = document.activeElement;
      motion.isOpen = true;
      motion.busy = true;
      motion.inkStart = performance.now() + (paused ? -5000 : 520);
      inkRefs.current.forEach((node) => node?.setAttribute("r", "0"));
      setOpened(true);
      box.showModal();
      box.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
      track(
        box.animate(
          [
            { clipPath: clipFor(rect), transform: "rotate(-4.5deg)" },
            { clipPath: "inset(0 0 0 0 round 0)", transform: "rotate(0)" },
          ],
          { duration: duration(1050), easing: SHEET_EASE, fill: "both" },
        ),
      )
        .finished.then(() => {
          motion.busy = false;
        })
        .catch(() => {});
      box.querySelectorAll(".cred-reveal > *").forEach((line, index) =>
        track(
          line.animate(
            [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }],
            {
              duration: duration(900),
              delay: paused ? 0 : 620 + index * 75,
              easing: EASE,
              fill: "both",
            },
          ),
        ),
      );
      box.querySelector(".cred-close")?.focus({ preventScroll: true });
      wake();
    };
    const closeDetail = () => {
      if (!motion.isOpen || motion.busy) return;
      motion.busy = true;
      motion.inkStart = null;
      const box = dialog.current,
        rect = coverRect();
      box.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
      track(
        box.animate(
          [
            { clipPath: "inset(0 0 0 0 round 0)", transform: "rotate(0)" },
            { clipPath: clipFor(rect), transform: "rotate(-4.5deg)" },
          ],
          { duration: duration(850), easing: SHEET_EASE, fill: "both" },
        ),
      )
        .finished.then(() => {
          if (stopped) return;
          box
            .getAnimations({ subtree: true })
            .forEach((animation) => animation.cancel());
          box.close();
          motion.isOpen = false;
          motion.busy = false;
          setOpened(false);
          animations.forEach((animation) => animation.cancel());
          animations = [];
          returnFocus?.focus({ preventScroll: true });
          manual();
          wake();
        })
        .catch(() => {});
    };
    const frame = (now) => {
      raf = 0;
      if (stopped || document.hidden || (!motion.visible && !motion.isOpen)) {
        last = 0;
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const { H, ws, d, gap, width, left, cy } = geometry;
      const oldS = motion.s;
      motion.s = paused
        ? motion.T
        : motion.s +
          (motion.T - motion.s) *
            (1 - Math.exp(-(motion.dragging ? 18 : 5.2) * dt));
      if (Math.abs(motion.T - motion.s) < 0.0001) motion.s = motion.T;
      if (Math.abs(motion.s) > count * 4) {
        const shift = Math.trunc(motion.s / count) * count;
        motion.s -= shift;
        motion.T -= shift;
      }
      const index = wrap(Math.round(motion.s), count);
      if (index !== motion.active) {
        motion.active = index;
        caption(index, Math.sign(motion.s - oldS) || 1);
      }
      const onCover =
        motion.pointer &&
        !motion.isOpen &&
        Math.abs(motion.mx - (left + width / 2)) < 0.55 * d &&
        Math.abs(motion.my - cy) < 0.55 * H &&
        Math.abs(motion.T - motion.s) < 0.3;
      const aimY =
        !paused && motion.pointer
          ? onCover
            ? ((motion.mx - left - width / 2) / (0.55 * d)) * 9
            : ((motion.mx - left - width / 2) / width) * 5
          : 0;
      const aimX = !paused && onCover ? (-(motion.my - cy) / (H / 2)) * 6 : 0;
      motion.tx += (aimX - motion.tx) * (1 - Math.exp(-7 * dt));
      motion.ty += (aimY - motion.ty) * (1 - Math.exp(-7 * dt));
      elements.forEach((element, v) => {
        if (!element) return;
        const r = wrap(v - motion.s + total / 2, total) - total / 2;
        lift[v] +=
          ((motion.hover === v && Math.abs(r) > 0.5 ? 1 : 0) - lift[v]) *
          (paused ? 1 : 1 - Math.exp(-12 * dt));
        const p = tapePose(r, H, ws, gap, d, motion.tx, motion.ty, lift[v]);
        const show = Math.abs(p.x) < width / 2 + 1.5 * d;
        element.style.visibility = show ? "visible" : "hidden";
        element.tabIndex = show && Math.abs(r) < count / 2 ? 0 : -1;
        if (!show) return;
        element.style.transform = `translate3d(${p.x}px,${p.y}px,${p.z}px) rotateZ(${p.rotateZ}deg) rotateX(${p.rotateX}deg) rotateY(${p.rotateY}deg)`;
        element.style.zIndex = p.zIndex;
        element
          .querySelector(".cred-spine")
          .style.setProperty("--shade", p.spineShade);
        element
          .querySelector(".cred-cover")
          .style.setProperty("--shade", p.coverShade);
        element.setAttribute(
          "aria-pressed",
          Math.abs(r) < 0.5 ? "true" : "false",
        );
      });
      const scale = motion.isOpen
        ? 0
        : smoothstep(Math.max(0, 1 - Math.abs(motion.T - motion.s) * 3));
      play.current.style.transform = `translate(-50%,-50%) scale(${scale})`;
      play.current.style.left = `calc(50% - ${0.5 * d + 6}px)`;
      play.current.style.top = `calc(50% + ${0.36 * H}px)`;
      if (cursor.current) {
        motion.cx += (motion.mx - motion.cx) * (1 - Math.exp(-16 * dt));
        motion.cy += (motion.my - motion.cy) * (1 - Math.exp(-16 * dt));
        cursor.current.style.transform = `translate3d(${motion.cx}px,${motion.cy}px,0)`;
        cursor.current.dataset.state = onCover
          ? "open"
          : motion.hover >= 0
            ? "spine"
            : motion.button
              ? "button"
              : "default";
        cursor.current.style.visibility =
          motion.pointer && motion.fine ? "visible" : "hidden";
      }
      if (motion.inkStart !== null) {
        INK.forEach(([, , delay], i) => {
          const p = Math.max(
            0,
            Math.min(1, (now - motion.inkStart - delay) / 1250),
          );
          inkRefs.current[i]?.setAttribute(
            "r",
            String(720 * (1 - (1 - p) ** 3)),
          );
        });
        if (now - motion.inkStart > 2400) motion.inkStart = null;
      }
      const autoplay =
        !paused &&
        !motion.isOpen &&
        !motion.reading &&
        !motion.dragging &&
        now > motion.hold;
      if (autoplay) {
        autoClock += dt * 1000;
        if (autoClock >= 4500) {
          motion.T = Math.round(motion.T) + 1;
          autoClock = 0;
        }
      } else autoClock = 0;
      if (motion.visible && !initialDone && !motion.inside && !motion.isOpen) {
        initialDone = true;
        initialTimer = window.setTimeout(() => {
          if (
                !motion.isOpen &&
            motion.visible &&
            performance.now() > motion.hold
          )
            detailBelow.current?.scrollIntoView({
              behavior: paused ? "instant" : "smooth",
              block: "start",
            });
        }, 7000);
      }
      raf = requestAnimationFrame(frame);
    };
    function wake() {
      if (
        !raf &&
        !stopped &&
        !document.hidden &&
        (motion.visible || motion.isOpen)
      )
        raf = requestAnimationFrame(frame);
    }
    const pointerMove = (event) => {
      const inSection = !!event.target.closest?.(".cred-section,.cred-dialog");
      if (!inSection && !drag) {
        motion.pointer = false;
        if (cursor.current) cursor.current.style.visibility = "hidden";
        return;
      }
      motion.mx = event.clientX;
      motion.my = event.clientY;
      motion.pointer = true;
      motion.fine =
        event.pointerType === "mouse" &&
        !!event.target.closest?.(".cred-shelf-scene");
      motion.button = !!event.target.closest("button,a");
      if (drag && event.pointerId === drag.id) {
        const dx = event.clientX - drag.x;
        if (Math.abs(dx) > 5) {
          motion.dragging = true;
          suppressed = true;
          manual();
          motion.T = drag.T - dx / (geometry.ws + geometry.gap);
        }
      }
      wake();
    };
    const pointerDown = (event) => {
      if (event.button !== 0 || motion.isOpen) return;
      manual();
      drag = { id: event.pointerId, x: event.clientX, T: motion.T };
      suppressed = false;
    };
    const pointerUp = () => {
      if (drag) {
        motion.T = Math.round(motion.T);
        motion.dragging = false;
        drag = null;
        wake();
        window.setTimeout(() => {
          suppressed = false;
        }, 0);
      }
    };
    const pointerLeave = () => {
      motion.pointer = false;
      motion.hover = -1;
      motion.inside = false;
      wake();
    };
    const wheel = (event) => {
      if (motion.isOpen) return;
      const horizontal =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
      if (horizontal) event.preventDefault();
      const raw =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      const delta =
        raw *
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      manual();
      motion.T +=
        (Math.max(-400, Math.min(400, delta)) / (geometry.ws + geometry.gap)) *
        0.5;
      clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        motion.T = Math.round(motion.T);
        wake();
      }, 160);
      wake();
    };
    const key = (event) => {
      if (
        event.target.closest("input,textarea,select") ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      )
        return;
      if (motion.isOpen) {
        if (event.key === "Escape") {
          event.preventDefault();
          closeDetail();
        }
        return;
      }
      if (!motion.visible || !root.current.contains(document.activeElement))
        return;
      if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
        advance(event.key === "ArrowRight" ? 1 : -1);
      } else if (event.key === "Enter" && event.target === scene.current) {
        event.preventDefault();
        openDetail();
      }
    };
    controls.current = {
      advance,
      openDetail,
      closeDetail,
      revealBelow,
      select(v) {
        if (suppressed || motion.dragging || motion.isOpen) return;
        const r = wrap(v - motion.s + total / 2, total) - total / 2;
        if (Math.abs(r) < 0.5) openDetail();
        else {
          manual();
          motion.T = Math.round(motion.s + r);
          wake();
        }
      },
      category(category) {
        manual();
        const index =
          category === "all"
            ? 0
            : records.findIndex((item) => item.category === category);
        motion.T = shortestTarget(motion.T, index, count);
        wake();
      },
      hover(v) {
        motion.hover = v;
        wake();
      },
      enter() {
        motion.inside = true;
      },
      leave() {
        motion.inside = false;
        motion.hover = -1;
        wake();
      },
      pause() {
        manual();
      },
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        motion.visible = entry.isIntersecting;
        if (motion.visible) measure();
        else {
          clearTimeout(initialTimer);
          motion.pointer = false;
          if (cursor.current) cursor.current.style.visibility = "hidden";
        }
        wake();
      },
      { threshold: 0.05 },
    );
    observer.observe(scene.current);
    const readingObserver = new IntersectionObserver(
      ([entry]) => {
        motion.reading = entry.isIntersecting;
      },
      { threshold: 0.15 },
    );
    readingObserver.observe(detailBelow.current);
    const resize = new ResizeObserver(measure);
    resize.observe(scene.current);
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
        autoClock = 0;
      } else wake();
    };
    shelf.current.addEventListener("wheel", wheel, { passive: false });
    shelf.current.addEventListener("pointerdown", pointerDown);
    root.current.addEventListener("pointerleave", pointerLeave);
    const scroll = () => {
      if (motion.visible) measure();
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointercancel", pointerUp);
    document.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    const shelfNode = shelf.current,
      rootNode = root.current,
      dialogNode = dialog.current;
    caption(motion.active, 1);
    measure();
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      clearTimeout(wheelTimer);
      clearTimeout(initialTimer);
      observer.disconnect();
      readingObserver.disconnect();
      resize.disconnect();
      animations.forEach((animation) => animation.cancel());
      shelfNode.removeEventListener("wheel", wheel);
      shelfNode.removeEventListener("pointerdown", pointerDown);
      rootNode.removeEventListener("pointerleave", pointerLeave);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerUp);
      document.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
      dialogNode
        .getAnimations({ subtree: true })
        .forEach((animation) => animation.cancel());
      if (dialogNode.open) dialogNode.close();
      motion.isOpen = false;
      motion.busy = false;
      motion.visible = false;
      controls.current = {};
    };
  }, [paused, records, categories]);

  useLayoutEffect(() => {
    if (!detailBelow.current || paused) return;
    const animations = [
      ...detailBelow.current.querySelectorAll(".cred-reveal > *"),
    ].map((node, index) =>
      node.animate(
        [{ transform: "translateY(105%)" }, { transform: "translateY(0)" }],
        { duration: 650, delay: index * 45, easing: EASE, fill: "both" },
      ),
    );
    return () => animations.forEach((animation) => animation.cancel());
  }, [active, paused]);

  if (!records.length)
    return (
      <section className="cred-section cred-empty">
        <h2>Certifications</h2>
        <p>Certificate documents are not available in this preview.</p>
      </section>
    );
  return (
    <section
      ref={root}
      className={`cred-section${paused ? " cred-paused" : ""}`}
      aria-labelledby="credential-archive-title"
      data-certificate-count={records.length}
    >
      <div
        ref={scene}
        className="cred-shelf-scene"
        tabIndex={0}
        aria-label="Interactive certificate shelf. Use left and right arrows to browse, Enter to open."
      >
        <div className="cred-grain" aria-hidden="true" />
        <header className="cred-topbar">
          <button
            className="cred-box"
            onClick={() => controls.current.revealBelow?.()}
          >
            THE RECORDS ↓
          </button>
          <div className="cred-logo">
            <h2 id="credential-archive-title">Certifications</h2>
            <span>DHARANTEJ REDDY</span>
          </div>
          <span className="cred-label cred-years">LEARNING / 2023—2025</span>
        </header>
        <nav
          className="cred-tabs"
          aria-label="Certificate subjects"
          onPointerEnter={() => controls.current.enter?.()}
          onPointerLeave={() => controls.current.leave?.()}
        >
          <span
            ref={indicator}
            className="cred-tab-indicator"
            aria-hidden="true"
          />
          {["all", ...categories].map((category, index) => (
            <button
              key={category}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              className="cred-label"
              aria-pressed={record.category === category}
              onClick={() => controls.current.category?.(category)}
            >
              {category === "all"
                ? "ALL"
                : category === "Artificial Intelligence"
                  ? "AI"
                  : category === "Mobile Development"
                    ? "MOBILE"
                    : category === "Professional Development"
                      ? "PROFESSIONAL"
                      : category}
            </button>
          ))}
        </nav>
        <div ref={probe} className="cred-height-probe" aria-hidden="true" />
        <section
          ref={shelf}
          className="cred-shelf"
          aria-label="3D certificate cassette shelf"
          onPointerEnter={() => controls.current.enter?.()}
          onPointerLeave={() => controls.current.leave?.()}
        >
          <div ref={stage} className="cred-stage">
            {Array.from({ length: 3 }, (_, copy) =>
              records.map((item, index) => {
                const v = copy * records.length + index;
                return (
                  <button
                    type="button"
                    key={`${copy}-${item.id}`}
                    ref={(node) => {
                      tapeRefs.current[v] = node;
                    }}
                    className={`cred-tape cred-tape-tone-${index % 4}`}
                    data-record={item.id}
                    aria-label={`${item.title} — ${item.issuer}. Select or open certificate.`}
                    onPointerEnter={() => controls.current.hover?.(v)}
                    onPointerLeave={() => controls.current.hover?.(-1)}
                    onFocus={() => controls.current.pause?.()}
                    onClick={() => controls.current.select?.(v)}
                  >
                    <span className="cred-face cred-spine">
                      <span className="cred-spine-number">
                        {numberOf(index)}
                      </span>
                      <span className="cred-spine-title">{item.title}</span>
                      <span className="cred-spine-issuer">{item.issuer}</span>
                      <span className="cred-spine-foot">
                        {yearOf(item)}
                        <b>ARCHIVE</b>
                      </span>
                    </span>
                    <span className="cred-face cred-cover">
                      <span className="cred-cover-eyebrow">
                        THE CREDENTIAL ARCHIVE / {numberOf(index)}
                      </span>
                      <span className="cred-cover-title">{item.title}</span>
                      <span className="cred-cover-issuer">{item.issuer}</span>
                      <span className="cred-cover-preview">
                        <OriginalImage record={item} />
                      </span>
                      <span className="cred-cover-category">
                        {item.category}
                      </span>
                      <span className="cred-cover-foot">
                        <span>{yearOf(item)}</span>
                        <b>
                          ORIGINAL
                          <br />
                          RECORD
                        </b>
                      </span>
                    </span>
                  </button>
                );
              }),
            )}
          </div>
          <span ref={play} hidden aria-hidden="true" />
        </section>
        <div className="cred-caption" aria-live="polite" aria-atomic="true">
          <div
            className="cred-caption-title"
            ref={(node) => {
              captionRefs.current[0] = node;
            }}
          />
          <div
            className="cred-caption-issuer cred-label"
            ref={(node) => {
              captionRefs.current[1] = node;
            }}
          />
          <div
            className="cred-caption-date cred-label"
            ref={(node) => {
              captionRefs.current[2] = node;
            }}
          />
        </div>
        <button
          className="cred-arrow cred-prev"
          aria-label="Previous certificate"
          onClick={() => controls.current.advance?.(-1)}
        >
          <svg viewBox="0 0 20 12" aria-hidden="true">
            <path d="M6 1 1 6l5 5M1 6h18" />
          </svg>
        </button>
        <button
          className="cred-arrow cred-next"
          aria-label="Next certificate"
          onClick={() => controls.current.advance?.(1)}
        >
          <svg viewBox="0 0 20 12" aria-hidden="true">
            <path d="m14 1 5 5-5 5M19 6H1" />
          </svg>
        </button>
        <footer className="cred-shelf-footer">
          <span className="cred-label">
            {numberOf(active)} / {String(records.length).padStart(2, "0")}{" "}
            ORIGINAL CREDENTIALS
          </span>
          <span className="cred-label">DRAG TO BROWSE / OPEN TO READ</span>
        </footer>
      </div>
      <article
        ref={detailBelow}
        className="cred-details"
        aria-labelledby="cred-detail-heading"
        onPointerEnter={() => controls.current.pause?.()}
        onFocusCapture={() => controls.current.pause?.()}
      >
        <div className="cred-detail-copy" key={record.id}>
          <div className="cred-reveal">
            <p className="cred-label cred-cobalt">
              RECORD {numberOf(active)} / {record.category}
            </p>
          </div>
          <div className="cred-reveal">
            <h3 id="cred-detail-heading">{record.title}</h3>
          </div>
          <div className="cred-reveal">
            <p className="cred-detail-subtitle">
              {record.issuer} / {dateOf(record)}
            </p>
          </div>
          <div className="cred-reveal">
            <Metadata record={record} />
          </div>
          <div className="cred-reveal">
            <p className="cred-description">{record.description}</p>
          </div>
          {record.skills?.length > 0 && (
            <div className="cred-reveal">
              <ul className="cred-skills" aria-label="Verified subjects">
                {record.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="cred-reveal">
            <Actions record={record}>
              <button
                className="cred-box"
                onClick={() => controls.current.openDetail?.()}
              >
                EXPAND RECORD ↗
              </button>
              <button
                className="cred-box"
                onClick={() =>
                  scene.current?.scrollIntoView({
                    behavior: paused ? "instant" : "smooth",
                    block: "start",
                  })
                }
              >
                BACK TO SHELF ↑
              </button>
            </Actions>
          </div>
        </div>
        <a
          className="cred-document"
          href={certificateUrl(record.document)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <OriginalImage record={record} />
          <span className="cred-label">
            ORIGINAL DOCUMENT / VIEW FULL SIZE ↗
          </span>
        </a>
      </article>
      {createPortal(
        <>
          <dialog
            ref={dialog}
            className="cred-dialog"
            aria-labelledby={`cred-dialog-title-${uid}`}
            onCancel={(event) => {
              event.preventDefault();
              controls.current.closeDetail?.();
            }}
            data-open={opened}
          >
            <button
              className="cred-box cred-close"
              onClick={() => controls.current.closeDetail?.()}
            >
              CLOSE / BACK TO SHELF
            </button>
            <div className="cred-dialog-brand">
              THE CREDENTIAL ARCHIVE <span>DHARANTEJ REDDY</span>
            </div>
            <div className="cred-dialog-grid">
              <div className="cred-dialog-copy">
                <div className="cred-reveal">
                  <p className="cred-label cred-cobalt">
                    {record.category} / RECORD {numberOf(active)}
                  </p>
                </div>
                <div className="cred-reveal">
                  <h3 id={`cred-dialog-title-${uid}`}>{record.title}</h3>
                </div>
                <div className="cred-reveal">
                  <p className="cred-label cred-muted">
                    {record.issuer} / {dateOf(record)}
                  </p>
                </div>
                <div className="cred-reveal">
                  <p className="cred-description">{record.description}</p>
                </div>
                <div className="cred-reveal">
                  <Metadata record={record} />
                </div>
                {record.skills?.length > 0 && (
                  <div className="cred-reveal">
                    <ul className="cred-skills">
                      {record.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="cred-reveal">
                  <p className="cred-credit">
                    Earned by {record.recipient}. Original document preserved.
                  </p>
                </div>
                <div className="cred-reveal">
                  <Actions record={record} />
                </div>
              </div>
              <a
                className="cred-ink-poster"
                href={certificateUrl(record.document)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View complete original ${record.title}`}
              >
                <svg
                  viewBox="0 0 474 900"
                  role="img"
                  aria-label={`${record.title} original certificate`}
                >
                  <defs>
                    <filter
                      id={`cred-ink-filter-${uid}`}
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency=".011"
                        numOctaves="3"
                        seed="7"
                        result="noise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="120"
                        xChannelSelector="R"
                        yChannelSelector="G"
                      />
                    </filter>
                    <mask
                      id={`cred-ink-mask-${uid}`}
                      maskUnits="userSpaceOnUse"
                      x="-200"
                      y="-200"
                      width="874"
                      height="1300"
                    >
                      <g filter={`url(#cred-ink-filter-${uid})`}>
                        {INK.map(([cx, cy], index) => (
                          <circle
                            key={index}
                            ref={(node) => {
                              inkRefs.current[index] = node;
                            }}
                            cx={cx}
                            cy={cy}
                            r="0"
                            fill="white"
                          />
                        ))}
                      </g>
                    </mask>
                  </defs>
                  <g mask={`url(#cred-ink-mask-${uid})`}>
                    <rect width="474" height="900" fill="#e4e0d6" />
                    <image
                      href={certificateUrl(record.preview)}
                      x="12"
                      y="12"
                      width="450"
                      height="876"
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </g>
                </svg>
                <span className="cred-label">VIEW ORIGINAL DOCUMENT ↗</span>
              </a>
            </div>
          </dialog>
          <div ref={cursor} className="cred-cursor" aria-hidden="true">
            <span className="cred-cursor-ring" />
            <span className="cred-cursor-dot" />
            <span className="cred-cursor-label">
              OPEN
              <br />
              RECORD
            </span>
          </div>
        </>,
        document.body,
      )}
    </section>
  );
}
