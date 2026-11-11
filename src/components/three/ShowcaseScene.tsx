"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { addConditionMorphs, createLiverGeometry, createVesselGeometry, svgToModel } from "./liverGeometry";

/**
 * "Liver in caring hands" showcase: the liver floats inside a glass dome on a
 * teal pedestal, cradled by two stylised hands above a glowing floor ring.
 * The visual condition of the liver is driven by `stage` (see STAGES).
 */

type StageLook = {
  fatty: number;
  nodular: number;
  scale: number;
  tint: string;
  emissive: string;
  emissiveIntensity: number;
  pulse: number;
  roughness: number;
  ring: string;
};

/** Visual target per story step (0 healthy · 1 fatty · 2 hepatitis · 3 cirrhosis · 4 care). */
export const STAGES: StageLook[] = [
  { fatty: 0, nodular: 0, scale: 1, tint: "#ffffff", emissive: "#000000", emissiveIntensity: 0, pulse: 0, roughness: 0.42, ring: "#3d7bff" },
  { fatty: 1, nodular: 0, scale: 1.04, tint: "#ffe2a8", emissive: "#a8742a", emissiveIntensity: 0.12, pulse: 0, roughness: 0.55, ring: "#f2b54a" },
  { fatty: 0.35, nodular: 0, scale: 1.02, tint: "#ffc2b8", emissive: "#ff3b2f", emissiveIntensity: 0.18, pulse: 1, roughness: 0.4, ring: "#ff5a4f" },
  { fatty: 0, nodular: 1, scale: 0.96, tint: "#c99a78", emissive: "#000000", emissiveIntensity: 0, pulse: 0, roughness: 0.62, ring: "#c27c4a" },
  { fatty: 0, nodular: 0, scale: 1, tint: "#ffffff", emissive: "#2fbaad", emissiveIntensity: 0.04, pulse: 0, roughness: 0.4, ring: "#2fbaad" },
];

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.5;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/** Fresnel rim shader for the glass dome edges. */
function createRimMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color("#cfefff") }, uStrength: { value: 0.65 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uStrength;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 3.0);
        gl_FragColor = vec4(uColor, f * uStrength);
      }`,
  });
}

/** Soft glowing floor ring. */
function createRingMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color("#3d7bff") }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uTime; varying vec2 vUv;
      void main() {
        float r = length(vUv - 0.5) * 2.0;           // 0 centre … 1 edge
        float band = exp(-pow((r - 0.78) / 0.035, 2.0)); // bright thin ring
        float halo = exp(-pow((r - 0.78) / 0.16, 2.0)) * 0.35;
        float inner = smoothstep(0.8, 0.0, r) * 0.12;  // faint pool of light
        float wave = 0.5 + 0.5 * sin(uTime * 1.6 - r * 9.0);
        float a = band * (0.75 + 0.25 * wave) + halo + inner;
        gl_FragColor = vec4(uColor * (1.0 + band), a);
      }`,
  });
}

/**
 * Stylised, softly sculpted hand cradling the pedestal from below: the palm
 * supports the base and the fingers curl up over its front rim.
 */
function Hand({ side, material }: { side: 1 | -1; material: THREE.Material }) {
  const parts = useMemo(() => {
    const palm = new THREE.SphereGeometry(1, 40, 24);
    const phalanx = new THREE.CapsuleGeometry(0.095, 0.26, 8, 16);
    const tip = new THREE.CapsuleGeometry(0.088, 0.2, 8, 16);
    const arm = new THREE.CapsuleGeometry(0.27, 0.6, 8, 20);
    return { palm, phalanx, tip, arm };
  }, []);
  useEffect(() => () => Object.values(parts).forEach((g) => g.dispose()), [parts]);

  const fingers = [-0.27, -0.09, 0.09, 0.27];
  return (
    <group position={[side * 0.62, -1.13, 0.5]} rotation={[0, side * -0.18, 0]}>
      {/* palm, just under the pedestal */}
      <mesh geometry={parts.palm} material={material} scale={[0.5, 0.17, 0.6]} />
      {fingers.map((x, i) => {
        const len = i === 0 || i === 3 ? 0.88 : 1;
        return (
          // knuckle at the front edge of the palm
          <group key={i} position={[x, 0.02, 0.5]} rotation={[-0.35, 0, 0]}>
            {/* first segment: forward */}
            <mesh geometry={parts.phalanx} material={material} position={[0, 0, 0.13 * len]} rotation={[Math.PI / 2, 0, 0]} scale={[1, len, 1]} />
            {/* second segment: curling up over the rim */}
            <group position={[0, 0, 0.27 * len]} rotation={[-1.25, 0, 0]}>
              <mesh geometry={parts.tip} material={material} position={[0, 0, 0.11 * len]} rotation={[Math.PI / 2, 0, 0]} scale={[1, len, 1]} />
            </group>
          </group>
        );
      })}
      {/* thumb along the side of the base */}
      <group position={[side * 0.42, 0.04, 0.32]} rotation={[-0.6, side * 0.5, side * -0.5]}>
        <mesh geometry={parts.phalanx} material={material} position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]} scale={[1.15, 1.1, 1.15]} />
      </group>
      {/* forearm, sweeping out and down to the side */}
      <mesh geometry={parts.arm} material={material} position={[side * 0.42, -0.42, -0.12]} rotation={[0.35, 0, side * 0.45]} />
    </group>
  );
}

