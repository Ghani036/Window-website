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

  // Generate particle positions + sizes
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizeArr = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 30;
      pos[i3 + 1] = (Math.random() - 0.5) * 30;
      pos[i3 + 2] = (Math.random() - 0.5) * 30;

      // varied particle sizes
      sizeArr[i] = Math.random() * 0.015 + 0.003;
    }
    return { positions: pos, sizes: sizeArr };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position.array;
    const sizeArr = pointsRef.current.geometry.attributes.size?.array;
    const scrollProgress = scroll?.offset ?? 0;

    let visibility = 1;
    let moveStrength = 0;

    if (section === "first") {
      // fade out & push away
      visibility = Math.max(0, 1 - scrollProgress * 1.5);
      moveStrength = scrollProgress * 0.5;
    } else {
      // fade in & pull inward
      if (showContent || visibleSubs >= 9) {
        visibility = Math.min(1, (scrollProgress - 0.2) * 2);
      } else {
        visibility = 0;
      }
      moveStrength = -scrollProgress * 0.3;
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // floating motion
      pos[i3] += Math.sin(time * 0.3 + i * 0.1) * 0.002;
      pos[i3 + 1] += Math.cos(time * 0.4 + i * 0.15) * 0.002;
      pos[i3 + 2] += Math.sin(time * 0.35 + i * 0.12) * 0.002;

      // scroll in/out effect
      const dist = Math.sqrt(
        pos[i3] ** 2 + pos[i3 + 1] ** 2 + pos[i3 + 2] ** 2
      );
      if (dist > 0) {
        const dirX = pos[i3] / dist;
        const dirY = pos[i3 + 1] / dist;
        const dirZ = pos[i3 + 2] / dist;

        pos[i3] += dirX * moveStrength;
        pos[i3 + 1] += dirY * moveStrength;
        pos[i3 + 2] += dirZ * moveStrength;
      }

      // optional: pulsating size
      if (sizeArr) {
        sizeArr[i] =
          0.004 + Math.abs(Math.sin(time * 0.5 + i)) * 0.008;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (pointsRef.current.geometry.attributes.size) {
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }

    // opacity based on scroll
    pointsRef.current.material.opacity = visibility * 0.8;

    // rotate group slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.02;
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
          size={0.02}
          color={"white"}
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
