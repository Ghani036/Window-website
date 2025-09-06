import React from "react";
import { Preload, useScroll } from "@react-three/drei";

import CameraRig from "./CameraRig";
import StarField from "./StarField";
import LogoVideoHUD from "./LogoVideoHUD";

export default function Scene({ showContent, visibleSubs }) {
  const scroll = useScroll();

  return (
    <>
      <CameraRig scroll={scroll} />
      <StarField scroll={scroll} />
      {/* Logo Reveal for Scene 1 */}
      <LogoVideoHUD scroll={scroll} showContent={showContent} />
      
      <Preload all />
    </>
  );
}


