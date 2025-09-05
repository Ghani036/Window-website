import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import Scene from "./components/Scene";
import ContentScene from "./components/ContentScene";
import Menu from "./components/Menu";

function Experience({ setVisibleSubs, setCurrentSection, currentSection, showContent, visibleSubs, onBackToFirstSection, isTransitioning }) {
  const scroll = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const progress = scroll.offset;
      const totalSubs = 9;
      n
      // Handle going back to first section when scrolling up
      if (progress < 0.05 && showContent) {
        onBackToFirstSection();
        return;
      }
      
      // Menu progression based on scroll
      // Once all items are visible (visibleSubs >= 9), keep them visible
      if (visibleSubs >= 9) {
        setVisibleSubs(9);
        return;
      }
      
      const firstSceneProgress = Math.min(progress / 0.5, 1);
      const newVisibleSubs = Math.max(1, Math.floor(firstSceneProgress * totalSubs) + 1);
      
      setVisibleSubs(newVisibleSubs);
    };

    scroll.el.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => scroll.el.removeEventListener("scroll", handleScroll);
  }, [scroll, setVisibleSubs, visibleSubs, showContent, onBackToFirstSection]);

  const handleSectionReached = (sectionId) => {
    setCurrentSection(sectionId);
  };

  return (
    <>
      <Scene showContent={showContent} visibleSubs={visibleSubs} />
      <ContentScene scroll={scroll} onSectionReached={handleSectionReached} currentSection={currentSection} showContent={showContent} visibleSubs={visibleSubs} isTransitioning={isTransitioning} />
    </>
  );
}

export default function App() {
  const [visibleSubs, setVisibleSubs] = useState(0);
  const [currentSection, setCurrentSection] = useState("thewindow");
  const [showContent, setShowContent] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleMenuClick = (sectionId) => {
    // Start transition
    setIsTransitioning(true);
    
    // Change content after a brief delay for smooth transition
    setTimeout(() => {
      setCurrentSection(sectionId);
      setShowContent(true);
      setIsTransitioning(false);
      
      // Scroll to show content section
      const scrollElement = document.querySelector('.scroll-container');
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight * 0.6, // Scroll to show content
          behavior: 'smooth'
        });
      }
    }, 200); // 200ms transition delay
  };

  const handleBackToFirstSection = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentSection("thewindow");
      setShowContent(false);
      setIsTransitioning(false);
      
      // Scroll back to top
      const scrollElement = document.querySelector('.scroll-container');
      if (scrollElement) {
        scrollElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 200);
  };

  return (
    <div className="relative w-screen min-h-screen custom-bg">
      <Menu 
        visibleSubs={visibleSubs} 
        onMenuClick={handleMenuClick}
        currentSection={currentSection}
        isTransitioning={isTransitioning}
      />

      <div className="relative w-full h-screen scroll-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 3]} className="absolute top-0 left-0 w-full h-full">
          <ScrollControls pages={15} damping={0.3}>
            <Experience 
              setVisibleSubs={setVisibleSubs} 
              setCurrentSection={setCurrentSection}
              currentSection={currentSection}
              showContent={showContent}
              visibleSubs={visibleSubs}
              onBackToFirstSection={handleBackToFirstSection}
              isTransitioning={isTransitioning}
            />
          </ScrollControls>
        </Canvas>
      </div>
    </div>
  );
}