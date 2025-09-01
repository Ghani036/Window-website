import React from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import Scene from "./components/Scene";

export default function App() {
  return (
    <div className="w-screen h-screen relative ">
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