/** Keep the whole composition in frame for any canvas aspect ratio. */
function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const vfov = THREE.MathUtils.degToRad(cam.fov);
    const aspect = size.width / Math.max(1, size.height);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    const sceneWidth = 4.9;
    const sceneHeight = 4.9;
    const dist = Math.max(sceneWidth / 2 / Math.tan(hfov / 2), sceneHeight / 2 / Math.tan(vfov / 2));
    cam.position.set(0, dist * 0.1, dist);
    cam.far = dist + 10;
    cam.near = Math.max(0.5, dist - 6);
    cam.lookAt(0, -0.15, 0);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Showcase({ stage }: { stage: RefObject<number> }) {
  const root = useRef<THREE.Group>(null);
  const liverGroup = useRef<THREE.Group>(null);
  const liverMesh = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const glowLight = useRef<THREE.PointLight>(null);

  const geo = useMemo(() => {
    const liver = addConditionMorphs(createLiverGeometry(200, 90));
    // Dome: open cylinder wall with a hemispherical cap (lathe profile).
    const R = 1.32;
    const profile: THREE.Vector2[] = [];
    profile.push(new THREE.Vector2(R, -0.72));
    profile.push(new THREE.Vector2(R, 0.45));
    for (let i = 1; i <= 24; i++) {
      const a = (i / 24) * (Math.PI / 2);
      profile.push(new THREE.Vector2(Math.cos(a) * R, 0.45 + Math.sin(a) * R));
    }
    profile[profile.length - 1].x = 0.0001;
    const dome = new THREE.LatheGeometry(profile, 96);
    const base = new THREE.CylinderGeometry(1.5, 1.42, 0.24, 96);
    const baseRim = new THREE.TorusGeometry(1.46, 0.07, 16, 96);
    const ring = new THREE.PlaneGeometry(5.2, 5.2);
    const shadow = new THREE.CircleGeometry(1.9, 64);
    const portal = createVesselGeometry([[352, 300, -0.18], [354, 345, -0.2], [352, 380, -0.16]], 0.07);
    const artery = createVesselGeometry([[382, 294, -0.04], [388, 340, 0.0], [396, 378, 0.02]], 0.034);
    const bile = createVesselGeometry([[330, 318, 0.02], [327, 355, 0.08], [325, 382, 0.08]], 0.03);
    const gallbladder = new THREE.CapsuleGeometry(0.15, 0.36, 8, 24);
    return { liver, dome, base, baseRim, ring, shadow, portal, artery, bile, gallbladder };
  }, []);

  const mat = useMemo(
    () => ({
      liver: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.42,
        clearcoat: 0.55,
        clearcoatRoughness: 0.3,
        sheen: 0.3,
        sheenColor: new THREE.Color("#ff9e8a"),
        sheenRoughness: 0.55,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#dff6ff",
        transparent: true,
        opacity: 0.05,
        roughness: 0.03,
        metalness: 0,
        clearcoat: 0.4,
        envMapIntensity: 1,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      rim: createRimMaterial(),
      base: new THREE.MeshPhysicalMaterial({ color: "#2fbaad", roughness: 0.25, clearcoat: 0.8, emissive: "#0c8079", emissiveIntensity: 0.25 }),
      baseRim: new THREE.MeshPhysicalMaterial({ color: "#63d4c8", roughness: 0.2, clearcoat: 1, emissive: "#149e93", emissiveIntensity: 0.35 }),
      skin: new THREE.MeshPhysicalMaterial({ color: "#e3ad88", roughness: 0.58, sheen: 0.6, sheenColor: new THREE.Color("#ffd2bb"), clearcoat: 0.15 }),
      ring: createRingMaterial(),
      shadow: new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.35, depthWrite: false }),
      portal: new THREE.MeshPhysicalMaterial({ color: "#5a47a8", roughness: 0.35, clearcoat: 0.6 }),
      artery: new THREE.MeshPhysicalMaterial({ color: "#c8242a", roughness: 0.3, clearcoat: 0.7 }),
      bile: new THREE.MeshPhysicalMaterial({ color: "#4f8f3f", roughness: 0.35, clearcoat: 0.6 }),
      gallbladder: new THREE.MeshPhysicalMaterial({ color: "#5e9a48", roughness: 0.3, clearcoat: 0.8 }),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mat).forEach((m) => m.dispose());
    },
    [geo, mat],
  );

  // Smoothly blended current look.
  const look = useRef({
    fatty: 0,
    nodular: 0,
    scale: 1,
    tint: new THREE.Color("#ffffff"),
    emissive: new THREE.Color("#000000"),
    emissiveIntensity: 0,
    pulse: 0,
    roughness: 0.42,
    ring: new THREE.Color("#3d7bff"),
  });
  const tmp = useMemo(() => new THREE.Color(), []);
  const gb = svgToModel(296, 362);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const target = STAGES[Math.max(0, Math.min(STAGES.length - 1, stage.current ?? 0))];
    const L = look.current;
    const k = 1 - Math.exp(-delta * 3.2);

    L.fatty += (target.fatty - L.fatty) * k;
    L.nodular += (target.nodular - L.nodular) * k;
    L.scale += (target.scale - L.scale) * k;
    L.emissiveIntensity += (target.emissiveIntensity - L.emissiveIntensity) * k;
    L.pulse += (target.pulse - L.pulse) * k;
    L.roughness += (target.roughness - L.roughness) * k;
    L.tint.lerp(tmp.set(target.tint), k);
    L.emissive.lerp(tmp.set(target.emissive), k);
    L.ring.lerp(tmp.set(target.ring), k);

    const mesh = liverMesh.current;
    if (mesh?.morphTargetInfluences) {
      mesh.morphTargetInfluences[0] = L.fatty;
      mesh.morphTargetInfluences[1] = L.nodular;
    }
    mat.liver.color.copy(L.tint);
    mat.liver.emissive.copy(L.emissive);
    mat.liver.emissiveIntensity = L.emissiveIntensity * (1 + L.pulse * 0.8 * Math.sin(t * 3));
    mat.liver.roughness = L.roughness;

    const ringMat = mat.ring as THREE.ShaderMaterial;
    ringMat.uniforms.uTime.value = t;
    (ringMat.uniforms.uColor.value as THREE.Color).copy(L.ring);
    if (glowLight.current) glowLight.current.color.copy(L.ring);

    const lg = liverGroup.current;
    if (lg) {
      lg.rotation.y = Math.sin(t * 0.4) * 0.55;
      lg.rotation.x = 0.08 + Math.sin(t * 0.3) * 0.05;
      lg.position.y = 0.42 + Math.sin(t * 1.1) * 0.06;
      lg.scale.setScalar(0.6 * L.scale);
    }
    if (root.current) {
      root.current.position.y = Math.sin(t * 0.7) * 0.05;
      root.current.rotation.y = Math.sin(t * 0.25) * 0.12;
    }
    if (ringRef.current) ringRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.015);
  });

  return (
    <>
      <group ref={root}>
        {/* Liver + attached structures, floating inside the dome */}
        <group ref={liverGroup} position={[0, 0.42, 0]}>
          <mesh ref={liverMesh} geometry={geo.liver} material={mat.liver} morphTargetInfluences={[0, 0]} />
          <mesh geometry={geo.gallbladder} material={mat.gallbladder} position={[gb.x, gb.y, 0.05]} rotation={[0.35, 0, -0.35]} />
          <mesh geometry={geo.portal} material={mat.portal} />
          <mesh geometry={geo.artery} material={mat.artery} />
          <mesh geometry={geo.bile} material={mat.bile} />
        </group>
        <pointLight ref={glowLight} position={[0, -0.45, 0.6]} intensity={2.5} distance={2.6} color="#3d7bff" />

        {/* Pedestal */}
        <mesh geometry={geo.base} material={mat.base} position={[0, -0.84, 0]} />
        <mesh geometry={geo.baseRim} material={mat.baseRim} position={[0, -0.72, 0]} rotation={[Math.PI / 2, 0, 0]} />

        {/* Glass dome (glass body + fresnel rim) */}
        <mesh geometry={geo.dome} material={mat.glass} renderOrder={2} />
        <mesh geometry={geo.dome} material={mat.rim} renderOrder={3} />

        {/* Caring hands */}
        <Hand side={-1} material={mat.skin} />
        <Hand side={1} material={mat.skin} />
      </group>

      {/* Floor */}
      <mesh geometry={geo.shadow} material={mat.shadow} position={[0, -2.08, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh ref={ringRef} geometry={geo.ring} material={mat.ring} position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]} />
    </>
  );
}

export default function ShowcaseScene({ stage, active, onReady }: { stage: RefObject<number>; active: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.9, 9.2], fov: 30, near: 3, far: 20 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onReady)}
      aria-hidden
    >
      <Environment />
      <CameraRig />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 5]} intensity={2.2} color="#fff4ee" />
      <directionalLight position={[-5, 2, -3]} intensity={2.6} color="#2fbaad" />
      <directionalLight position={[4, -1, -4]} intensity={1.4} color="#5b7cff" />
      <Showcase stage={stage} />
    </Canvas>
  );
}
