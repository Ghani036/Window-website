import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import Scene from "./components/Scene";
import Menu from "./components/Menu";

function Experience({ setVisibleSubs }) {
  const scroll = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      // Get scroll progress (0 → 1)
      const progress = scroll.offset;

      // Map scroll progress to number of visible submenus
      // Example: If total subs = 9, show gradually
      const totalSubs = 9; // count all sub-items in Menu
      const newVisibleSubs = Math.floor(progress * totalSubs) + 1;

      setVisibleSubs(newVisibleSubs);
    };

    // Listen every frame
    scroll.el.addEventListener("scroll", handleScroll);

    return () => scroll.el.removeEventListener("scroll", handleScroll);
  }, [scroll, setVisibleSubs]);

  return <Scene />;
}

export default function App() {
  const [visibleSubs, setVisibleSubs] = useState(0);

  return (
    <div className="w-screen  h-screen relative custom-bg  ">

      <div className=" bg-black/50 h-screen w-screen absolute " />
      <Menu visibleSubs={visibleSubs} />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 3]}
        className="absolute  top-0 left-0 w-full h-full"
      >
        <ScrollControls pages={15} damping={0.3}>
          <Experience setVisibleSubs={setVisibleSubs} />
        </ScrollControls>
      </Canvas>

    </div>
  );
}
