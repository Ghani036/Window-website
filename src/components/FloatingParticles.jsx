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
    for (let i = 0; i < 50; i++) {
      arr.push({
        type: 'large',
        basePos: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        size: Math.random() * 0.015 + 0.01,
        speed: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Medium
    for (let i = 0; i < 150; i++) {
      arr.push({
        type: 'medium',
        basePos: [
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25
        ],
        size: Math.random() * 0.01 + 0.004,
        speed: Math.random() * 0.8 + 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Small sparkles
    for (let i = 0; i < 300; i++) {
      arr.push({
        type: 'small',
        basePos: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        ],
        size: Math.random() * 0.006 + 0.002,
        speed: Math.random() * 1.2 + 0.6,
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
    let moveStrength = 1;

    if (section === 'first') {
      // fade out & move away
      visibility = Math.max(0, 1 - scrollProgress * 1.5);
      moveStrength = 1 + scrollProgress * 5;
    } else {
      // fade in when content visible
      if (showContent || visibleSubs >= 9) {
        visibility = Math.min(1, (scrollProgress - 0.2) * 2);
      } else {
        visibility = 0;
      }
      moveStrength = 1 - scrollProgress * 2;
    }

    // Update particles
    groupRef.current.children.forEach((particle, i) => {
      const data = particles[i];
      if (!data) return;

      const base = data.basePos;

      // Floating motion
      const fx = Math.sin(time * data.speed + data.phase) * 0.5;
      const fy = Math.cos(time * data.speed * 0.8 + data.phase) * 0.5;
      const fz = Math.sin(time * data.speed * 0.6 + data.phase) * 0.5;

      // Base position + floating
      particle.position.set(
        base[0] + fx,
        base[1] + fy,
        base[2] + fz
      );

      // Scroll effect (in/out)
      const dist = Math.sqrt(
        particle.position.x ** 2 +
        particle.position.y ** 2 +
        particle.position.z ** 2
      );
      const dir = new THREE.Vector3(
        particle.position.x / dist,
        particle.position.y / dist,
        particle.position.z / dist
      );

      if (section === 'first') {
        // push out
        particle.position.addScaledVector(dir, scrollProgress * 5);
      } else {
        // pull in
        particle.position.addScaledVector(dir, moveStrength);
      }

      // Opacity
      particle.material.opacity = visibility;

      // Tiny rotations for sparkle
      particle.rotation.x += 0.002;
      particle.rotation.y += 0.003;
    });

    // Rotate the whole system slightly
    groupRef.current.rotation.y = time * 0.01;
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.basePos}>
          <sphereGeometry args={[p.size, 16, 16]} />
          <meshBasicMaterial
            color={'white'}
            transparent
            opacity={1}
            blending={THREE.AdditiveBlending}
            depthWrite={false} // prevents weird overlap
          />
        </mesh>
      ))}
    </group>
  );
}
