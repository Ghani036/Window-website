import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleSystem({
  count = 1000,
  scroll,
  showContent = false,
  visibleSubs = 0,
  section = "first", // "first" or "content"
}) {
  const groupRef = useRef();
  const pointsRef = useRef();

  // Generate particle positions + sizes + movement data
  const { positions, sizes, movementData } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizeArr = new Float32Array(count);
    const moveData = new Float32Array(count * 6); // 6 values per particle: basePos(3) + velocity(3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i6 = i * 6;
      
      // Random initial positions in a much larger sphere for full scene coverage
      const radius = Math.random() * 60 + 15; // Much larger range for better coverage
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      // Store base position for reference
      moveData[i6] = pos[i3];
      moveData[i6 + 1] = pos[i3 + 1];
      moveData[i6 + 2] = pos[i3 + 2];

      // Slower, smoother velocities for gentle floating movement
      moveData[i6 + 3] = (Math.random() - 0.5) * 0.005; // vx - very slow, smooth movement
      moveData[i6 + 4] = (Math.random() - 0.5) * 0.005; // vy - very slow, smooth movement
      moveData[i6 + 5] = (Math.random() - 0.5) * 0.005; // vz - very slow, smooth movement

      // Smaller particles for better visual balance
      sizeArr[i] = 0.08; // Fixed 8px size for all particles
    }
    return { positions: pos, sizes: sizeArr, movementData: moveData };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position.array;
    const sizeArr = pointsRef.current.geometry.attributes.size?.array;
    const scrollProgress = scroll?.offset ?? 0;

    let visibility = 1;
    let scrollEffect = 0;

    // Particles behavior based on scene
    if (section === "first") {
      // Keep particles visible in first scene
      visibility = Math.max(0.4, 1 - scrollProgress * 0.6);
      scrollEffect = scrollProgress * 0.15;
    } else if (section === "content") {
      // Show particles in content scene too
      visibility = showContent ? 0.6 : 0;
      scrollEffect = 0;
    } else {
      visibility = 0;
      scrollEffect = 0;
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i6 = i * 6;

      // Get base position and velocity from movement data
      const baseX = movementData[i6];
      const baseY = movementData[i6 + 1];
      const baseZ = movementData[i6 + 2];
      const velX = movementData[i6 + 3];
      const velY = movementData[i6 + 4];
      const velZ = movementData[i6 + 5];

      // Very slow, gentle floating movement
      const floatX = Math.sin(time * 0.1 + i * 0.01) * 0.3 + Math.cos(time * 0.08 + i * 0.02) * 0.2;
      const floatY = Math.cos(time * 0.12 + i * 0.015) * 0.3 + Math.sin(time * 0.09 + i * 0.03) * 0.2;
      const floatZ = Math.sin(time * 0.11 + i * 0.02) * 0.3 + Math.cos(time * 0.1 + i * 0.025) * 0.2;

      // Apply very slow velocity-based movement
      const driftX = velX * time * 0.2 + Math.sin(time * 0.05 + i * 0.05) * 0.1;
      const driftY = velY * time * 0.2 + Math.cos(time * 0.06 + i * 0.06) * 0.1;
      const driftZ = velZ * time * 0.2 + Math.sin(time * 0.04 + i * 0.04) * 0.1;

      // Calculate current position from center
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

        // Apply scroll effect (particles move in/out from center)
        const scrollOffset = scrollEffect * (0.5 + Math.random() * 0.5); // random multiplier for variety
        
        pos[i3] = currentX + dirX * scrollOffset;
        pos[i3 + 1] = currentY + dirY * scrollOffset;
        pos[i3 + 2] = currentZ + dirZ * scrollOffset;
      } else {
        pos[i3] = currentX;
        pos[i3 + 1] = currentY;
        pos[i3 + 2] = currentZ;
      }

      // Keep 8px size with subtle variation
      if (sizeArr) {
        sizeArr[i] = 0.08 + Math.abs(Math.sin(time * 0.15 + i * 0.03)) * 0.01;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (pointsRef.current.geometry.attributes.size) {
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }

    // opacity based on scroll
    pointsRef.current.material.opacity = visibility * 0.8;

    // Very slow rotation for subtle 3D effect
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.005;
      groupRef.current.rotation.x = Math.sin(time * 0.02) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color={"white"}
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.NormalBlending}
          depthWrite={false}
          alphaTest={0.1}
        />
      </points>
    </group>
  );
}
