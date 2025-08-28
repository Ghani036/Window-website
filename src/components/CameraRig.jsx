import React from "react";
import { PerspectiveCamera } from "@react-three/drei";
import LogoHUD from "./LogoHUD";

export default function CameraRig() {
  return (
    <PerspectiveCamera makeDefault position={[0, 0, 5]}>
      <LogoHUD />
    </PerspectiveCamera>
  );
}
