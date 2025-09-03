import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useVideoTexture, useAspect } from "@react-three/drei";
import { smoothstepRange } from "../utils/smoothstep";

export default function VideoBackground({ scroll }) {
  const texture = useVideoTexture("/videos/section-1-bg.mp4", {
    start: false,
    loop: false,
    muted: true,
    pause: true,
    crossOrigin: "Anonymous",
  });

  const scale = useAspect(1920, 1080, 1);
  const meshRef = useRef();

  useFrame(() => {
    const t = scroll.offset;

    // Phase 1: Zoom out
    const zoomOut = 1.2 - 0.2 * smoothstepRange(t, 0, 0.2);

    // Phase 2: Pulse zoom
    const pulseZoom = 1.0 + 0.1 * Math.sin(t * Math.PI * 2);

    const finalZoom = t < 0.2 ? zoomOut : pulseZoom;

    if (meshRef.current) {
      meshRef.current.scale.set(scale[0] * finalZoom, scale[1] * finalZoom, 1);
    }
  });

  return (
    <mesh ref={meshRef} scale={scale} position={[0, 0, 1]}>
      {/* 👆 Push video slightly backward */}
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );

}
