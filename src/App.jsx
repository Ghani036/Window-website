import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import Scene from "./components/Scene";
import Menu from "./components/Menu";
import ContactForm from "./components/ContactForm";

function Experience({ setVisibleSubs, setCurrentSection, currentSection, visibleSubs, isTransitioning }) {
  const scroll = useScroll();
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (isTransitioning) return;
      const progress = scroll.offset;
      const totalSubs = 9;

      const isScrollingUp = progress < lastScrollPosition.current;
      const scrollDelta = Math.abs(progress - lastScrollPosition.current);
      lastScrollPosition.current = progress;

      console.log("Scroll progress:", progress, "currentSection:", currentSection);

      // Progressive menu reveal across entire scroll range since only one scene remains
      const menuProgress = Math.min(progress / 1.0, 1);
      const newVisibleSubs = Math.max(1, Math.floor(menuProgress * totalSubs) + 1);
      setVisibleSubs(Math.min(newVisibleSubs, totalSubs));
    };

    if (scroll && scroll.el) {
      scroll.el.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => scroll.el.removeEventListener("scroll", handleScroll);
    }
  }, [scroll, setVisibleSubs, visibleSubs, currentSection, isTransitioning, setCurrentSection]);


  const handleSectionReached = (sectionId) => {
    setCurrentSection(sectionId);
  };

  return (
    <>
      <Scene showContent={false} visibleSubs={visibleSubs} />
    </>
  );
}

export default function App() {
  const [visibleSubs, setVisibleSubs] = useState(0);
  const [currentSection, setCurrentSection] = useState("thewindow");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Debug state changes
  useEffect(() => {
    console.log("App state changed - currentSection:", currentSection, "isTransitioning:", isTransitioning);
  }, [currentSection, isTransitioning]);

  const handleMenuClick = (sectionId) => {
    console.log("Menu clicked:", sectionId);
    // In single-scene mode, only keep contact overlay, otherwise ignore content routing
    if (sectionId === "contact") {
      setCurrentSection(sectionId);
      return;
    }
    setCurrentSection("thewindow");
  };

  const handleBackToFirstSection = () => {
    setCurrentSection("thewindow");
  };

  return (
    <div className="relative w-screen min-h-screen custom-bg">
      <Menu 
        visibleSubs={visibleSubs} 
        onMenuClick={handleMenuClick}
        currentSection={currentSection}
        isTransitioning={isTransitioning}
      />

      {/* Contact Form Overlay - Render outside Three.js scene */}
      {currentSection === "contact" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl mx-4 relative">
            {/* Close button */}
            <button
              onClick={() => {
                setCurrentSection("thewindow");
              }}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 z-10"
            >
              ×
            </button>
            <ContactForm />
          </div>
        </div>
      )}

      <div className="relative w-full h-screen scroll-container">
        {/* Spline background inside scene container */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <spline-viewer
            url="https://prod.spline.design/81Udm-xn90eNI45u/scene.splinecode"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
          ></spline-viewer>
        </div>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 3]} className="absolute top-0 left-0 w-full h-full z-10">
          <ScrollControls pages={6} damping={0.05} distance={1} horizontal={false}>
            <Experience 
              setVisibleSubs={setVisibleSubs} 
              setCurrentSection={setCurrentSection}
              currentSection={currentSection}
              visibleSubs={visibleSubs}
              isTransitioning={isTransitioning}
            />
          </ScrollControls>
        </Canvas>
      </div>

    </div>
  );
}