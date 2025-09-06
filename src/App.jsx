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
      if (progress < 0.3 && showContent && isScrollingUp) {
        onBackToFirstSection();
        return;
      }
      
      // Menu progression based on scroll
      // Once all items are visible (visibleSubs >= 9), keep them visible
      if (visibleSubs >= 9) {
        setVisibleSubs(9);
        // Auto-transition to content section when all menu items are visible and scrolled further
        if (!showContent && progress > 0.6) {
          setShowContent(true);
        }
        // Don't return here - allow further scrolling for content switching
      }
      
      // Handle content section switching in second scene
      if (showContent && progress > 0.5) {
        // Map scroll progress to content sections
        const contentSections = ["thefounder", "joinedforces", "thesystems", "thelab", "theartofstorytelling", "storyboard", "digitalcollageart", "fromsketchtodigitaltoai", "thechamber", "artpiece", "wearthemyth"];
        const contentProgress = Math.max(0, (progress - 0.5) / 0.5); // 0.5 to 1.0 mapped to 0 to 1
        const sectionIndex = Math.floor(contentProgress * contentSections.length);
        const targetSection = contentSections[Math.min(sectionIndex, contentSections.length - 1)];
        
        if (targetSection && currentSection !== targetSection && currentSection !== "contact") {
          console.log("Auto-switching to section:", targetSection, "at progress:", progress);
          setCurrentSection(targetSection);
        }
      }
      
      // Improved scroll progression for smoother menu reveal (only in first scene)
      if (!showContent) {
        // Logo appears first, then menu items step by step
        const firstSceneProgress = Math.min(progress / 0.6, 1); // Extended range for more gradual reveal
        const newVisibleSubs = Math.max(1, Math.floor(firstSceneProgress * totalSubs) + 1);
        setVisibleSubs(newVisibleSubs);
      }
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
    // Find the scroll progress that corresponds to this section
    const contentSections = ["thefounder", "joinedforces", "thesystems", "thelab", "theartofstorytelling", "storyboard", "digitalcollageart", "fromsketchtodigitaltoai", "thechamber", "artpiece", "wearthemyth"];
    const sectionIndex = contentSections.indexOf(sectionId);
    
    const scrollElement = document.querySelector('.scroll-container');
    if (scrollElement) {
      let targetScrollPercent = 0.7; // Default to start of content section
      
      if (sectionIndex >= 0) {
        // Calculate specific scroll position for this section
        targetScrollPercent = 0.5 + (sectionIndex / contentSections.length) * 0.5;
      }
      
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight * targetScrollPercent,
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
          <ScrollControls pages={20} damping={0.03} distance={1} horizontal={false}>
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