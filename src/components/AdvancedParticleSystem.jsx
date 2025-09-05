import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AdvancedParticleSystem({ 
  scroll, 
  showContent = false, 
  visibleSubs = 0,
  section = 'first' 
}) {
  const groupRef = useRef();

  // Create different types of particles
  const particleConfigs = useMemo(() => {
    const configs = [];

    // Large floating particles
    for (let i = 0; i < 50; i++) {
      configs.push({
        type: 'large',
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ],
        speed: Math.random() * 0.02 + 0.01,
        size: Math.random() * 0.03 + 0.02,
        color: section === 'first' ? 
          [1, 0.8, 0.2] : [0.2, 0.6, 1]
      });
    }

    // Medium particles
    for (let i = 0; i < 150; i++) {
      configs.push({
        type: 'medium',
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        speed: Math.random() * 0.03 + 0.02,
        size: Math.random() * 0.015 + 0.008,
        color: section === 'first' ? 
          [1, 0.5, 0] : [0.6, 0.2, 1]
      });
    }

    // Small sparkle particles
    for (let i = 0; i < 300; i++) {
      configs.push({
        type: 'small',
        position: [
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25
        ],
        speed: Math.random() * 0.05 + 0.03,
        size: Math.random() * 0.008 + 0.003,
        color: [1, 1, 1] // White sparkles
      });
    }

    return configs;
  }, [section]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Calculate scroll-based effects
    let scrollProgress = 0;
    let visibilityMultiplier = 1;
    let movementIntensity = 1;

    if (scroll) {
      scrollProgress = scroll.offset;
      
      if (section === 'first') {
        // First section: particles fade out and move faster as user scrolls
        visibilityMultiplier = Math.max(0, 1 - scrollProgress * 1.5);
        movementIntensity = 1 + scrollProgress * 0.8;
      } else {
        // Content section: particles appear when content is shown
        if (showContent || visibleSubs >= 9) {
          visibilityMultiplier = Math.min(1, (scrollProgress - 0.3) * 2.5);
        } else {
          visibilityMultiplier = 0;
        }
        movementIntensity = 1 + (scrollProgress - 0.3) * 0.5;
      }
    }

    // Update each particle
    groupRef.current.children.forEach((particle, index) => {
      const config = particleConfigs[index];
      if (!config) return;

      // Different movement patterns for different particle types
      let movementX, movementY, movementZ;

      switch (config.type) {
        case 'large':
          // Slow, floating movement
          movementX = Math.sin(time * config.speed + index * 0.1) * 0.002;
          movementY = Math.cos(time * config.speed * 0.7 + index * 0.15) * 0.002;
          movementZ = Math.sin(time * config.speed * 0.5 + index * 0.2) * 0.002;
          break;
        case 'medium':
          // Medium speed, swirling movement
          movementX = Math.sin(time * config.speed + index * 0.05) * 0.003;
          movementY = Math.cos(time * config.speed + index * 0.08) * 0.003;
          movementZ = Math.sin(time * config.speed * 0.8 + index * 0.12) * 0.003;
          break;
        case 'small':
          // Fast, twinkling movement
          movementX = Math.sin(time * config.speed + index * 0.02) * 0.005;
          movementY = Math.cos(time * config.speed * 1.2 + index * 0.03) * 0.005;
          movementZ = Math.sin(time * config.speed * 0.9 + index * 0.04) * 0.005;
          break;
      }

      // Apply movement with intensity multiplier
      particle.position.x += movementX * movementIntensity;
      particle.position.y += movementY * movementIntensity;
      particle.position.z += movementZ * movementIntensity;

      // Keep particles within bounds
      if (particle.position.x > 12) particle.position.x = -12;
      if (particle.position.x < -12) particle.position.x = 12;
      if (particle.position.y > 12) particle.position.y = -12;
      if (particle.position.y < -12) particle.position.y = 12;
      if (particle.position.z > 12) particle.position.z = -12;
      if (particle.position.z < -12) particle.position.z = 12;

      // Update opacity based on scroll
      particle.material.opacity = visibilityMultiplier * 0.7;

      // Add subtle rotation
      particle.rotation.x += 0.001 * movementIntensity;
      particle.rotation.y += 0.002 * movementIntensity;
    });

    // Rotate the entire group slowly
    groupRef.current.rotation.x = time * 0.02;
    groupRef.current.rotation.y = time * 0.01;
  });

  return (
    <group ref={groupRef}>
      {particleConfigs.map((config, index) => (
        <mesh key={index} position={config.position}>
          <sphereGeometry args={[config.size, 8, 6]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
