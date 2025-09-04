import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import Scene from "./components/Scene";
import ContentScene from "./components/ContentScene";
import Menu from "./components/Menu";
import ContentPage from "./components/ContentPage";

function Experience({ setVisibleSubs, setCurrentSection }) {
  const scroll = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const progress = scroll.offset;
      const totalSubs = 9;
      // Fix menu progression: show items progressively as we scroll through first scene
      // First scene should be about 1.5+ pages (15% of 15 pages)
      const firstSceneProgress = Math.min(progress / 0.15, 1); // Normalize to 0-1 for first scene
      const newVisibleSubs = Math.max(1, Math.floor(firstSceneProgress * totalSubs) + 1);
      
      setVisibleSubs(newVisibleSubs);
    };

    scroll.el.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => scroll.el.removeEventListener("scroll", handleScroll);
  }, [scroll, setVisibleSubs]);

  const handleSectionReached = (sectionId) => {
    setCurrentSection(sectionId);
  };

  return (
    <>
      <Scene />
      <ContentScene scroll={scroll} onSectionReached={handleSectionReached} />
    </>
  );
}

export default function App() {
  const [visibleSubs, setVisibleSubs] = useState(0);
  const [currentSection, setCurrentSection] = useState("thewindow");

  const MENU_OFFSET = 96; // px offset for fixed menu if needed

  const handleMenuClick = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetTop = rect.top + window.scrollY - MENU_OFFSET;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  return (
    <div className="relative w-screen min-h-screen custom-bg">
      <Menu 
        visibleSubs={visibleSubs} 
        onMenuClick={handleMenuClick}
        currentSection={currentSection}
      />

      <div className="relative w-full h-screen">
        <div className="bg-black h-screen w-screen absolute" />
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 3]} className="absolute top-0 left-0 w-full h-full">
          <ScrollControls pages={15} damping={0.3}>
            <Experience 
              setVisibleSubs={setVisibleSubs} 
              setCurrentSection={setCurrentSection}
            />
          </ScrollControls>
        </Canvas>
      </div>

      <ContentPage />
    </div>
  );
}
