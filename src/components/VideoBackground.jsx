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
    
    // Better fade transition - keep video visible during menu reveal, fade when transitioning to content
    const fadeOut = showContent ? smoothstepRange(t, 0.6, 0.8) : Math.max(0.3, 1 - smoothstepRange(t, 0.8, 1.0));

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

      {/* Remove dark overlay to show particles clearly */}
    </>
  );
}