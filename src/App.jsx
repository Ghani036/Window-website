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

/** Fullscreen background video */
function VideoBackground() {
  const texture = useVideoTexture("/videos/section-1-bg.mp4", {
    start: true,
    loop: true,
    muted: true,
    crossOrigin: "Anonymous",
  });

  const scale = useAspect(1920, 1080, 1);
  return (
    <mesh scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/** Logo HUD */
function LogoHUD() {
  const imgRef = useRef();
  const scroll = useScroll();

  useFrame(() => {
    const t = scroll.offset;
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

/** CameraRig with zoom only (no mouse pan) */
function CameraRig() {
  const cam = useRef();
  const scroll = useScroll();

  useFrame(() => {
    const t = scroll.offset; // scroll progress 0..1

    if (cam.current) {
      // 🔹 Scroll → Zoom (moving camera in/out)
      cam.current.position.z = 5 - 0.5 * smoothstepRange(t, 0, 1);

      cam.current.updateProjectionMatrix();
    }
  });

  return (
    <PerspectiveCamera ref={cam} makeDefault position={[0, 0, 5]}>
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
    <div className="w-screen h-screen relative bg-black">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 3]}
        className="absolute top-0 left-0 w-full h-full"
      >
        <ScrollControls pages={15} damping={0.3}>
          <Scene />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
