import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { ShirtModel, PlaceholderShirt } from "../hero/ShirtStage";

// Smoothstep between stage stops so each stage "settles" rather than
// moving linearly through its keyframe.
const smooth = (t) => t * t * (3 - 2 * t);

function CameraRig({ progressRef, stages }) {
  const { camera } = useThree();
  const v = useRef({
    desiredPos: new THREE.Vector3(),
    desiredTgt: new THREE.Vector3(),
    currentTgt: new THREE.Vector3(...stages[0].target),
    a: new THREE.Vector3(),
    b: new THREE.Vector3(),
  }).current;

  useFrame(() => {
    const p = progressRef.current;

    let i = 0;
    while (i < stages.length - 2 && p > stages[i + 1].progress) i++;
    const from = stages[i];
    const to = stages[i + 1];
    const span = to.progress - from.progress || 1;
    const t = smooth(THREE.MathUtils.clamp((p - from.progress) / span, 0, 1));

    v.a.fromArray(from.cameraPosition);
    v.b.fromArray(to.cameraPosition);
    v.desiredPos.lerpVectors(v.a, v.b, t);

    v.a.fromArray(from.target);
    v.b.fromArray(to.target);
    v.desiredTgt.lerpVectors(v.a, v.b, t);

    // Frame-level damping hides scrub steps from coarse scroll wheels.
    camera.position.lerp(v.desiredPos, 0.12);
    v.currentTgt.lerp(v.desiredTgt, 0.12);
    camera.lookAt(v.currentTgt);
  });

  return null;
}

export default function ShirtScrollCanvas({
  progressRef,
  stages,
  modelUrl,
  modelScale = 1,
  frameloop = "always",
}) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      camera={{ position: stages[0].cameraPosition, fov: 32 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 6]} intensity={1.1} />
      <directionalLight position={[-5, 2, 4]} intensity={0.45} />
      <directionalLight position={[0, 3, -6]} intensity={0.6} />

      <Suspense fallback={null}>
        {modelUrl ? (
          <ShirtModel url={modelUrl} scale={modelScale} />
        ) : (
          <PlaceholderShirt />
        )}
        <Environment preset="studio" />
      </Suspense>

      <CameraRig progressRef={progressRef} stages={stages} />
    </Canvas>
  );
}
