import React from "react";
import { Preload, useScroll } from "@react-three/drei";


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
