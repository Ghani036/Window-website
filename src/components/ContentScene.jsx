import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useVideoTexture, useAspect, Text, Html } from "@react-three/drei";
import ParticleSystem from "./ParticleSystem";
import FloatingParticles from "./FloatingParticles";
import StarField from "./StarField";
import DustParticles from "./DustParticles";
import ContactForm from "./ContactForm";

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
    if (isTransitioning) {
      setAnimationProgress(0);
    }
  }, [currentSection, isTransitioning]);

  // Calculate visibility and animations based on scroll and menu clicks
  useFrame((state) => {
    if (!scroll) return;

    const progress = scroll.offset;

    // Control content video progress based on scroll (improved synchronization)
    if (contentVideoRef && contentVideoRef.readyState >= 2 && contentVideoRef.duration) {
      // Map scroll progress to video progress (0 to 0.5 of video duration for better effect)
      const videoProgress = Math.min(progress * 0.5, 0.5);
      contentVideoRef.currentTime = contentVideoRef.duration * videoProgress;
    }

    // Show content scene when:
    // 1. Menu item is clicked (showContent = true) - PRIORITY
    // 2. All menu items are visible (visibleSubs >= 9)
    // 3. Scrolled past 50% (improved threshold)
    // 4. Contact form is selected
    const shouldShow = showContent || visibleSubs >= 9 || progress > 0.5 || currentSection === "contact";
    
    // Only update visibility if not contact form (to avoid conflicts)
    if (currentSection !== "contact") {
      setIsVisible(shouldShow);
    } else {
      // Force visibility for contact form
      setIsVisible(true);
    }

    // Smooth fade in effect
    if (currentSection === "contact") {
      // Contact form is always fully visible
      setFadeIn(1);
    } else if (shouldShow) {
      if (showContent) {
        // If menu item was clicked, show immediately
        setFadeIn(1);
      } else if (visibleSubs >= 9) {
        // If all menu items are visible, show content
        setFadeIn(1);
      } else {
        // If scrolling, fade in gradually
        const fadeProgress = Math.min(1, (progress - 0.5) / 0.2);
        setFadeIn(fadeProgress);
      }
    } else {
      setFadeIn(0);
    }

    // Don't return early if contact form is selected
    if (!shouldShow && currentSection !== "contact") return;

    // Content changes are handled by App.jsx, not here
    // This prevents conflicts with the main scroll logic

    // Animate content appearance (faster during transitions)
    if (animationProgress < 1) {
      const speed = isTransitioning ? 0.05 : 0.02;
      setAnimationProgress(prev => Math.min(prev + speed, 1));
    }

    // Add 3D floating animation
    if (contentRef.current) {
      contentRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      contentRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.01;
      contentRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.01;
    }

    // Keep video background stable
    if (videoMeshRef.current) {
      videoMeshRef.current.scale.set(scale[0], scale[1], 1);
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

  // Always render contact form when selected, otherwise use normal visibility logic
  if (currentSection === "contact") {
    // Contact form is always visible when selected
    console.log("Contact form should be visible - rendering");
  } else if (!isVisible) {
    return null;
  }

  return (
    <group ref={contentRef} position={[0, 0, 0]}>

      {/* Background Video - Second video for content sections */}
      <mesh ref={videoMeshRef} scale={scale} position={[0, 0, 0.9]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={contentTexture} toneMapped={false} transparent opacity={currentSection === "contact" ? 1 : fadeIn} />
      </mesh>

      {/* Black Overlay Layer */}
      <mesh scale={scale} position={[0, 0, 0.91]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="black" transparent opacity={currentSection === "contact" ? 0.6 : 0.6 * fadeIn} />
      </mesh>

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



      {/* Conditional Content Rendering */}
      {currentSection === "contact" ? (
        // Contact Form
        <>
          {console.log("Rendering contact form - currentSection:", currentSection, "isVisible:", isVisible, "fadeIn:", fadeIn)}
          
          {/* Test: Simple text to verify contact form is rendering */}
         
          
          {/* Test: Render contact form directly without Html wrapper */}
          <Html
            position={[0, 0, 0.98]}
            transform
            style={{
              width: viewport.width * 0.6,
              height: viewport.height * 0.8,
              pointerEvents: 'auto',
              opacity: 1,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '2px solid white',
              borderRadius: '10px',
              padding: '20px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>CONTACT FORM</h1>
              <p style={{ fontSize: '16px', textAlign: 'center' }}>
                This is a test to see if the Html component is working.
                If you can see this, the Html component is rendering correctly.
              </p>
              <ContactForm />
            </div>
          </Html>
        </>
      ) : (
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

      {/* Floating Particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 2.5,
            (Math.random() - 0.5) * 2.5,
            (Math.random() - 0.5) * 0.8 + 0.95
          ]}
        >
          <sphereGeometry args={[0.003 + Math.random() * 0.004, 6, 6]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#fff" : "#fff"}
            transparent
            opacity={0.4 * animationProgress * fadeIn}
          />
        </mesh>
      ))}

    </group>
  );
}