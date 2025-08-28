import React from "react";
import { useVideoTexture, useAspect } from "@react-three/drei";

export default function VideoBackground({video}) {
  const texture = useVideoTexture(`${video}`, {
    start: true,
    loop: true,
    muted: true,
    crossOrigin: "Anonymous",
  });

  // Adjust plane scale based on video aspect ratio
  const scale = useAspect(1920, 1080, 1);

  return (
    <mesh scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
