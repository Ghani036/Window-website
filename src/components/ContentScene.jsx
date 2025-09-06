import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useVideoTexture, useAspect, Text } from "@react-three/drei";
import ParticleSystem from "./ParticleSystem";
import FloatingParticles from "./FloatingParticles";
import StarField from "./StarField";
import DustParticles from "./DustParticles";

// Content sections data
const CONTENT_SECTIONS = [
  {
    id: "thewindow",
    title: "THE WINDOW",
    content: "Welcome to The Window - where vision meets reality. We create immersive experiences that bridge the gap between imagination and innovation.",
    description: "The Window represents our gateway to new possibilities, where every project is a window into the future of digital experiences."
  },
  {
    id: "thefounder",
    title: "The Founder",
    content: "A window of collaboration is more than a moment, it’s a chance to pause time, connect, and create something that lasts forever.",
    description: "Hafid Maï, Founder & Creative Lead."
  },
  {
    id: "joinedforces",
    title: "Joined Forces",
    content: "Discover how we came together to create something extraordinary through collaboration and shared vision.",
    description: "When creative minds unite, magic happens. Our team represents the perfect fusion of art, technology, and storytelling."
  },
  {
    id: "thesystems",
    title: "The Systems",
    content: "Explore the sophisticated systems that power our solutions and enable seamless user experiences.",
    description: "Behind every great experience lies a robust system. Our technology stack ensures reliability, scalability, and innovation."
  },
  {
    id: "thelab",
    title: "THE LAB",
    content: "Step into our creative laboratory where ideas come to life through experimentation and innovation.",
    description: "The Lab is where we experiment, prototype, and push the boundaries of what's possible in digital experiences."
  },
  {
    id: "theartofstorytelling",
    title: "The Art of Storytelling",
    content: "Master the craft of compelling narrative and visual storytelling that captivates and engages audiences.",
    description: "Every great experience begins with a great story. We specialize in crafting narratives that resonate and inspire."
  },
  {
    id: "storyboard",
    title: "Story Board",
    content: "Plan and visualize your stories with our advanced storyboard tools and creative methodologies.",
    description: "From concept to execution, our storyboard process ensures every detail is carefully planned and beautifully executed."
  },
  {
    id: "digitalcollageart",
    title: "Digital Collage Art",
    content: "Create stunning digital collages that blend art and technology in innovative and unexpected ways.",
    description: "Our digital collage art combines traditional artistic principles with cutting-edge technology to create unique visual experiences."
  },
  {
    id: "fromsketchtodigitaltoai",
    title: "From Sketch to Digital to AI",
    content: "Transform your sketches into digital masterpieces with AI assistance and advanced creative tools.",
    description: "Witness the evolution of creativity as we guide you from initial sketches through digital transformation to AI-enhanced final products."
  },
  {
    id: "thechamber",
    title: "THE CHAMBER",
    content: "Enter The Chamber - a space for exclusive experiences and premium content that pushes creative boundaries.",
    description: "The Chamber represents our most exclusive and experimental work, reserved for those who seek the extraordinary."
  },
  {
    id: "artpiece",
    title: "Art Piece",
    content: "Discover unique art pieces that challenge conventional boundaries and redefine what's possible in digital art.",
    description: "Each art piece is a carefully crafted experience that combines artistic vision with technological innovation."
  },
  {
    id: "wearthemyth",
    title: "Wear the Myth",
    content: "Embody the stories and legends through wearable art and fashion that brings narratives to life.",
    description: "Wear the Myth transforms stories into tangible experiences through innovative wearable designs and interactive elements."
  },
  {
    id: "contact",
    title: "CONTACT",
    content: "",
    description: ""
  }
];

