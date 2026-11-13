import { Canvas, useFrame, useThree } from "@react-three/fiber";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as T from "three";

import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

import { clamp, smooth } from "./story.js";

export const SIGNAL_TRAIL = {
  maxPoints: 60,
  headRadius: 125,
  noiseAmplitude: 38,
  blobPoints: 24,
  fade: 0.92,
  sampleDistance: 8,
};

class OrbitPath extends T.Curve {
  constructor(index) {
    super();
    this.index = index;
  }

  getPoint(t, target = new T.Vector3()) {
    const a = t * Math.PI * 2,
      i = this.index;

    const r = 1.27 + i * 0.2 + 0.075 * Math.sin(a * 3 + i);

    return target.set(
      Math.cos(a) * r,
      Math.sin(a) * r * (0.77 + i * 0.055),
      0.12 * Math.sin(a * 2 + i),
    );
  }
}

function foldedGlass() {
  const g = new T.PlaneGeometry(1.4, 2.35, 12, 12),
    p = g.attributes.position;

  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      y = p.getY(i);
    p.setZ(i, Math.abs(x) * 0.55 + 0.11 * Math.sin(y * 2));
  }

  g.computeVertexNormals();
  return g;
}

function Sculpture({ wire = false, paused, intro }) {
  const root = useRef(),
    rings = useRef([]),
    core = useRef(),
    particles = useRef(),
    elapsed = useRef(intro ? 0 : 3),
    filaments = useRef([]);
  const particleCount = useMemo(
    () => (matchMedia("(max-width: 760px)").matches ? 20 : 42),
    [],
  );

  const { pointer } = useThree();

  const geo = useMemo(
    () => ({
      rings: [0, 1, 2, 3].map(
        (i) =>
          new T.TubeGeometry(
            new OrbitPath(i),
            144,
            i === 0 ? 0.065 : 0.035,
            8,
            true,
          ),
      ),
      glass: foldedGlass(),
      bead: new T.IcosahedronGeometry(0.025, 0),
      core: new T.CylinderGeometry(0.13, 0.13, 0.85, 3, 1),
    }),
    [],
  );

  const paths = useMemo(
    () =>
      [0, 1, 2].map((i) => {
        const points = Array.from({ length: 65 }, (_, n) => {
          const a = (n / 64) * Math.PI * 2;
          return new T.Vector3(
            Math.cos(a) * (1.03 + i * 0.13),
            Math.sin(a) * (0.6 + i * 0.19),
            Math.sin(a * 2 + i) * 0.52,
          );
        });

        return new T.BufferGeometry().setFromPoints(points);
      }),
    [],
  );

  useEffect(() => {
    root.current.traverse((o) => o.layers.set(wire ? 1 : 0));

    const dummy = new T.Object3D();

    for (let i = 0; i < particleCount; i++) {
      const a = i * 2.399963,
        r = 2.05 + (i % 5) * 0.09;
      dummy.position.set(
        Math.cos(a) * r,
        Math.sin(a) * r * 0.8,
        Math.sin(i * 1.7) * 0.75,
      );
      dummy.updateMatrix();
      particles.current.setMatrixAt(i, dummy.matrix);
    }

    particles.current.instanceMatrix.needsUpdate = true;

    return () => {
      geo.rings.forEach((g) => g.dispose());
      geo.glass.dispose();
      geo.bead.dispose();
      geo.core.dispose();
      paths.forEach((g) => g.dispose());
    };
  }, [geo, paths, wire, particleCount]);

  useFrame((_, delta) => {
    if (!paused) elapsed.current += Math.min(delta, 0.05);

    const t = elapsed.current,
      enter = paused ? 1 : smooth(0, 2.1, t);

    root.current.rotation.set(
      0.12 + pointer.y * 0.055,
      0.12 + pointer.x * 0.13,
      0.06,
    );

    root.current.position.y = paused ? 0 : Math.sin(t * 0.38) * 0.065;

    root.current.scale.setScalar(0.82 + 0.18 * enter);

    rings.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.set(
        0.28 + i * 0.7 + (1 - enter) * (0.8 - i * 0.1),
        0.3 + i * 0.64 + (paused ? 0 : t * (i % 2 ? -0.065 : 0.045)),
        i * 0.55 + (paused ? 0 : t * 0.025),
      );
      ring.scale.setScalar(1 + (1 - enter) * (i + 1) * 0.27);
    });

    core.current.rotation.y = paused ? 0.25 : t * 0.23;

    particles.current.rotation.y = paused ? 0 : t * 0.017;
    filaments.current.forEach((line, i) => {
      if (line)
        line.material.opacity = paused
          ? 0.45
          : 0.4 + 0.2 * Math.sin(t * 0.75 + i * 2.1);
    });
  });

  const metal = wire ? (
    <meshBasicMaterial color="#bcebd0" wireframe transparent opacity={0.64} />
  ) : (
    <meshStandardMaterial color="#b5bcb3" metalness={0.94} roughness={0.32} />
  );

  return (
    <group ref={root}>
      {geo.rings.map((g, i) => (
        <group key={i} ref={(n) => (rings.current[i] = n)}>
          <mesh geometry={g}>{metal}</mesh>
          {[0, 1, 2].map((j) => (
            <mesh
              key={j}
              position={[
                Math.cos(j * 2.1) * (1.27 + i * 0.2),
                Math.sin(j * 2.1) * (1.27 + i * 0.2) * (0.77 + i * 0.055),
                0,
              ]}
              rotation={[0, 0, j * 2.1]}
            >
              <boxGeometry args={[0.14, 0.13, 0.1]} />
              {wire ? (
                <meshBasicMaterial color="#e6f8eb" wireframe />
              ) : (
                <meshStandardMaterial
                  color="#395344"
                  metalness={0.75}
                  roughness={0.4}
                />
              )}
            </mesh>
          ))}
        </group>
      ))}

      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          geometry={geo.glass}
          position={[Math.sin(i * 2.1) * 0.45, 0, Math.cos(i * 2.1) * 0.35]}
          rotation={[0.12, i * 1.05 + 0.3, 0.2 - i * 0.22]}
        >
          {wire ? (
            <meshBasicMaterial
              color="#78b293"
              wireframe
              transparent
              opacity={0.25}
            />
          ) : (
            <meshPhysicalMaterial
              color="#a4c3ae"
              transmission={0.65}
              thickness={0.12}
              roughness={0.15}
              metalness={0.08}
              ior={1.45}
              transparent
              opacity={0.58}
              side={T.DoubleSide}
            />
          )}
        </mesh>
      ))}

      <group ref={core}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={i}
            geometry={geo.core}
            position={[
              Math.cos((i * Math.PI) / 3) * 0.29,
              Math.sin(i * 2) * 0.13,
              Math.sin((i * Math.PI) / 3) * 0.29,
            ]}
            rotation={[0.15, (i * Math.PI) / 3, 0.18]}
          >
            {wire ? (
              <meshBasicMaterial color="#f2fff4" wireframe />
            ) : (
              <meshStandardMaterial
                color="#b8e8c9"
                emissive="#94bf9f"
                emissiveIntensity={0.7}
                metalness={0.35}
                roughness={0.2}
              />
            )}
          </mesh>
        ))}
      </group>

      {paths.map((g, i) => (
        <lineLoop
          key={i}
          geometry={g}
          ref={(node) => (filaments.current[i] = node)}
        >
          <lineBasicMaterial
            color={wire ? "#dcf9e4" : "#8fb99e"}
            transparent
            opacity={wire ? 0.8 : 0.45}
          />
        </lineLoop>
      ))}

      <instancedMesh
        ref={particles}
        args={[geo.bead, undefined, particleCount]}
      >
        <meshBasicMaterial
          color={wire ? "#d1f5db" : "#a8c8ae"}
          transparent
          opacity={0.72}
        />
      </instancedMesh>
    </group>
  );
}

