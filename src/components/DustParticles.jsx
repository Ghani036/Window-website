import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DustParticles({ 
  scroll, 
  section = "first", 
  showContent = false, 
  visibleSubs = 0 
}) {
  const groupRef = useRef();
  const pointsRef = useRef();

  // Generate dust particle positions and properties
  const { positions, sizes, movementData } = useMemo(() => {
    const count = 800; // Optimized dust particles
    const pos = new Float32Array(count * 3);
    const sizeArr = new Float32Array(count);
    const moveData = new Float32Array(count * 6); // basePos(3) + velocity(3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i6 = i * 6;
      
      // Random positions in a much larger sphere
      const radius = Math.random() * 50 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      // Store base position
      moveData[i6] = pos[i3];
      moveData[i6 + 1] = pos[i3 + 1];
      moveData[i6 + 2] = pos[i3 + 2];

      // Very slow, gentle velocities for dust-like movement
      moveData[i6 + 3] = (Math.random() - 0.5) * 0.005; // vx
      moveData[i6 + 4] = (Math.random() - 0.5) * 0.005; // vy
      moveData[i6 + 5] = (Math.random() - 0.5) * 0.005; // vz

      // Larger dust particle sizes
      sizeArr[i] = Math.random() * 0.015 + 0.008;
    }
    return { positions: pos, sizes: sizeArr, movementData: moveData };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position.array;
    const sizeArr = pointsRef.current.geometry.attributes.size?.array;
    const scrollProgress = scroll?.offset ?? 0;

    let visibility = 1;
    let scrollEffect = 0;

    if (section === "first") {
      // fade out & push away
      visibility = Math.max(0, 1 - scrollProgress * 1.2);
      scrollEffect = scrollProgress * 0.3;
    } else {
      // fade in & pull inward
      if (showContent || visibleSubs >= 9) {
        visibility = Math.min(1, (scrollProgress - 0.2) * 1.5);
      } else {
        visibility = 0;
      }
      scrollEffect = -scrollProgress * 0.2;
    }

    for (let i = 0; i < 800; i++) {
      const i3 = i * 3;
      const i6 = i * 6;

      // Get base position and velocity
      const baseX = movementData[i6];
      const baseY = movementData[i6 + 1];
      const baseZ = movementData[i6 + 2];
      const velX = movementData[i6 + 3];
      const velY = movementData[i6 + 4];
      const velZ = movementData[i6 + 5];

      // Very gentle floating movement for dust
      const floatX = Math.sin(time * 0.2 + i * 0.01) * 0.3;
      const floatY = Math.cos(time * 0.25 + i * 0.015) * 0.3;
      const floatZ = Math.sin(time * 0.18 + i * 0.02) * 0.3;

      // Apply velocity-based drift
      const driftX = velX * time * 0.2;
      const driftY = velY * time * 0.2;
      const driftZ = velZ * time * 0.2;

      // Calculate current position
      const currentX = baseX + floatX + driftX;
      const currentY = baseY + floatY + driftY;
      const currentZ = baseZ + floatZ + driftZ;

      // Distance from center for scroll effect
      const dist = Math.sqrt(currentX ** 2 + currentY ** 2 + currentZ ** 2);
      
      if (dist > 0) {
        // Normalize direction from center
        const dirX = currentX / dist;
        const dirY = currentY / dist;
        const dirZ = currentZ / dist;

        // Apply scroll effect
        const scrollOffset = scrollEffect * (0.3 + Math.random() * 0.4);
        
        pos[i3] = currentX + dirX * scrollOffset;
        pos[i3 + 1] = currentY + dirY * scrollOffset;
        pos[i3 + 2] = currentZ + dirZ * scrollOffset;
      } else {
        pos[i3] = currentX;
        pos[i3 + 1] = currentY;
        pos[i3 + 2] = currentZ;
      }

      // Subtle size variation
      if (sizeArr) {
        sizeArr[i] = 0.003 + Math.abs(Math.sin(time * 0.1 + i * 0.05)) * 0.004;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (pointsRef.current.geometry.attributes.size) {
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }

    // Opacity based on scroll
    pointsRef.current.material.opacity = visibility * 0.4;

    // Very slow rotation for subtle 3D effect
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.002;
      groupRef.current.rotation.x = Math.sin(time * 0.01) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
                  <bufferAttribute
          attach="attributes-position"
          count={800}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={800}
          array={sizes}
          itemSize={1}
        />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color={"#cccccc"}
          transparent
          opacity={0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
