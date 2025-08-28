import React from "react";
import { Preload } from "@react-three/drei";
import VideoBackground from "./VideoBackground";
import CameraRig from "./CameraRig";

export default function Scene({videoPath}) {
  return (
    <>
      <VideoBackground video={videoPath} />
      <CameraRig />
      <Preload all />
    </>
  );
}
