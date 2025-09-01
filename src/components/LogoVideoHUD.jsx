import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import { smoothstepRange } from "../utils/smoothstep";
import { useScrollVideoScrub } from "../hooks/useScrollVideoScrub";

export default function LogoVideoHUD({ scroll }) {
  const texture = useVideoTexture("/videos/logo-reveal.mp4", {
    start: false,
    loop: false,
    muted: true,
    crossOrigin: "Anonymous",
  });

  const meshRef = useRef();
  const videoRef = texture.image;

  // Sync playback with scroll range [0.3, 0.6]
  useScrollVideoScrub(videoRef, scroll.offset, [0.3, 0.6]);

  useFrame(() => {
    const t = scroll.offset;
    const revealProgress = smoothstepRange(t, 0.3, 0.6);

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
