import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import { smoothstepRange } from "../utils/smoothstep";

export default function LogoVideoHUD({ scroll, showContent }) {
    // Just pass the URL string (drei creates the <video> for us)
    const texture = useVideoTexture("/videos/logo-reveal.mp4", {
      start: true, // start the video
      loop: false,
      muted: true,
      crossOrigin: "Anonymous",
    });
  
    const meshRef = useRef();
    const videoRef = texture.image; // the <video> element inside texture
  
      useFrame(() => {
    if (!scroll || showContent) return; // Don't show logo in content sections
    
    const t = scroll.offset;

    // 🔹 Logo reveal ONLY in first scene - step by step reveal
    // 1. Don't show if content is being shown
    // 2. Don't show if scroll is past 50% (first scene only)
    // 3. Don't show if we're in any content section
    if (t >= 0.5) return; // Completely hide logo after 50% scroll progress (first scene only)
    
    // Step-by-step logo reveal with smoother progression
    const revealProgress = smoothstepRange(t, 0.01, 0.35); // Start earlier, end earlier for menu space

    // Scrub video based on scroll progress for step-by-step reveal
    if (videoRef && videoRef.readyState >= 2 && videoRef.duration) {
      videoRef.currentTime = videoRef.duration * revealProgress;
    }

    if (meshRef.current) {
      // Show logo during reveal, keep visible longer for menu to appear
      const opacity = revealProgress < 1 ? 
        Math.min(revealProgress * 1.5, 1) : // Faster fade in
        Math.max(0, 1 - smoothstepRange(t, 0.35, 0.45)); // Fade out to make room for menu
      meshRef.current.material.opacity = opacity;
    }
  });
  
    return (
      <mesh ref={meshRef} position={[0, 0, 2]} scale={[1.5, 1, 1]} visible={!showContent}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0}
          depthTest={false}
        />
      </mesh>
    );
  }