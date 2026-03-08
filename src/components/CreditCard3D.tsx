import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Text, Float } from "@react-three/drei";
import { useRef, Suspense, forwardRef } from "react";
import * as THREE from "three";

const Card = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3 + 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 - 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <RoundedBox args={[3.4, 2.1, 0.08]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial
            color="#2563eb"
            metalness={0.6}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1.5}
          />
        </RoundedBox>
        {/* Card chip */}
        <mesh position={[-0.9, 0.2, 0.05]}>
          <RoundedBox args={[0.45, 0.35, 0.02]} radius={0.04} smoothness={2}>
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
          </RoundedBox>
        </mesh>
        {/* Card number dots */}
        {[0, 1, 2, 3].map((group) =>
          [0, 1, 2, 3].map((dot) => (
            <mesh
              key={`${group}-${dot}`}
              position={[-1.1 + group * 0.75 + dot * 0.12, -0.25, 0.05]}
            >
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="hsl(0, 0%, 100%)" opacity={0.7} transparent />
            </mesh>
          ))
        )}
        {/* Brand text */}
        <Text
          position={[0.9, 0.65, 0.05]}
          fontSize={0.2}
          color="hsl(0, 0%, 100%)"
          anchorX="right"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZOIHQ.woff2"
        >
          APNINIVESH
        </Text>
        {/* Card holder */}
        <Text
          position={[-1.1, -0.65, 0.05]}
          fontSize={0.12}
          color="hsl(0, 0%, 100%)"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.1}
          font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
        >
          CARDHOLDER NAME
        </Text>
      </mesh>
    </Float>
  );
};

const CreditCard3D = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="w-full h-[350px] md:h-[450px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -2, 3]} intensity={0.3} color="hsl(252, 78%, 60%)" />
          <pointLight position={[0, 3, 4]} intensity={0.5} color="hsl(221, 83%, 53%)" />
          <Card />
        </Suspense>
      </Canvas>
    </div>
  );
});

CreditCard3D.displayName = "CreditCard3D";

export default CreditCard3D;