function SignalRenderer({ paused, intro }) {
  const { gl, scene, camera, size, pointer } = useThree();

  const lastPointer = useRef({ x: -10, y: -10 }),
    trail = useRef([]),
    clock = useRef(0);

  const resources = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;

    const texture = new T.CanvasTexture(canvas);
    texture.minFilter = T.LinearFilter;

    const physical = new T.WebGLRenderTarget(1, 1),
      wire = new T.WebGLRenderTarget(1, 1);

    const uniforms = {
      physical: { value: physical.texture },
      wire: { value: wire.texture },
      mask: { value: texture },
      mobile: { value: 0 },
    };

    const material = new T.ShaderMaterial({
      uniforms,
      vertexShader:
        "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
      fragmentShader:
        "uniform sampler2D physical,wire,mask;uniform float mobile;varying vec2 vUv;void main(){vec3 a=texture2D(physical,vUv).rgb,b=texture2D(wire,vUv).rgb;float m=max(texture2D(mask,vUv).r,mobile);gl_FragColor=vec4(mix(a,b,m*.92),1.);\n#include <colorspace_fragment>\n}",
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });

    const quad = new T.Mesh(new T.PlaneGeometry(2, 2), material),
      composite = new T.Scene();
    composite.add(quad);

    return {
      canvas,
      ctx: canvas.getContext("2d"),
      texture,
      physical,
      wire,
      material,
      composite,
      quad,
      ortho: new T.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    };
  }, []);

  useEffect(() => {
    const w = Math.max(1, Math.round(size.width * gl.getPixelRatio())),
      h = Math.max(1, Math.round(size.height * gl.getPixelRatio()));
    resources.physical.setSize(w, h);
    resources.wire.setSize(w, h);

    const fitDistance = 2.55 / Math.tan((43 * Math.PI) / 360) / Math.min(1, size.width / Math.max(1, size.height));
    camera.position.set(0, 0, Math.max(6.7, fitDistance));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [size, resources, gl, camera]);

  useEffect(() => {
    const pmrem = new T.PMREMGenerator(gl),
      room = new RoomEnvironment(),
      env = pmrem.fromScene(room, 0.04).texture;

    scene.environment = env;
    scene.background = new T.Color("#101713");
    const lost = () => {
      gl.domElement.style.visibility = "hidden";
    };
    gl.domElement.addEventListener("webglcontextlost", lost);

    return () => {
      gl.domElement.removeEventListener("webglcontextlost", lost);
      scene.environment = null;
      env.dispose();
      room.dispose();
      pmrem.dispose();
      resources.physical.dispose();
      resources.wire.dispose();
      resources.texture.dispose();
      resources.material.dispose();
      resources.quad.geometry.dispose();
    };
  }, [gl, scene, resources]);

  useFrame((_, delta) => {
    clock.current += Math.min(delta, 0.05);

    const { ctx, canvas } = resources;

    const px = (pointer.x + 1) * 0.5,
      py = (1 - pointer.y) * 0.5,
      lp = lastPointer.current;

    if (
      !paused &&
      Math.hypot((px - lp.x) * size.width, (py - lp.y) * size.height) >
        SIGNAL_TRAIL.sampleDistance &&
      Math.abs(pointer.x) + Math.abs(pointer.y) > 0.001
    ) {
      trail.current.push({
        x: px,
        y: py,
        radius: SIGNAL_TRAIL.headRadius / Math.max(size.width, size.height),
        alpha: 1,
        seed: clock.current,
      });

      if (trail.current.length > SIGNAL_TRAIL.maxPoints) trail.current.shift();
      lp.x = px;
      lp.y = py;
    }

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, 512, 512);

    if (!paused)
      for (const point of trail.current) {
        point.alpha *= Math.pow(SIGNAL_TRAIL.fade, delta * 60);
        if (point.alpha < 0.015) continue;

        const rx = point.radius * 512,
          ry = (rx * size.width) / Math.max(1, size.height),
          cx = point.x * 512,
          cy = point.y * 512;

        ctx.beginPath();
        for (let i = 0; i <= SIGNAL_TRAIL.blobPoints; i++) {
          const a = (i / SIGNAL_TRAIL.blobPoints) * Math.PI * 2,
            n =
              1 +
              0.18 * Math.sin(a * 3 + point.seed * 2) +
              0.1 * Math.sin(a * 7 - point.seed);
          const x = cx + Math.cos(a) * rx * n,
            y = cy + Math.sin(a) * ry * n;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.closePath();

        const gradient = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          Math.max(rx, ry) * 1.2,
        );
        gradient.addColorStop(0, `rgba(255,255,255,${point.alpha})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fill();
      }

    trail.current = trail.current.filter((p) => p.alpha > 0.015);
    resources.texture.needsUpdate = true;

    resources.material.uniforms.mobile.value =
      !paused && size.width < 600
        ? (Math.sin(clock.current * 0.42) * 0.5 + 0.5) * 0.25
        : 0;

    camera.layers.set(0);
    gl.setRenderTarget(resources.physical);
    gl.render(scene, camera);

    camera.layers.set(1);
    gl.setRenderTarget(resources.wire);
    gl.render(scene, camera);

    camera.layers.set(0);
    gl.setRenderTarget(null);
    gl.render(resources.composite, resources.ortho);
  }, 1);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={3} color="#eef3df" />
      <directionalLight position={[-3, -1, 2]} intensity={2} color="#7eac90" />
      <Sculpture paused={paused} intro={intro} />
      <Sculpture wire paused={paused} intro={intro} />
    </>
  );
}

class SignalBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <SignalPoster /> : this.props.children;
  }
}

export function SignalPoster() {
  return (
    <svg className="hero-core-poster" viewBox="0 0 700 700" aria-hidden="true">
      <defs>
        <linearGradient id="signalMetal">
          <stop stopColor="#dce2d6" />
          <stop offset=".42" stopColor="#4a6c59" />
          <stop offset=".7" stopColor="#d5dfd3" />
          <stop offset="1" stopColor="#6b8976" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#signalMetal)" strokeWidth="7">
        {[0, 1, 2, 3].map((i) => (
          <ellipse
            key={i}
            cx="350"
            cy="350"
            rx={210 + i * 11}
            ry={92 + i * 23}
            transform={`rotate(${i * 47 + 15} 350 350)`}
          />
        ))}
      </g>
      <path
        d="m350 246 61 106-61 104-61-104Z"
        fill="#b5d8bd"
        fillOpacity=".7"
        stroke="#d1f4db"
      />
      <path d="m350 246 0 210m-61-104 122 0" stroke="#f0f8e9" />
    </svg>
  );
}

export default function SignalCore({ paused = false, intro = true, onReady }) {
  return (
    <SignalBoundary>
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ fov: 43, near: 0.1, far: 30, position: [0, 0, 5.9] }}
          gl={{
            alpha: false,
            antialias: true,
            powerPreference: "high-performance",
          }}
          frameloop={paused ? "demand" : "always"}
          onCreated={()=>onReady?.()}
          fallback={<SignalPoster />}
        >
          <SignalRenderer paused={paused} intro={intro} />
        </Canvas>
      </Suspense>
    </SignalBoundary>
  );
}
