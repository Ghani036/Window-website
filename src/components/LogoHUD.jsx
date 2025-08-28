import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Image, useScroll } from "@react-three/drei";
import { smoothstepRange } from "../utils/ math";

export default function LogoHUD() {
  const imgRef = useRef();
  const scroll = useScroll();

  useFrame(() => {
    const t = scroll.offset; // 0..1 across all pages

    // Scroll-driven animation
    const fadeIn = smoothstepRange(t, 0.0, 0.33);
    const scaleUp = smoothstepRange(t, 0.33, 0.66);

    const opacity = fadeIn;
    const scale = 0.8 + 0.2 * scaleUp;

    if (imgRef.current) {
      const mat = imgRef.current.material;
      mat.transparent = true;
      mat.opacity = opacity;
      imgRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <Image
      ref={imgRef}
      url="/assets/logo.png"
      transparent
      depthTest={false}
      position={[0, 0, -2]}
      scale={[2, 1, 1]}
    />
  );
}
