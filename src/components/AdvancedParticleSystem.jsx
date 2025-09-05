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

  // Create particle configs
  const particleConfigs = useMemo(() => {
    const configs = [];

    // Large floating particles (reduced size, light gray)
    for (let i = 0; i < 50; i++) {
      configs.push({
        type: 'large',
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ],
        speed: Math.random() * 0.02 + 0.01,
        size: Math.random() * 0.015 + 0.008, // smaller
        color: [0.9, 0.9, 0.9] // light gray
      });
    }

    // Medium particles (smaller + same color)
    for (let i = 0; i < 150; i++) {
      configs.push({
        type: 'medium',
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        speed: Math.random() * 0.03 + 0.02,
        size: Math.random() * 0.01 + 0.004, // reduced size
        color: [0.9, 0.9, 0.9]
      });
    }

    // Small sparkle particles (tiny + white-gray)
    for (let i = 0; i < 300; i++) {
      configs.push({
        type: 'small',
        position: [
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25
        ],
        speed: Math.random() * 0.05 + 0.03,
        size: Math.random() * 0.005 + 0.002, // even smaller
        color: [0.95, 0.95, 0.95] // brighter white-gray for sparkle effect
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
        visibilityMultiplier = Math.max(0, 1 - scrollProgress * 1.5);
        movementIntensity = 1 + scrollProgress * 0.8;
      } else {
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

      let movementX, movementY, movementZ;

      switch (config.type) {
        case 'large':
          movementX = Math.sin(time * config.speed + index * 0.1) * 0.002;
          movementY = Math.cos(time * config.speed * 0.7 + index * 0.15) * 0.002;
          movementZ = Math.sin(time * config.speed * 0.5 + index * 0.2) * 0.002;
          break;
        case 'medium':
          movementX = Math.sin(time * config.speed + index * 0.05) * 0.003;
          movementY = Math.cos(time * config.speed + index * 0.08) * 0.003;
          movementZ = Math.sin(time * config.speed * 0.8 + index * 0.12) * 0.003;
          break;
        case 'small':
          movementX = Math.sin(time * config.speed + index * 0.02) * 0.005;
          movementY = Math.cos(time * config.speed * 1.2 + index * 0.03) * 0.005;
          movementZ = Math.sin(time * config.speed * 0.9 + index * 0.04) * 0.005;
          break;
      }

      particle.position.x += movementX * movementIntensity;
      particle.position.y += movementY * movementIntensity;
      particle.position.z += movementZ * movementIntensity;

      // bounds
      if (particle.position.x > 12) particle.position.x = -12;
      if (particle.position.x < -12) particle.position.x = 12;
      if (particle.position.y > 12) particle.position.y = -12;
      if (particle.position.y < -12) particle.position.y = 12;
      if (particle.position.z > 12) particle.position.z = -12;
      if (particle.position.z < -12) particle.position.z = 12;

      // opacity
      particle.material.opacity = visibilityMultiplier * 0.7;

      // subtle rotation
      particle.rotation.x += 0.001 * movementIntensity;
      particle.rotation.y += 0.002 * movementIntensity;
    });

    // Rotate group slowly
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
