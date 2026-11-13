import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SITE } from './content.js';

const FONT_URL = 'https://unpkg.com/three@0.160.1/examples/fonts/helvetiker_bold.typeface.json';

/** A crystal-clear glass "dtr" monogram — transmissive beveled letters that
 *  refract a soft gradient backdrop, with studio reflections, an iridescent
 *  edge, cherry rim-light and a gentle float + mouse parallax. */
export default function Monogram() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.WebGLRenderingContext) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch { return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    // studio reflections for the glass
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    // ── gradient backdrop the glass refracts (also the panel background) ──
    const bg = document.createElement('canvas');
    bg.width = bg.height = 512;
    const bx = bg.getContext('2d');
    const lin = bx.createLinearGradient(0, 0, 0, 512);
    lin.addColorStop(0, '#F7F2EA');
    lin.addColorStop(1, '#E7DCCB');
    bx.fillStyle = lin; bx.fillRect(0, 0, 512, 512);
    const rad = bx.createRadialGradient(256, 210, 20, 256, 210, 300);
    rad.addColorStop(0, 'rgba(210,26,46,0.18)');
    rad.addColorStop(1, 'rgba(210,26,46,0)');
    bx.fillStyle = rad; bx.fillRect(0, 0, 512, 512);
    const bgTex = new THREE.CanvasTexture(bg);
    bgTex.colorSpace = THREE.SRGBColorSpace;
    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 60),
      new THREE.MeshBasicMaterial({ map: bgTex })
    );
    backdrop.position.z = -6;
    scene.add(backdrop);

    // ── lighting ──
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9a8f80, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(5, 6, 6); scene.add(key);
    const rim = new THREE.PointLight(new THREE.Color(SITE.accent), 55, 40);
    rim.position.set(-6, -1, 4); scene.add(rim);
    const fill = new THREE.PointLight(0xffffff, 16, 40);
    fill.position.set(4, -3, 5); scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    // crystal-clear glass material
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0, roughness: 0.03,
      transmission: 1, thickness: 1.5, ior: 1.5,
      clearcoat: 1, clearcoatRoughness: 0.06,
      iridescence: 0.4, iridescenceIOR: 1.32,
      attenuationColor: new THREE.Color('#f6dfe3'),
      attenuationDistance: 3.2,
      envMapIntensity: 1.5,
      specularIntensity: 1,
      transparent: true
    });

    let disposed = false;

    const loader = new FontLoader();
    loader.load(
      FONT_URL,
      (font) => {
        if (disposed) return;
        const geo = new TextGeometry(SITE.initials, {
          font, size: 1.8, height: 0.6,
          curveSegments: 14, bevelEnabled: true,
          bevelThickness: 0.06, bevelSize: 0.04, bevelOffset: 0, bevelSegments: 6
        });
        geo.center();
        const letters = new THREE.Mesh(geo, glass);
        group.add(letters);
        renderer.render(scene, camera);
      },
      undefined,
      () => { /* font failed — DOM fallback behind canvas stays visible */ }
    );

    function resize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      camera.position.z = w < 680 ? 10.5 : 8.2;
      renderer.render(scene, camera);
    }
    resize();
    window.addEventListener('resize', resize);

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    let running = true;
    const io = new IntersectionObserver((en) => { running = en[0].isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    const clock = new THREE.Clock();
    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      if (!running) return;
      const t = clock.getElapsedTime();
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      group.rotation.y = cur.x * 0.5 + Math.sin(t * 0.3) * 0.06;
      group.rotation.x = cur.y * 0.28 + Math.sin(t * 0.4) * 0.03;
      group.position.y = 1.0 + Math.sin(t * 0.7) * 0.12; // lift above the caption
      rim.position.x = Math.sin(t * 0.5) * 6;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      io.disconnect();
      pmrem.dispose(); envTex.dispose(); bgTex.dispose();
      glass.dispose();
      geoDispose(group);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />;
}

function geoDispose(obj) {
  obj.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
}
