import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import Scene from "./components/Scene";
import ContentScene from "./components/ContentScene";
import Menu from "./components/Menu";
import ContactForm from "./components/ContactForm";

function Experience({ setVisibleSubs, setCurrentSection, currentSection, showContent, visibleSubs, onBackToFirstSection, isTransitioning, setShowContent }) {
  const scroll = useScroll();
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (isTransitioning) return;
      
      const progress = scroll.offset;
      const totalSubs = 9;
      
      // Track scroll direction
      const isScrollingUp = progress < lastScrollPosition.current;
      lastScrollPosition.current = progress;
      
      console.log("Scroll progress:", progress, "showContent:", showContent, "currentSection:", currentSection);
      
      // Simple logic: Scene 1 (0-60%), Scene 2 (60-100%)
      
      // Scene 1: Logo + Menu progression (0% to 60%) - ONLY if not already in Scene 2
      if (progress <= 0.6 && !showContent) {
        // Progressive menu reveal
        const menuProgress = Math.min(progress / 0.6, 1);
        const newVisibleSubs = Math.max(1, Math.floor(menuProgress * totalSubs) + 1);
        setVisibleSubs(Math.min(newVisibleSubs, totalSubs));
        return;
      }
      
      // Scene 2: Content sections (60% to 100%)
      if (progress > 0.6) {
        // Force Scene 2 state if all menu items are visible
        if (!showContent && visibleSubs >= totalSubs) {
          setShowContent(true);
          setCurrentSection("thefounder");
        }
        
        // Content switching logic (only if in Scene 2)
        if (showContent) {
          const contentSections = ["thefounder", "joinedforces", "thesystems", "thelab", "theartofstorytelling", "storyboard", "digitalcollageart", "fromsketchtodigitaltoai", "thechamber", "artpiece", "wearthemyth"];
          const contentProgress = (progress - 0.6) / 0.4; // 0.6 to 1.0 mapped to 0 to 1
          const sectionIndex = Math.floor(contentProgress * contentSections.length);
          const targetSection = contentSections[Math.min(sectionIndex, contentSections.length - 1)];
          
          if (targetSection && currentSection !== targetSection && currentSection !== "contact") {
            console.log("Scene 2: Switching to section:", targetSection);
            setCurrentSection(targetSection);
          }
        }
        
        // Back to Scene 1 only if scrolling up to very beginning
        if (progress < 0.1 && isScrollingUp && showContent) {
          console.log("Going back to Scene 1");
          onBackToFirstSection();
          return;
        }
      }
    };

    if (scroll && scroll.el) {
      scroll.el.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => scroll.el.removeEventListener("scroll", handleScroll);
    }
  }, [scroll, setVisibleSubs, visibleSubs, showContent, onBackToFirstSection, currentSection, isTransitioning, setShowContent, setCurrentSection]);


  const handleSectionReached = (sectionId) => {
    setCurrentSection(sectionId);
  };

  return (
    <>
      {!showContent && <Scene showContent={showContent} visibleSubs={visibleSubs} />}
      {showContent && <ContentScene scroll={scroll} onSectionReached={handleSectionReached} currentSection={currentSection} showContent={showContent} visibleSubs={visibleSubs} isTransitioning={isTransitioning} />}
    </>
  );
}

export default function App() {
  const [visibleSubs, setVisibleSubs] = useState(0);
  const [currentSection, setCurrentSection] = useState("thewindow");
  const [showContent, setShowContent] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Debug state changes
  useEffect(() => {
    console.log("App state changed - currentSection:", currentSection, "showContent:", showContent, "isTransitioning:", isTransitioning);
  }, [currentSection, showContent, isTransitioning]);

  const handleMenuClick = (sectionId) => {
    console.log("Menu clicked:", sectionId);
    
    // For contact form
    if (sectionId === "contact") {
      setCurrentSection(sectionId);
      setShowContent(true);
      return;
    }
    
    // For content sections - go to Scene 2
    setIsTransitioning(true);
    setShowContent(true);
    setCurrentSection(sectionId);
    setVisibleSubs(9);
    
    // Calculate scroll position in Scene 2 range (60% to 100%)
    const contentSections = ["thefounder", "joinedforces", "thesystems", "thelab", "theartofstorytelling", "storyboard", "digitalcollageart", "fromsketchtodigitaltoai", "thechamber", "artpiece", "wearthemyth"];
    const sectionIndex = contentSections.indexOf(sectionId);
    
    const scrollElement = document.querySelector('.scroll-container');
    if (scrollElement) {
      let targetScrollPercent = 0.65; // Default to early Scene 2
      
      if (sectionIndex >= 0) {
        // Map to 60% - 100% range
        targetScrollPercent = 0.6 + (sectionIndex / contentSections.length) * 0.4;
      }
      
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight * targetScrollPercent,
        behavior: 'smooth'
      });
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const handleBackToFirstSection = () => {
    console.log("=== GOING BACK TO FIRST SECTION ===");
    setIsTransitioning(true);
    
    // Reset states to Scene 1
    setCurrentSection("thewindow");
    setShowContent(false);
    setVisibleSubs(9); // Keep all menu items visible
    
    // Quick transition without auto-scroll
    setTimeout(() => {
      setIsTransitioning(false);
      console.log("=== BACK TO FIRST SECTION COMPLETE ===");
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

      {/* Contact Form Overlay - Render outside Three.js scene */}
      {currentSection === "contact" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl mx-4 relative">
            {/* Close button */}
            <button
              onClick={() => {
                setCurrentSection("thewindow");
                setShowContent(false);
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
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 3]} className="absolute top-0 left-0 w-full h-full">
          <ScrollControls pages={15} damping={0.05} distance={1} horizontal={false}>
            <Experience 
              setVisibleSubs={setVisibleSubs} 
              setCurrentSection={setCurrentSection}
              currentSection={currentSection}
              showContent={showContent}
              visibleSubs={visibleSubs}
              onBackToFirstSection={handleBackToFirstSection}
              isTransitioning={isTransitioning}
              setShowContent={setShowContent}
            />
          </ScrollControls>
        </Canvas>
      </div>

    </div>
  );
}