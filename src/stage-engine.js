import * as T from "three";
import { shots, storyAt, clamp } from "./story.js";

const vertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const fragment = `
uniform sampler2D imageA,imageB;uniform vec2 sizeA,sizeB,resolution,pointer;uniform float blend,progress,time;varying vec2 vUv;
vec2 cover(vec2 uv,vec2 imageSize,float zoom){float screen=resolution.x/resolution.y;float image=imageSize.x/imageSize.y;vec2 crop=screen>image?vec2(1.,image/screen):vec2(screen/image,1.);return .5+(uv-.5)*crop/zoom;}
float noise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){vec2 uv=vUv;float travel=sin(blend*3.14159265);uv+=pointer*vec2(.012,.008);uv.y+=sin(time*.13)*.002;vec2 a=cover(uv,sizeA,1.025+progress*.12+travel*.14);vec2 b=cover(uv,sizeB,1.15-blend*.125);a+=vec2(0.,progress*.018);vec3 first=texture2D(imageA,clamp(a,0.,1.)).rgb;vec3 next=texture2D(imageB,clamp(b,0.,1.)).rgb;float feather=(uv.y-.5)*.17+sin(uv.x*4.+time*.12)*.025;float wipe=smoothstep(.0,.3,blend*1.3+feather-.15);if(blend<.001)wipe=0.;if(blend>.999)wipe=1.;vec3 c=mix(first,next,wipe);float grain=(noise(gl_FragCoord.xy+fract(time)*93.)-.5)*.006;c+=grain;gl_FragColor=vec4(c,1.);
#include <colorspace_fragment>
}`;

export function createJourney(canvas, { onState, onReady }) {
  const renderer = new T.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.setClearColor(0xdbe6ee);
  const fallback = new T.DataTexture(
    new Uint8Array([219, 230, 238, 255]),
    1,
    1,
  );
  fallback.needsUpdate = true;
  const uniforms = {
    imageA: { value: fallback },
    imageB: { value: fallback },
    sizeA: { value: new T.Vector2(1, 1) },
    sizeB: { value: new T.Vector2(1, 1) },
    resolution: { value: new T.Vector2(1, 1) },
    pointer: { value: new T.Vector2() },
    blend: { value: 0 },
    progress: { value: 0 },
    time: { value: 0 },
  };
  const material = new T.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const geometry = new T.PlaneGeometry(2, 2),
    scene = new T.Scene(),
    camera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene.add(new T.Mesh(geometry, material));
  const textures = new Map(),
    urls = [...new Set(shots.map((s) => s.background))],
    errors = [];
  let disposed = false,
    loaded = 0,
    raf = 0,
    last = performance.now(),
    page = window.scrollY / innerHeight,
    lastNotify = -1,
    lastProgress = -1,
    lastIndex = -1,
    lastActive = -1;
  const loader = new T.TextureLoader();
  for (const url of urls)
    loader.load(
      url,
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        texture.colorSpace = T.SRGBColorSpace;
        textures.set(url, texture);
        loaded++;
        onReady?.({ loaded, total: urls.length, errors: [...errors] });
      },
      undefined,
      () => {
        if (disposed) return;
        loaded++;
        errors.push(url);
        onReady?.({ loaded, total: urls.length, errors: [...errors] });
      },
    );
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setSize(r.width, r.height, false);
    uniforms.resolution.value.set(r.width, r.height);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement);
  resize();
  const pointer = new T.Vector2(),
    eased = new T.Vector2();
  const move = (e) => {
    if (e.pointerType === "touch") return;
    pointer.set(
      clamp((e.clientX / innerWidth) * 2 - 1, -1, 1),
      clamp(1 - (e.clientY / innerHeight) * 2, -1, 1),
    );
  };
  const leave = () => pointer.set(0, 0);
  window.addEventListener("pointermove", move, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
  function tick(now) {
    raf = 0;
    if (disposed || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    page = T.MathUtils.damp(
      page,
      window.scrollY / Math.max(1, innerHeight),
      12,
      dt,
    );
    const state = storyAt(page);
    const shot = shots[state.index],
      next = shots[Math.min(state.index + 1, shots.length - 1)];
    const a = textures.get(shot.background) || fallback,
      b = textures.get(next.background) || a;
    uniforms.imageA.value = a;
    uniforms.imageB.value = b;
    uniforms.sizeA.value.set(a.image.width, a.image.height);
    uniforms.sizeB.value.set(b.image.width, b.image.height);
    uniforms.blend.value = state.transition;
    uniforms.progress.value = state.local;
    uniforms.time.value = now / 1000;
    eased.lerp(pointer, 1 - Math.exp(-5 * dt));
    uniforms.pointer.value.copy(eased);
    renderer.render(scene, camera);
    canvas.dataset.scene = shots[state.active].id;
    canvas.dataset.progress = state.progress.toFixed(4);
    canvas.dataset.zoom = (1.025 + state.local * 0.12).toFixed(3);
    canvas.dataset.pointer = eased
      .toArray()
      .map((n) => n.toFixed(3))
      .join(",");
    if (
      (now - lastNotify > 50 &&
        (Math.abs(lastProgress - state.progress) > 0.00002 ||
          state.index !== lastIndex ||
          state.active !== lastActive)) ||
      lastNotify < 0
    ) {
      lastNotify = now;
      lastProgress = state.progress;
      lastIndex = state.index;
      lastActive = state.active;
      onState?.(state);
    }
    raf = requestAnimationFrame(tick);
  }
  const visibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };
  document.addEventListener("visibilitychange", visibility);
  const lost = (e) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    onReady?.({
      loaded,
      total: urls.length,
      errors: ["Interactive background unavailable"],
      failed: true,
    });
  };
  canvas.addEventListener("webglcontextlost", lost);
  raf = requestAnimationFrame(tick);
  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    observer.disconnect();
    window.removeEventListener("pointermove", move);
    document.documentElement.removeEventListener("pointerleave", leave);
    document.removeEventListener("visibilitychange", visibility);
    canvas.removeEventListener("webglcontextlost", lost);
    for (const t of textures.values()) t.dispose();
    fallback.dispose();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
