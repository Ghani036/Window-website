// App.jsx
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useVideoTexture,
  useAspect,
  ScrollControls,
  useScroll,
  Image,
  PerspectiveCamera,
  Preload,
} from "@react-three/drei";

/** Helper: smoothstep within a [start, end] range */
function smoothstepRange(t, start, end) {
  const x = Math.min(Math.max((t - start) / (end - start), 0), 1);
  return x * x * (3 - 2 * x);
}

/** Full-bleed video that covers the viewport */
function VideoBackground() {
  // Autoplaying, muted loop; place your file in /public/videos/section-1-bg.mp4
  const texture = useVideoTexture("/videos/section-1-bg.mp4", {
    start: true,
    loop: true,
    muted: true,
    crossOrigin: "Anonymous",
  });
  // Scale a 1x1 plane to cover the viewport using the video's aspect (1920x1080 here)
  const scale = useAspect(1920, 1080, 1); // width, height, factor
  return (
    <mesh scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/** Logo that lives in camera space and animates with scroll (steps) */
function LogoHUD() {
  const imgRef = useRef();
  const scroll = useScroll();

  useFrame(() => {
    const t = scroll.offset; // 0..1 across all pages

    // Step 1 (0%→33%): Fade in
    const fadeIn = smoothstepRange(t, 0.0, 0.33);

    // Step 2 (33%→66%): Scale up 0.8 → 1.0
    const scaleUp = smoothstepRange(t, 0.33, 0.66);

    // Step 3 (66%→100%): Hold (you can add more effects here if you like)
    const hold = smoothstepRange(t, 0.66, 1.0);

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

/** Camera with HUD contents parented so they move with the camera */
function CameraRig() {
  return (
    <PerspectiveCamera makeDefault position={[0, 0, 5]}>
      <LogoHUD />
    </PerspectiveCamera>
  );
}

function Scene() {
  return (
    <>
      <VideoBackground />
      <CameraRig />
      <Preload all />
    </>
  );
}

export default function App() {
  return (
    <div className="w-screen h-screen relative bg-black ">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 3]}
        className="absolute top-0 left-0 w-full h-full"
      >
        {/* damping = Adds smoothness to the scroll effect. */}
        <ScrollControls pages={15} damping={0.3}>
          <Scene />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
