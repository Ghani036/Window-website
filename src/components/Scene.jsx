// Scene.jsx
import React from "react";
import { useScroll, Preload } from "@react-three/drei"; // ✅ removed TextureLoader
import VideoBackground from "./VideoBackground";
import LogoVideoHUD from "./LogoVideoHUD";
import CameraRig from "./CameraRig";
import StarField from "./StarField";


export default function Scene() {
  const scroll = useScroll();

  return (
    <>
      <VideoBackground scroll={scroll} />
      <LogoVideoHUD scroll={scroll} />
      <CameraRig scroll={scroll} />
      <StarField scroll={scroll} />
      <Preload all />
    </>
  );
}
