import { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  color: string;
  size: number;
}

// Separate the Star to prevent the whole Canvas from re-rendering
const StarMesh = ({ color, size }: { color: string, size: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Calculate relative scale (limit it so huge stars don't break the screen)
  const scale = useMemo(() => Math.min(Math.max(size / 2, 1.2), 2.5), [size]);

  useFrame((state) => {
    meshRef.current.rotation.y += state.clock.getDelta() * 0.15;
  });

  return (
    <group scale={[scale, scale, scale]}>
      {/* The Core Body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1.5} // Makes the color "glow"
          roughness={0.2}
        />
      </mesh>

      {/* Atmospheric Glow Layer */}
      <Sphere args={[1.05, 32, 32]}>
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
};

// Use memo to prevent lagginess when the parent modal updates
export const CelestialViewer = memo(({ color, size }: Props) => {
  return (
    <div className="w-full h-full min-h-[400px] bg-black">
      <Canvas 
        shadows={false} // Disable shadows for performance
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{ antialias: true, powerPreference: "high-performance" }} // Boost performance
      >
        <color attach="background" args={['#030408']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color={color} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <StarMesh color={color} size={size} />
        </Float>

        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.8} 
        />
      </Canvas>
    </div>
  );
});