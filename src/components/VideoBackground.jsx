import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useVideoTexture, useAspect } from "@react-three/drei";
import { smoothstepRange } from "../utils/smoothstep";

export default function VideoBackground({ scroll, showContent, visibleSubs }) {
  const texture = useVideoTexture("/videos/section-1-bg.mp4", {
    start: true,
    loop: true,
    muted: true,
    crossOrigin: "Anonymous",
  });

  const scale = useAspect(1920, 1080, 1);
  const meshRef = useRef();
  const videoRef = texture.image; // Get the video element

  useFrame((state) => {
    const t = scroll.offset;

    // Let video play naturally - no scroll control
    // Videos will loop automatically

    // Dynamic zoom effect based on scroll progress - Scene 1 behavior
    const baseZoom = 1.0;
    // Smooth zoom in as you scroll down, zoom out when scrolling up
    const zoomEffect = 1.0 + (t * 0.2); // Increased zoom effect for more dramatic feel
    
    // Simple fade logic - visible in Scene 1, hidden in Scene 2
    const fadeOut = showContent ? 0 : 1;

    if (meshRef.current) {
      meshRef.current.scale.set(scale[0] * baseZoom * zoomEffect, scale[1] * baseZoom * zoomEffect, 1);
      meshRef.current.material.opacity = fadeOut;
    }
  });

  return (
    <>
      {/* Background video */}
      <mesh ref={meshRef} scale={scale} position={[0, 0, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent />
      </mesh>

      {/* Black overlay for beautification */}
      <mesh scale={[100, 100, 1]} position={[0, 0, 1.1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>
    </>
  );
}