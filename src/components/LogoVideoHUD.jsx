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

    // 🔹 Logo reveal starts at 0.1 and ends at 0.4 scroll (earlier and longer)
    const revealProgress = smoothstepRange(t, 0.1, 0.4);

    // Scrub video based on scroll progress
    if (videoRef && videoRef.readyState >= 2 && videoRef.duration) {
      videoRef.currentTime = videoRef.duration * revealProgress;
    }

    if (meshRef.current) {
      // Show logo during reveal, fade out after
      const opacity = revealProgress < 1 ? revealProgress : Math.max(0, 1 - smoothstepRange(t, 0.4, 0.5));
      meshRef.current.material.opacity = opacity;
    }
  });
  
    return (
      <mesh ref={meshRef} position={[0, 0, 2]} scale={[1.5, 1, 1]}>
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