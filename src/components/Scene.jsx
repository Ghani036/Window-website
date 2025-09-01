import React from "react";
import { useScroll, Preload } from "@react-three/drei";
import VideoBackground from "./VideoBackground";
import LogoVideoHUD from "./LogoVideoHUD";
import CameraRig from "./CameraRig";

export default function Scene() {
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
