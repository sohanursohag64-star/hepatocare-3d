"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createLiverGeometry, createVesselGeometry, surfacePoint, svgToModel } from "./liverGeometry";

export type Hotspot = {
  id: string;
  /** Anchor in model space. */
  anchor: THREE.Vector3;
  /** Minimum view-space depth (relative to model centre) at which the hotspot is shown. */
  minDepth: number;
};

export function createHotspots(): Hotspot[] {
  const gb = svgToModel(296, 372);
  return [
    {
      id: "right-lobe",
      anchor: surfacePoint(200, 250, "front"),
      minDepth: 0.15,
    },
    {
      id: "left-lobe",
      anchor: surfacePoint(480, 185, "front"),
      minDepth: 0.05,
    },
    {
      id: "gallbladder",
      anchor: new THREE.Vector3(gb.x, gb.y, 0.18),
      minDepth: -0.1,
    },
  ];
}

/** Shared, mutable interaction state written by DOM handlers and read each frame. */
export type InteractionState = {
  /** User-applied yaw / pitch offsets (radians). */
  yaw: number;
  pitch: number;
  /** Angular velocity carried after a drag (radians / frame at 60 fps). */
  velocity: number;
  dragging: boolean;
};

type SceneProps = {
  interaction: RefObject<InteractionState>;
  hotspotEls: RefObject<(HTMLElement | null)[]>;
  active: boolean;
  onReady: () => void;
};

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function LiverModel({ interaction, hotspotEls, onReady }: Omit<SceneProps, "active">) {
  const hotspots = useMemo(createHotspots, []);
  const group = useRef<THREE.Group>(null);
  const readySent = useRef(false);
  const { camera, size } = useThree();

  const geometries = useMemo(() => {
    const liver = createLiverGeometry();
    const gallbladder = new THREE.CapsuleGeometry(0.15, 0.38, 8, 24);
    const ivc = new THREE.CylinderGeometry(0.14, 0.14, 0.7, 32, 1, true);
    const portal = createVesselGeometry(
      [[352, 296, -0.18], [354, 340, -0.2], [352, 385, -0.16], [360, 432, -0.12]],
      0.075,
    );
    const artery = createVesselGeometry(
      [[382, 292, -0.04], [388, 340, 0.0], [398, 388, 0.02], [410, 432, 0.02]],
      0.036,
    );
    const bileDuct = createVesselGeometry(
      [[330, 316, 0.02], [327, 360, 0.08], [324, 400, 0.08], [326, 434, 0.06]],
      0.032,
    );
    return { liver, gallbladder, ivc, portal, artery, bileDuct };
  }, []);

  const materials = useMemo(
    () => ({
      liver: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.42,
        metalness: 0,
        clearcoat: 0.55,
        clearcoatRoughness: 0.32,
        sheen: 0.3,
        sheenColor: new THREE.Color("#ff9e8a"),
        sheenRoughness: 0.55,
      }),
      gallbladder: new THREE.MeshPhysicalMaterial({
        color: "#5e9a48",
        roughness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        transmission: 0.08,
        thickness: 0.4,
      }),
      vein: new THREE.MeshPhysicalMaterial({ color: "#3b4fa8", roughness: 0.35, clearcoat: 0.6 }),
      portal: new THREE.MeshPhysicalMaterial({ color: "#5a47a8", roughness: 0.35, clearcoat: 0.6 }),
      artery: new THREE.MeshPhysicalMaterial({ color: "#c8242a", roughness: 0.3, clearcoat: 0.7 }),
      bile: new THREE.MeshPhysicalMaterial({ color: "#4f8f3f", roughness: 0.35, clearcoat: 0.6 }),
      ligament: new THREE.MeshStandardMaterial({ color: "#e9b3a5", roughness: 0.6, transparent: true, opacity: 0.85 }),
    }),
    [],
  );

  // Falciform ligament: a thin ridge following the anterior surface between the lobes.
  const ligament = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const sx = 400 - 30 * t;
      const sy = 114 + 175 * t;
      const p = surfacePoint(sx, sy, "front");
      p.z += 0.012;
      pts.push(p);
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.012, 8, false);
  }, []);

  useEffect(
    () => () => {
      Object.values(geometries).forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());
      ligament.dispose();
    },
    [geometries, materials, ligament],
  );

  const gb = svgToModel(296, 362);
  const ivcPos = svgToModel(316, 72);

  const projected = useMemo(() => new THREE.Vector3(), []);
  const world = useMemo(() => new THREE.Vector3(), []);
  const centre = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const g = group.current;
    const s = interaction.current;
    if (!g || !s) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 1 / 20) * 60;

    if (!s.dragging) {
      s.yaw += s.velocity * dt;
      s.velocity *= Math.pow(0.92, dt);
      // Ease pitch back to neutral.
      s.pitch *= Math.pow(0.96, dt);
    }

    // Gentle idle sway plus the user's rotation.
    const idleYaw = Math.sin(t * 0.35) * 0.45;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, idleYaw + s.yaw, 6, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.12 + Math.sin(t * 0.5) * 0.04 + s.pitch, 6, delta);
    g.position.y = Math.sin(t * 0.9) * 0.08;
    g.updateMatrixWorld();

    // Project hotspot anchors into CSS pixels.
    const els = hotspotEls.current;
    if (els) {
      centre.setFromMatrixPosition(g.matrixWorld);
      hotspots.forEach((h, i) => {
        const el = els[i];
        if (!el) return;
        world.copy(h.anchor).applyMatrix4(g.matrixWorld);
        const depth = world.z - centre.z;
        projected.copy(world).project(camera);
        const x = (projected.x * 0.5 + 0.5) * size.width;
        const y = (-projected.y * 0.5 + 0.5) * size.height;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        const visible = depth > h.minDepth;
        el.dataset.visible = visible ? "true" : "false";
      });
    }

    if (!readySent.current) {
      readySent.current = true;
      onReady();
    }
  });

  return (
    <group ref={group} scale={0.92}>
      <mesh geometry={geometries.liver} material={materials.liver} castShadow receiveShadow />
      <mesh geometry={ligament} material={materials.ligament} />
      <mesh
        geometry={geometries.gallbladder}
        material={materials.gallbladder}
        position={[gb.x, gb.y, 0.05]}
        rotation={[0.35, 0, -0.35]}
      />
      <mesh geometry={geometries.ivc} material={materials.vein} position={[ivcPos.x, ivcPos.y, -0.3]} />
      <mesh geometry={geometries.portal} material={materials.portal} />
      <mesh geometry={geometries.artery} material={materials.artery} />
      <mesh geometry={geometries.bileDuct} material={materials.bile} />
    </group>
  );
}

export default function LiverScene({ interaction, hotspotEls, active, onReady }: SceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7.4], fov: 32, near: 3, far: 14 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <Environment />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#fff4ee" />
      <directionalLight position={[-4.5, 1.5, -3]} intensity={3} color="#2fbaad" />
      <directionalLight position={[0, -4, 2]} intensity={0.5} color="#9de8df" />
      <LiverModel interaction={interaction} hotspotEls={hotspotEls} onReady={onReady} />
    </Canvas>
  );
}
