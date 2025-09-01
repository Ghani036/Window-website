import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import { smoothstepRange } from "../utils/smoothstep";

export default function LogoVideoHUD({ scroll }) {
    // Just pass the URL string (drei creates the <video> for us)
    const texture = useVideoTexture("/videos/logo-reveal.mp4", {
      start: false, // we will control playback manually
      loop: false,
      muted: true,
      crossOrigin: "Anonymous",
    });
  
    const meshRef = useRef();
    const videoRef = texture.image; // the <video> element inside texture
  
    useFrame(() => {
      const t = scroll.offset;
  
      // 🔹 Logo reveal starts at 0.3 and ends at 0.6 scroll
      const revealProgress = smoothstepRange(t, 0.3, 0.6);
  
      // Scrub video based on scroll progress
      if (videoRef && videoRef.readyState >= 2 && videoRef.duration) {
        videoRef.currentTime = videoRef.duration * revealProgress;
      }
  
      if (meshRef.current) {
        // Fade out after reveal finishes
        meshRef.current.material.opacity =
          revealProgress < 1 ? 1 : 1 - smoothstepRange(t, 0.6, 0.65);
      }
    });
  
    return (
      <mesh ref={meshRef} position={[0, 0, -1]} scale={[2, 1, 1]}>
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