// App.jsx
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useVideoTexture,
  useAspect,
  ScrollControls,
  useScroll,
  PerspectiveCamera,
  Preload,
} from "@react-three/drei";

/** Helper: smoothstep within a [start, end] range */
function smoothstepRange(t, start, end) {
  const x = Math.min(Math.max((t - start) / (end - start), 0), 1);
  return x * x * (3 - 2 * x);
}

/** Fullscreen background video */
function VideoBackground({ scroll }) {
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

    // 🔹 Phase 1: Start zoomed in
    const startZoom = 1.2; // initial zoom
    const endZoom = 1.0; // after zoom out

    // Phase 1: Zoom out on first scroll section
    const zoomOut = startZoom - 0.2 * smoothstepRange(t, 0, 0.2);

    // Phase 2: Slight zoom in cycles on later scrolls
    const pulseZoom = 1.0 + 0.1 * Math.sin(t * Math.PI * 2);

    const finalZoom = t < 0.2 ? zoomOut : pulseZoom;

    if (meshRef.current) {
      meshRef.current.scale.set(
        scale[0] * finalZoom,
        scale[1] * finalZoom,
        1
      );
    }
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/** Logo Reveal Video HUD (plays progressively with scroll) */
/** Logo Reveal Video HUD (plays progressively with scroll) */
function LogoVideoHUD({ scroll }) {
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


/** CameraRig with scroll-controlled zoom */
function CameraRig({ scroll }) {
  const cam = useRef();

  useFrame(() => {
    const t = scroll.offset;

    if (cam.current) {
      // Camera slight zoom on scroll
      cam.current.position.z = 5 - 0.5 * smoothstepRange(t, 0, 1);
      cam.current.updateProjectionMatrix();
    }
  });

  return <PerspectiveCamera ref={cam} makeDefault position={[0, 0, 5]} />;
}

function Scene() {
  const scroll = useScroll();

  return (
    <>
      <VideoBackground scroll={scroll} />
      <LogoVideoHUD scroll={scroll} />
      <CameraRig scroll={scroll} />
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
