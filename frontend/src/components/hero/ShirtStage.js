import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Center,
  OrbitControls,
  RoundedBox,
  Sparkles,
  useGLTF,
} from "@react-three/drei";

export function ShirtModel({ url, scale }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} scale={scale} />
    </Center>
  );
}

// Stylized tee built from primitives — stands in until a real .glb is dropped
// into public/models and passed via modelUrl.
export function PlaceholderShirt() {
  const fabric = { color: "#F2F2EF", roughness: 0.85, metalness: 0 };
  return (
    <group rotation={[0, -0.35, 0]}>
      {/* torso */}
      <RoundedBox args={[1.6, 2, 0.5]} radius={0.12} smoothness={4}>
        <meshStandardMaterial {...fabric} />
      </RoundedBox>
      {/* sleeves */}
      <RoundedBox
        args={[0.55, 0.95, 0.44]}
        radius={0.1}
        smoothness={4}
        position={[-1.02, 0.58, 0]}
        rotation={[0, 0, 0.55]}
      >
        <meshStandardMaterial {...fabric} />
      </RoundedBox>
      <RoundedBox
        args={[0.55, 0.95, 0.44]}
        radius={0.1}
        smoothness={4}
        position={[1.02, 0.58, 0]}
        rotation={[0, 0, -0.55]}
      >
        <meshStandardMaterial {...fabric} />
      </RoundedBox>
      {/* collar */}
      <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.07, 16, 40]} />
        <meshStandardMaterial color="#E9E8E3" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

// Mounts only after Suspense resolves — signals the wrapper to crossfade.
function Ready({ onReady }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export default function ShirtStage({
  modelUrl,
  modelScale = 1,
  onReady,
  frameloop = "always",
}) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.1, 5.2], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
    >
      {/* Moody single-spot rig: warm key from high front-right, faint cool
          fill so the garment stays readable (this still has to sell tees),
          fog pulling edges into the dark. */}
      <fog attach="fog" args={["#0A0A0A", 6.5, 13]} />
      <ambientLight intensity={0.18} />
      <spotLight
        position={[2.5, 5.5, 3.5]}
        angle={0.4}
        penumbra={1}
        decay={0.9}
        intensity={26}
        color="#FFF3E4"
      />
      <directionalLight position={[-4, 0.5, 2]} intensity={0.18} color="#BFD4E6" />

      {/* Smoke motes drifting behind the model */}
      <Sparkles
        count={36}
        scale={[6, 4, 2]}
        position={[0, 0, -1.6]}
        size={5}
        speed={0.25}
        opacity={0.14}
        color="#D8D4CC"
      />

      <Suspense fallback={null}>
        {modelUrl ? (
          <ShirtModel url={modelUrl} scale={modelScale} />
        ) : (
          <PlaceholderShirt />
        )}
        <Ready onReady={onReady} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.9}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
