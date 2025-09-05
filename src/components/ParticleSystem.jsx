import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleSystem({ 
  count = 1000, 
  scroll, 
  showContent = false, 
  visibleSubs = 0,
  section = 'first' // 'first' or 'content'
}) {
  const meshRef = useRef();
  const particlesRef = useRef();

  // Create particle geometry and material
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random positions in a larger space
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      // Random colors - different palettes for different sections
      if (section === 'first') {
        // First section: warm colors (gold, orange, white)
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
          colors[i3] = 1; // R
          colors[i3 + 1] = 0.8; // G
          colors[i3 + 2] = 0.2; // B (gold)
        } else if (colorChoice < 0.7) {
          colors[i3] = 1; // R
          colors[i3 + 1] = 0.5; // G
          colors[i3 + 2] = 0; // B (orange)
        } else {
          colors[i3] = 1; // R
          colors[i3 + 1] = 1; // G
          colors[i3 + 2] = 1; // B (white)
        }
      } else {
        // Content section: cool colors (blue, purple, cyan)
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
          colors[i3] = 0.2; // R
          colors[i3 + 1] = 0.6; // G
          colors[i3 + 2] = 1; // B (blue)
        } else if (colorChoice < 0.7) {
          colors[i3] = 0.6; // R
          colors[i3 + 1] = 0.2; // G
          colors[i3 + 2] = 1; // B (purple)
        } else {
          colors[i3] = 0; // R
          colors[i3 + 1] = 1; // G
          colors[i3 + 2] = 1; // B (cyan)
        }
      }

      // Random sizes
      sizes[i] = Math.random() * 0.02 + 0.005;
    }

    return { positions, colors, sizes };
  }, [count, section]);

  useFrame((state) => {
    if (!meshRef.current || !particlesRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = particlesRef.current.geometry.attributes.position.array;
    const colors = particlesRef.current.geometry.attributes.color.array;

    // Calculate scroll-based visibility and movement
    let scrollProgress = 0;
    let visibilityMultiplier = 1;
    let movementIntensity = 1;

    if (scroll) {
      scrollProgress = scroll.offset;
      
      if (section === 'first') {
        // First section particles: fade out as user scrolls down
        visibilityMultiplier = Math.max(0, 1 - scrollProgress * 2);
        movementIntensity = 1 + scrollProgress * 0.5;
      } else {
        // Content section particles: fade in when content is shown
        if (showContent || visibleSubs >= 9) {
          visibilityMultiplier = Math.min(1, (scrollProgress - 0.4) * 2);
        } else {
          visibilityMultiplier = 0;
        }
        movementIntensity = 1 + (scrollProgress - 0.4) * 0.3;
      }
    }

    // Update particle positions and colors
    if (positions && colors) {
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Random floating movement
        positions[i3] += Math.sin(time * 0.5 + i * 0.01) * 0.001 * movementIntensity;
        positions[i3 + 1] += Math.cos(time * 0.3 + i * 0.02) * 0.001 * movementIntensity;
        positions[i3 + 2] += Math.sin(time * 0.4 + i * 0.015) * 0.001 * movementIntensity;

        // Keep particles within bounds
        if (positions[i3] > 10) positions[i3] = -10;
        if (positions[i3] < -10) positions[i3] = 10;
        if (positions[i3 + 1] > 10) positions[i3 + 1] = -10;
        if (positions[i3 + 1] < -10) positions[i3 + 1] = 10;
        if (positions[i3 + 2] > 10) positions[i3 + 2] = -10;
        if (positions[i3 + 2] < -10) positions[i3 + 2] = 10;

        // Update colors with subtle animation
        const colorIntensity = 0.8 + Math.sin(time * 0.2 + i * 0.1) * 0.2;
        colors[i3] *= colorIntensity;
        colors[i3 + 1] *= colorIntensity;
        colors[i3 + 2] *= colorIntensity;
      }
    }

    // Update geometry
    if (particlesRef.current && particlesRef.current.geometry) {
      if (particlesRef.current.geometry.attributes.position) {
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
      if (particlesRef.current.geometry.attributes.color) {
        particlesRef.current.geometry.attributes.color.needsUpdate = true;
      }
    }

    // Update material opacity based on scroll
    if (particlesRef.current && particlesRef.current.material) {
      particlesRef.current.material.opacity = visibilityMultiplier * 0.6;
    }
    
    // Rotate the entire particle system slowly
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.05;
      meshRef.current.rotation.y = time * 0.03;
    }
  });

  return (
    <group ref={meshRef}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
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
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
