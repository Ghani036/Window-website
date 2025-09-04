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

  useFrame(() => {
    const t = scroll.offset;

    // Phase 1: Initial zoom out (first scene completion)
    const zoomOut = 1.2 - 0.2 * smoothstepRange(t, 0, 0.5);

    // Phase 2: Steady state with subtle pulse
    const pulseZoom = 1.0 + 0.05 * Math.sin(t * Math.PI * 2);

    // Phase 3: Fade out when content is shown OR when all menu items are visible
    const fadeOut = (showContent || visibleSubs >= 9) ? 0 : Math.max(0, 1 - smoothstepRange(t, 0.4, 0.6));

    const finalZoom = t < 0.5 ? zoomOut : pulseZoom;

    if (meshRef.current) {
      meshRef.current.scale.set(scale[0] * finalZoom, scale[1] * finalZoom, 1);
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

      {/* Black overlay plane */}
      <mesh scale={scale} position={[0, 0, 1.01]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="black" transparent opacity={(showContent || visibleSubs >= 9) ? 0 : 0.4 * Math.max(0, 1 - smoothstepRange(scroll.offset, 0.4, 0.6))} />
      </mesh>
    </>
  );
}