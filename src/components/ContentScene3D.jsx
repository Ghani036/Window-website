import React from "react";
import { Preload, useScroll } from "@react-three/drei";

import VideoBackground from "./VideoBackground";
import LogoVideoHUD from "./LogoVideoHUD";
import CameraRig from "./CameraRig";
import StarField from "./StarField";

export default function ContentScene3D() {
  const scroll = useScroll();

  return (
    <>
      <VideoBackground scroll={scroll} />
      <CameraRig scroll={scroll} />
      <StarField scroll={scroll} />
      <Preload all />
    </>
  );
}