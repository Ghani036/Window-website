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
      const progress = scroll.offset;
      const totalSubs = 9;
      
      // Track scroll direction for better detection
      const isScrollingUp = progress < lastScrollPosition.current;
      lastScrollPosition.current = progress;
      
      // Handle going back to first section when scrolling up
      // More responsive threshold: allow going back when scroll is in the first 30% of the scroll range
      // and user is actively scrolling up from content section
      if (progress < 0.3 && showContent && (isScrollingUp || progress < 0.1)) {
        onBackToFirstSection();
        return;
      }
      
      // Menu progression based on scroll
      // Once all items are visible (visibleSubs >= 9), keep them visible
      if (visibleSubs >= 9) {
        setVisibleSubs(9);
        // Auto-transition to content section when all menu items are visible and scrolled further
        if (!showContent && progress > 0.7) {
          setShowContent(true);
        }
        return;
      }
      
      // Improved scroll progression for smoother menu reveal
      const firstSceneProgress = Math.min(progress / 0.6, 1);
      const newVisibleSubs = Math.max(1, Math.floor(firstSceneProgress * totalSubs) + 1);
      
      setVisibleSubs(newVisibleSubs);
    };

    if (scroll && scroll.el) {
      scroll.el.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => scroll.el.removeEventListener("scroll", handleScroll);
    }
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

  // Debug state changes
  useEffect(() => {
    console.log("App state changed - currentSection:", currentSection, "showContent:", showContent, "isTransitioning:", isTransitioning);
  }, [currentSection, showContent, isTransitioning]);

  const handleMenuClick = (sectionId) => {
    console.log("=== MENU CLICK DEBUG ===");
    console.log("Menu clicked:", sectionId); // Debug log
    console.log("Current state - currentSection:", currentSection, "showContent:", showContent);
    
    // Start transition
    setIsTransitioning(true);
    
    // Change content immediately for better responsiveness
    setCurrentSection(sectionId);
    setShowContent(true);
    
    console.log("After setting - currentSection:", sectionId, "showContent: true");
    
    // End transition after a brief delay
    setTimeout(() => {
      setIsTransitioning(false);
      console.log("Transition ended - currentSection should be:", sectionId);
      console.log("=== END MENU CLICK DEBUG ===");
    }, 300);
    
    // For contact form, don't scroll - just show it
    if (sectionId === "contact") {
      console.log("Contact form selected - showing form");
      console.log("=== END MENU CLICK DEBUG ===");
      return;
    }
    
    // Scroll to show content section for other sections
    const scrollElement = document.querySelector('.scroll-container');
    if (scrollElement) {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight * 0.7, // Scroll to show content
        behavior: 'smooth'
      });
    }
  };

  const handleBackToFirstSection = () => {
    console.log("=== GOING BACK TO FIRST SECTION ===");
    setIsTransitioning(true);
    
    // Reset content state immediately for better responsiveness
    setCurrentSection("thewindow");
    setShowContent(false);
    
    setTimeout(() => {
      setIsTransitioning(false);
      console.log("=== BACK TO FIRST SECTION COMPLETE ===");
      
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
          <ScrollControls pages={15} damping={0.2} distance={1} horizontal={false}>
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