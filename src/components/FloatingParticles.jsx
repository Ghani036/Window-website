import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FloatingParticles({ 
  scroll, 
  showContent = false, 
  visibleSubs = 0,
  section = 'first' 
}) {
  const groupRef = useRef();

  // Create floating particles that move in and out based on scroll
  const particles = useMemo(() => {
    const particleArray = [];
    
    for (let i = 0; i < 200; i++) {
      particleArray.push({
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        ],
        originalPosition: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        ],
        velocity: [
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ],
        size: Math.random() * 0.02 + 0.005,
        color: section === 'first' ? 
          [1, 0.9, 0.3] : [0.3, 0.7, 1],
        opacity: Math.random() * 0.8 + 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }
    
    return particleArray;
  }, [section]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Calculate scroll effects
    let scrollProgress = 0;
    let particleIntensity = 1;
    let particleVisibility = 1;

    if (scroll) {
      scrollProgress = scroll.offset;
      
      if (section === 'first') {
        // First section: particles move away and fade as user scrolls
        particleIntensity = Math.max(0.1, 1 - scrollProgress * 1.2);
        particleVisibility = Math.max(0, 1 - scrollProgress * 1.5);
      } else {
        // Content section: particles appear and intensify when content is shown
        if (showContent || visibleSubs >= 9) {
          particleIntensity = Math.min(2, 0.5 + (scrollProgress - 0.3) * 3);
          particleVisibility = Math.min(1, (scrollProgress - 0.3) * 2);
        } else {
          particleIntensity = 0.1;
          particleVisibility = 0;
        }
      }
    }

    // Update each particle
    groupRef.current.children.forEach((particle, index) => {
      const particleData = particles[index];
      if (!particleData) return;

      // Calculate movement based on scroll
      const scrollInfluence = scrollProgress * 0.1;
      
      // Add floating motion
      particle.position.x = particleData.originalPosition[0] + 
        Math.sin(time * 0.5 + particleData.phase) * 2 * particleIntensity +
        Math.sin(time * 0.3 + index * 0.1) * 1 * particleIntensity;
      
      particle.position.y = particleData.originalPosition[1] + 
        Math.cos(time * 0.4 + particleData.phase) * 2 * particleIntensity +
        Math.cos(time * 0.2 + index * 0.15) * 1 * particleIntensity;
      
      particle.position.z = particleData.originalPosition[2] + 
        Math.sin(time * 0.6 + particleData.phase) * 1.5 * particleIntensity +
        Math.sin(time * 0.35 + index * 0.2) * 0.8 * particleIntensity;

      // Add scroll-based movement (particles come in/out)
      if (section === 'first') {
        // Move particles away from center as user scrolls
        const distanceFromCenter = Math.sqrt(
          particle.position.x ** 2 + 
          particle.position.y ** 2 + 
          particle.position.z ** 2
        );
        
        if (distanceFromCenter > 0) {
          const direction = {
            x: particle.position.x / distanceFromCenter,
            y: particle.position.y / distanceFromCenter,
            z: particle.position.z / distanceFromCenter
          };
          
          particle.position.x += direction.x * scrollProgress * 0.5;
          particle.position.y += direction.y * scrollProgress * 0.5;
          particle.position.z += direction.z * scrollProgress * 0.5;
        }
      } else {
        // Move particles towards center as content appears
        const targetDistance = 5 + scrollProgress * 10;
        const currentDistance = Math.sqrt(
          particle.position.x ** 2 + 
          particle.position.y ** 2 + 
          particle.position.z ** 2
        );
        
        if (currentDistance > targetDistance) {
          const direction = {
            x: particle.position.x / currentDistance,
            y: particle.position.y / currentDistance,
            z: particle.position.z / currentDistance
          };
          
          particle.position.x -= direction.x * 0.1;
          particle.position.y -= direction.y * 0.1;
          particle.position.z -= direction.z * 0.1;
        }
      }

      // Update material properties
      particle.material.opacity = particleData.opacity * particleVisibility;
      
      // Add subtle color animation
      const colorIntensity = 0.7 + Math.sin(time * 0.3 + index * 0.1) * 0.3;
      particle.material.color.setRGB(
        particleData.color[0] * colorIntensity,
        particleData.color[1] * colorIntensity,
        particleData.color[2] * colorIntensity
      );

      // Add rotation
      particle.rotation.x += 0.01 * particleIntensity;
      particle.rotation.y += 0.015 * particleIntensity;
    });

    // Rotate the entire group
    groupRef.current.rotation.x = time * 0.01;
    groupRef.current.rotation.y = time * 0.005;
  });

  return (
    <group ref={groupRef}>
      {particles.map((particleData, index) => (
        <mesh key={index} position={particleData.position}>
          <sphereGeometry args={[particleData.size, 6, 4]} />
          <meshBasicMaterial
            color={particleData.color}
            transparent
            opacity={particleData.opacity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
