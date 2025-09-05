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
      const radius = Math.random() * 40 + 10; // Increased range for better coverage
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      // Store base position for reference
      moveData[i6] = pos[i3];
      moveData[i6 + 1] = pos[i3 + 1];
      moveData[i6 + 2] = pos[i3 + 2];

      // More visible velocities for natural movement
      moveData[i6 + 3] = (Math.random() - 0.5) * 0.02; // vx - increased for visibility
      moveData[i6 + 4] = (Math.random() - 0.5) * 0.02; // vy - increased for visibility
      moveData[i6 + 5] = (Math.random() - 0.5) * 0.02; // vz - increased for visibility

      // Much larger particle sizes
      sizeArr[i] = Math.random() * 0.025 + 0.01; // Increased from 0.003-0.015 to 0.01-0.035
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

    if (section === "first") {
      // fade out & push away
      visibility = Math.max(0, 1 - scrollProgress * 1.5);
      scrollEffect = scrollProgress * 0.5; // Reduced scroll effect
    } else {
      // fade in & pull inward
      if (showContent || visibleSubs >= 9) {
        visibility = Math.min(1, (scrollProgress - 0.2) * 2);
      } else {
        visibility = 0;
      }
      scrollEffect = -scrollProgress * 0.3; // Reduced scroll effect
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

      // Natural floating movement (very visible)
      const floatX = Math.sin(time * 0.5 + i * 0.01) * 1.5; // Much more visible movement
      const floatY = Math.cos(time * 0.6 + i * 0.015) * 1.5; // Much more visible movement
      const floatZ = Math.sin(time * 0.4 + i * 0.02) * 1.5; // Much more visible movement

      // Apply velocity-based movement (very visible)
      const driftX = velX * time * 0.5; // Much more visible movement
      const driftY = velY * time * 0.5; // Much more visible movement
      const driftZ = velZ * time * 0.5; // Much more visible movement

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

      // Subtle size variation
      if (sizeArr) {
        sizeArr[i] = 0.005 + Math.abs(Math.sin(time * 0.3 + i * 0.1)) * 0.008;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (pointsRef.current.geometry.attributes.size) {
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }

    // opacity based on scroll
    pointsRef.current.material.opacity = visibility * 0.7;

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
          size={0.05}
          color={"white"}
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
