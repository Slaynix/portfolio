import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const NEON = new THREE.Color("#7ee8f7");
const VIOLET = new THREE.Color("#a97bff");
const MINT = new THREE.Color("#7cf6bd");

function useSoftSprite() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.25, "rgba(255,255,255,0.75)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

/** Deep field of tiny stars wrapped around the camera, with a slow twinkle. */
function Starfield({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const sprite = useSoftSprite();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i += 1) {
      const radius = 14 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const tint = Math.random();
      color
        .copy(tint > 0.86 ? NEON : tint > 0.72 ? VIOLET : new THREE.Color("#ffffff"))
        .multiplyScalar(0.55 + Math.random() * 0.45);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.012;
    if (material.current) material.current.opacity = 0.62 + Math.sin(t * 0.9) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        map={sprite}
        size={0.09}
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Tilted spiral galaxy disc built from colour-graded points. */
function Galaxy({
  count,
  arms = 3,
  radiusMax = 9,
  size = 0.12,
  spin = 0.055,
  opacity = 0.85,
  position = [1.4, -1.1, -6],
  rotation = [Math.PI * 0.36, 0, Math.PI * 0.06],
  core = MINT,
}: {
  count: number;
  arms?: number;
  radiusMax?: number;
  size?: number;
  spin?: number;
  opacity?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  core?: THREE.Color;
}) {
  const ref = useRef<THREE.Points>(null);
  const sprite = useSoftSprite();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i += 1) {
      const radius = Math.pow(Math.random(), 0.62) * radiusMax;
      const arm = (i % arms) / arms;
      const twist = radius * 0.52;
      const angle = arm * Math.PI * 2 + twist + (Math.random() - 0.5) * 0.5;
      const spread = Math.pow(Math.random(), 2.4) * (0.35 + radius * 0.09);
      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 1.1;
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread * 2;

      const inner = radius / radiusMax;
      color.copy(NEON).lerp(VIOLET, Math.min(1, inner * 1.5));
      if (inner > 0.72) color.lerp(core, ((inner - 0.72) / 0.28) * 0.55);
      color.multiplyScalar(1 - inner * 0.35);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [count, arms, radiusMax, core]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * spin;
  });

  return (
    <points ref={ref} rotation={rotation} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Soft additive nebula clouds behind the galaxy. */
function Nebula() {
  const sprite = useSoftSprite();
  const clouds = useMemo(
    () => [
      { position: [-6, 2.4, -9] as const, scale: 11, color: "#4de2ff", opacity: 0.16 },
      { position: [5.5, -2.6, -11] as const, scale: 13, color: "#a97bff", opacity: 0.15 },
      { position: [0.5, 4.2, -13] as const, scale: 10, color: "#7cf6bd", opacity: 0.09 },
    ],
    [],
  );
  return (
    <group>
      {clouds.map((cloud, index) => (
        <sprite key={index} position={cloud.position} scale={cloud.scale}>
          <spriteMaterial
            map={sprite}
            color={cloud.color}
            transparent
            opacity={cloud.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

/** Occasional shooting star streaking across the field. */
function ShootingStar({ seed }: { seed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const state = useRef({ next: seed, active: false, progress: 0, from: new THREE.Vector3(), to: new THREE.Vector3() });

  useFrame((frame, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const s = state.current;
    const t = frame.clock.getElapsedTime();
    if (!s.active) {
      mesh.visible = false;
      if (t > s.next) {
        s.active = true;
        s.progress = 0;
        s.from.set(-9 - Math.random() * 4, 3 + Math.random() * 3, -3 - Math.random() * 4);
        s.to.set(7 + Math.random() * 4, -1 - Math.random() * 3, -2 - Math.random() * 3);
      }
      return;
    }
    s.progress += delta * 0.9;
    if (s.progress >= 1) {
      s.active = false;
      s.next = t + 4 + Math.random() * 9;
      mesh.visible = false;
      return;
    }
    mesh.visible = true;
    mesh.position.lerpVectors(s.from, s.to, s.progress);
    mesh.lookAt(s.to);
    const fade = Math.sin(s.progress * Math.PI);
    const material = mesh.material as THREE.MeshBasicMaterial;
    material.opacity = fade * 0.8;
    mesh.scale.set(1, 1, 1 + fade * 2.2);
  });

  return (
    <mesh ref={ref} visible={false}>
      <capsuleGeometry args={[0.012, 0.9, 2, 6]} />
      <meshBasicMaterial
        color="#e8fbff"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** Wireframe icosahedron that reacts to pointer and scroll. */
function FloatingShape() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.16;
    ref.current.rotation.y = t * 0.22;
    ref.current.position.y = 0.2 + Math.sin(t * 0.6) * 0.28;
  });
  return (
    <mesh ref={ref} position={[2.9, 0.2, -1.2]}>
      <icosahedronGeometry args={[1.3, 1]} />
      <meshStandardMaterial
        color="#a97bff"
        wireframe
        transparent
        opacity={0.32}
        emissive="#4de2ff"
        emissiveIntensity={0.45}
      />
    </mesh>
  );
}

/** Drives camera parallax from pointer position and page scroll. */
function CameraRig() {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useFrame((_, delta) => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    scroll.current = window.scrollY / max;
    const targetX = pointer.current.x * 1.1;
    const targetY = -pointer.current.y * 0.7 + scroll.current * 2.6;
    const ease = Math.min(1, delta * 2.2);
    camera.position.x += (targetX - camera.position.x) * ease;
    camera.position.y += (targetY - camera.position.y) * ease;
    camera.position.z += (6.2 - scroll.current * 3.4 - camera.position.z) * ease;
    camera.lookAt(0, scroll.current * 1.1, -2);
  });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}

export default function ParticleScene({ count = 1600 }: { count?: number }) {
  const galaxyCount = Math.round(count * 0.75);
  const farGalaxyCount = Math.round(count * 0.3);
  const dustCount = Math.round(count * 0.5);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 6.2], fov: 62 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      frameloop={visible ? "always" : "never"}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 4, 6]} intensity={1.2} color="#4de2ff" />
      <CameraRig />
      <Nebula />
      <Starfield count={count} />
      <Starfield count={dustCount} />
      <Galaxy count={galaxyCount} />
      <Galaxy
        count={farGalaxyCount}
        arms={2}
        radiusMax={6}
        size={0.085}
        spin={-0.035}
        opacity={0.6}
        position={[-7.5, 3.4, -13]}
        rotation={[Math.PI * 0.2, 0, -Math.PI * 0.22]}
        core={VIOLET}
      />
      <ShootingStar seed={3} />
      <ShootingStar seed={9} />
      <ShootingStar seed={16} />
      <FloatingShape />
    </Canvas>
  );
}
