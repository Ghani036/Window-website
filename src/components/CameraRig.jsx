import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { smoothstepRange } from "../utils/smoothstep";

export default function CameraRig({ scroll }) {
  const cam = useRef();

  useFrame(() => {
    const t = scroll.offset;

    if (cam.current) {
      cam.current.position.z = 5 - 0.5 * smoothstepRange(t, 0, 1);
      cam.current.updateProjectionMatrix();
    }
  });

  return <PerspectiveCamera ref={cam} makeDefault position={[0, 0, 5]} />;
}
