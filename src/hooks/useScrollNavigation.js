import { useRef, useCallback } from 'react';

// Content sections mapping - must match the order in ContentScene
const CONTENT_SECTIONS = [
  "thewindow",
  "thefounder", 
  "joinedforces",
  "thesystems",
  "thelab",
  "theartofstorytelling",
  "storyboard",
  "digitalcollageart",
  "fromsketchtodigitaltoai",
  "thechamber",
  "artpiece",
  "wearthemyth",
  "contact"
];

export const useScrollNavigation = () => {
  const scrollRef = useRef(null);

  const navigateToSection = useCallback((sectionId) => {
    if (!scrollRef.current) return;
    
    const sectionIndex = CONTENT_SECTIONS.indexOf(sectionId);
    if (sectionIndex === -1) {
      console.warn(`Section "${sectionId}" not found`);
      return;
    }
    
    // Calculate scroll position (0 to 1)
    const scrollPosition = sectionIndex / (CONTENT_SECTIONS.length - 1);
    
    // Use the scroll object's scrollTo method
    if (scrollRef.current.scrollTo) {
      scrollRef.current.scrollTo(scrollPosition);
    } else {
      // Fallback to DOM scrolling
      const scrollElement = scrollRef.current.el;
      if (scrollElement) {
        const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
        const targetScroll = scrollPosition * maxScroll;
        
        scrollElement.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  const setScrollRef = useCallback((ref) => {
    scrollRef.current = ref;
  }, []);

  return {
    navigateToSection,
    setScrollRef
  };
};