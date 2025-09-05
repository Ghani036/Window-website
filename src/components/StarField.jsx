import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";


export default function StarField({ scroll }) {
  const group = useRef();

  // Load star texture
  const starTexture = useMemo(
    () => new THREE.TextureLoader().load("/assets/star.png"),
    []
  );

  // Generate random star positions with movement data
  const stars = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 1500; i++) { // Increased count for better coverage
      const x = (Math.random() - 0.5) * 120; // Larger distribution
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 120;
      const size = 0.1; // Fixed 10px size (0.1 in Three.js units)
      const velocity = {
        x: (Math.random() - 0.5) * 0.01, // Very slow random movement
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      };
      const phase = Math.random() * Math.PI * 2; // Random phase for floating
      temp.push({ x, y, z, size, velocity, phase });
    }
    return temp;
  }, []);


  useFrame((state, delta) => {
    const offset = scroll.offset;
    const time = state.clock.elapsedTime;
    
    if (group.current) {
      // Very slow rotation for subtle movement
      group.current.rotation.y += delta * 0.01;
      group.current.rotation.x += delta * 0.005;

      // Adjust stars distance based on scroll
      const scale = 1 + offset * 0.5; // Reduced scroll effect
      group.current.scale.set(scale, scale, scale);

      // Update individual star positions for random movement
      group.current.children.forEach((star, i) => {
        if (stars[i]) {
          const starData = stars[i];
          
          // Apply velocity-based movement
          star.position.x += starData.velocity.x * delta;
          star.position.y += starData.velocity.y * delta;
          star.position.z += starData.velocity.z * delta;
          
          // Add subtle floating motion
          const floatX = Math.sin(time * 0.1 + starData.phase) * 0.02;
          const floatY = Math.cos(time * 0.08 + starData.phase) * 0.02;
          const floatZ = Math.sin(time * 0.12 + starData.phase) * 0.02;
          
          star.position.x += floatX;
          star.position.y += floatY;
          star.position.z += floatZ;
          
          // Keep stars within bounds (wrap around)
          if (Math.abs(star.position.x) > 60) star.position.x = -star.position.x;
          if (Math.abs(star.position.y) > 60) star.position.y = -star.position.y;
          if (Math.abs(star.position.z) > 60) star.position.z = -star.position.z;
        }
      });
    }
  });

  return (
    <group ref={group}>
      {stars.map((star, i) => (
        <sprite key={i} position={[star.x, star.y, star.z]} scale={[star.size, star.size, 1]}>
          <spriteMaterial
            attach="material"
            map={starTexture}
            transparent
            depthTest={false}
            color='white'
            opacity={0.8}
          />
        </sprite>
      ))}
    </group>
  );
}