export default function ContentScene({ scroll, onSectionReached, currentSection, showContent, visibleSubs, isTransitioning }) {
  const { viewport } = useThree();
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [fadeIn, setFadeIn] = useState(0);
  const contentRef = useRef();

  // Use second background video for content sections
  const contentTexture = useVideoTexture("/videos/section-2-bg.mp4", {
    start: true,
    loop: true,
    muted: true,
    crossOrigin: "Anonymous",
  });

  const scale = useAspect(1920, 1080, 1);
  const videoMeshRef = useRef();
  const contentVideoRef = contentTexture.image; // Get the video element

  // Find current section data
  const currentSectionData = CONTENT_SECTIONS.find(section => section.id === currentSection) || CONTENT_SECTIONS[0];

  // Reset animation when section changes
  React.useEffect(() => {
    console.log("ContentScene - Section changed to:", currentSection, "isTransitioning:", isTransitioning);
    setAnimationProgress(0); // Always reset animation when section changes
  }, [currentSection, isTransitioning]);

  // Calculate visibility and animations based on scroll and menu clicks
  useFrame((state) => {
    if (!scroll) return;

    const progress = scroll.offset;

    // Let content video play naturally - no scroll control
    // Video will loop automatically

    // Simplified visibility logic - show content scene when needed
    const shouldShow = showContent || currentSection !== "thewindow";
    
    // Always show content when menu item is clicked or when not in thewindow section
    setIsVisible(shouldShow);
    setFadeIn(shouldShow ? 1 : 0);
    
    // Debug logging for content switching
    if (showContent && currentSection !== "thewindow") {
      console.log("ContentScene - Should show content for section:", currentSection, "fadeIn:", fadeIn, "animationProgress:", animationProgress);
    }

    // Don't show content scene if not needed
    if (!shouldShow) return;

    // Content changes are handled by App.jsx, not here
    // This prevents conflicts with the main scroll logic

    // Animate content appearance (faster during transitions)
    if (animationProgress < 1) {
      const speed = isTransitioning ? 0.08 : 0.03; // Increased speed for better responsiveness
      setAnimationProgress(prev => Math.min(prev + speed, 1));
    }

    // Add 3D floating animation
    if (contentRef.current) {
      contentRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      contentRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.01;
      contentRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.01;
    }

    // Add dynamic zoom effect to content video - Scene 2 behavior
    if (videoMeshRef.current) {
      const baseZoom = 1.0;
      // Subtle zoom effect for content scene
      const zoomEffect = 1.0 + (Math.sin(state.clock.elapsedTime * 0.2) * 0.02); // Gentle breathing effect
      videoMeshRef.current.scale.set(scale[0] * baseZoom * zoomEffect, scale[1] * baseZoom * zoomEffect, 1);
    }

    // Notify parent of section change
    if (onSectionReached && currentSection !== currentSectionData.id) {
      onSectionReached(currentSectionData.id);
    }
  });

  // Use useEffect to handle contact form visibility
  React.useEffect(() => {
    console.log("ContentScene - currentSection:", currentSection, "showContent:", showContent);
    if (currentSection === "contact") {
      console.log("Contact form selected - should be visible");
    }
  }, [currentSection, showContent]);

  // Content scene is always visible when shouldShow is true (checked above)

  return (
    <group ref={contentRef} position={[0, 0, 0]}>

      {/* Background Video - Second video for content sections */}
      <mesh ref={videoMeshRef} scale={scale} position={[0, 0, 0.9]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={contentTexture} toneMapped={false} transparent opacity={1} />
      </mesh>

      {/* Remove dark overlay to show particles clearly */}

      {/* Star Field for Content Section */}
      <StarField scroll={scroll} />

      {/* Particle Systems for Content Section */}
      <ParticleSystem
        count={1500}
        scroll={scroll}
        showContent={showContent}
        visibleSubs={visibleSubs}
        section="content"
      />
      <FloatingParticles 
        scroll={scroll} 
        showContent={showContent} 
        visibleSubs={visibleSubs}
        section="content"
      />
      
      {/* Dust Particles for Content Section */}
      <DustParticles
        scroll={scroll}
        showContent={showContent}
        visibleSubs={visibleSubs}
        section="content"
      />

      {/* Content Text Display (skip contact since it's handled by overlay) */}
      {currentSection !== "contact" && (
        <>
          {/* Title Text */}
          <Text
            position={[0, 0.3 + (1 - animationProgress) * 0.5, 0.94]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={viewport.width * 0.7}
            textAlign="center"
            fontFamily="Arial, sans-serif"
            opacity={animationProgress * fadeIn}
          >
            {currentSectionData.title}
          </Text>

          {/* Content Text */}
          <Text
            position={[0, 0 + (1 - animationProgress) * 0.3, 0.94]}
            fontSize={0.08}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
            maxWidth={viewport.width * 0.6}
            textAlign="center"
            fontFamily="Arial, sans-serif"
            opacity={animationProgress * 0.9 * fadeIn}
          >
            {currentSectionData.content}
          </Text>

          {/* Description Text */}
          <Text
            position={[0, -0.2 + (1 - animationProgress) * 0.2, 0.94]}
            fontSize={0.06}
            color="#aaaaaa"
            anchorX="center"
            anchorY="middle"
            maxWidth={viewport.width * 0.5}
            textAlign="center"
            fontFamily="Arial, sans-serif"
            opacity={animationProgress * 0.8 * fadeIn}
          >
            {currentSectionData.description}
          </Text>
        </>
      )}

      {/* Decorative Elements */}
      <mesh position={[-0.3, 0.4, 0.94]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6 * animationProgress * fadeIn} />
      </mesh>

      <mesh position={[0.3, 0.4, 0.94]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6 * animationProgress * fadeIn} />
      </mesh>

      <mesh position={[0, -0.4, 0.94]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6 * animationProgress * fadeIn} />
      </mesh>

      {/* Remove floating particles from content scene */}

    </group>
  );
}