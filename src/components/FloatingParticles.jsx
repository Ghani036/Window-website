import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function WhiteParticleSystem({ 
  scroll, 
  section = 'first', 
  showContent = false, 
  visibleSubs = 0 
}) {
  const groupRef = useRef();

  // Particle configs (large, medium, small)
  const particles = useMemo(() => {
    const arr = [];

    // Large
    for (let i = 0; i < 80; i++) {
      arr.push({
        type: 'large',
        basePos: [
          (Math.random() - 0.5) * 60, // Much larger range
          (Math.random() - 0.5) * 60, // Much larger range
          (Math.random() - 0.5) * 60  // Much larger range
        ],
        size: Math.random() * 0.015 + 0.008, // Smaller, cleaner size
        speed: Math.random() * 0.15 + 0.08, // Better speed
        phase: Math.random() * Math.PI * 2
      });
    }

    // Medium
    for (let i = 0; i < 200; i++) {
      arr.push({
        type: 'medium',
        basePos: [
          (Math.random() - 0.5) * 65, // Much larger range
          (Math.random() - 0.5) * 65, // Much larger range
          (Math.random() - 0.5) * 65  // Much larger range
        ],
        size: Math.random() * 0.01 + 0.005, // Smaller, cleaner size
        speed: Math.random() * 0.2 + 0.1, // Better speed
        phase: Math.random() * Math.PI * 2
      });
    }

    // Small sparkles
    for (let i = 0; i < 400; i++) {
      arr.push({
        type: 'small',
        basePos: [
          (Math.random() - 0.5) * 70, // Much larger range
          (Math.random() - 0.5) * 70, // Much larger range
          (Math.random() - 0.5) * 70  // Much larger range
        ],
        size: Math.random() * 0.008 + 0.003, // Smaller, cleaner size
        speed: Math.random() * 0.25 + 0.15, // Better speed
        phase: Math.random() * Math.PI * 2
      });
    }

    return arr;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const scrollProgress = scroll?.offset ?? 0;

    // Scroll-based multipliers
    let visibility = 1;
    let scrollEffect = 0;

    if (section === 'first') {
      // fade out & move away
      visibility = Math.max(0, 1 - scrollProgress * 1.5);
      scrollEffect = scrollProgress * 0.8; // Reduced scroll effect
    } else {
      // fade in when content visible
      if (showContent || visibleSubs >= 9) {
        visibility = Math.min(1, (scrollProgress - 0.2) * 2);
      } else {
        visibility = 0;
      }
      scrollEffect = -scrollProgress * 0.5; // Reduced scroll effect
    }

    // Update particles
    groupRef.current.children.forEach((particle, i) => {
      const data = particles[i];
      if (!data) return;

      const base = data.basePos;

      // Smoother, more random floating motion
      const fx = Math.sin(time * data.speed * 0.4 + data.phase) * 0.8 + Math.cos(time * data.speed * 0.3 + data.phase) * 0.4;
      const fy = Math.cos(time * data.speed * 0.45 + data.phase) * 0.8 + Math.sin(time * data.speed * 0.35 + data.phase) * 0.4;
      const fz = Math.sin(time * data.speed * 0.5 + data.phase) * 0.8 + Math.cos(time * data.speed * 0.4 + data.phase) * 0.4;

      // Base position + slow floating
      const currentX = base[0] + fx;
      const currentY = base[1] + fy;
      const currentZ = base[2] + fz;

      // Distance from center for scroll effect
      const dist = Math.sqrt(currentX ** 2 + currentY ** 2 + currentZ ** 2);
      
      if (dist > 0) {
        const dir = new THREE.Vector3(
          currentX / dist,
          currentY / dist,
          currentZ / dist
        );

        // Apply scroll effect with random variation
        const randomMultiplier = 0.3 + Math.random() * 0.7; // 0.3 to 1.0
        const scrollOffset = scrollEffect * randomMultiplier;
        
        particle.position.set(
          currentX + dir.x * scrollOffset,
          currentY + dir.y * scrollOffset,
          currentZ + dir.z * scrollOffset
        );
      } else {
        particle.position.set(currentX, currentY, currentZ);
      }

      // Opacity
      particle.material.opacity = visibility * 0.8;

      // Very slow rotations for subtle sparkle
      particle.rotation.x += 0.0005;
      particle.rotation.y += 0.0008;
      particle.rotation.z += 0.0003;
    });

    // Very slow rotation for subtle 3D effect
    groupRef.current.rotation.y = time * 0.003;
    groupRef.current.rotation.x = Math.sin(time * 0.01) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.basePos}>
          <sphereGeometry args={[p.size, 16, 16]} />
          <meshBasicMaterial
            color={'white'}
            transparent
            opacity={0.8}
            blending={THREE.NormalBlending}
            depthWrite={false}
            alphaTest={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
