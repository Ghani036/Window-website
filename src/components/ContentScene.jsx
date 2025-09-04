import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useVideoTexture, useAspect, Text } from "@react-three/drei";

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
    content: "Meet the visionary behind The Window's innovative approach to digital storytelling and immersive experiences.",
    description: "Our founder brings years of experience in creative direction and technological innovation, driving our mission to push boundaries."
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
    content: "Get in touch with us and send us some good gifts. We'd love to hear from you and collaborate on amazing projects.",
    description: "Ready to start your next project? Contact us and let's create something extraordinary together."
  }
];

export default function ContentScene({ scroll, targetSection, onSectionReached }) {
  const { viewport } = useThree();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [fadeIn, setFadeIn] = useState(0);
  const contentRef = useRef();
  const titleRef = useRef();
  const contentTextRef = useRef();
  const descriptionRef = useRef();

  // Use different video for content background
  const contentTexture = useVideoTexture("/videos/section-2-bg.mp4", {
    start: true,
    loop: true,
    muted: true,
    crossOrigin: "Anonymous",
  });

  const scale = useAspect(1920, 1080, 1);
  const videoMeshRef = useRef();

  // Calculate which section should be active based on scroll
  useFrame((state) => {
    if (!scroll) return;
    
    const progress = scroll.offset;
    
    // Show content scene after the first section (thewindow) - around 1 page scroll
    // This ensures smooth transition from first scene to content sections
    const shouldShow = progress > 0.067; // Show after 6.7% scroll (1 page of 15)
    setIsVisible(shouldShow);
    
    // Smooth fade in effect
    if (shouldShow) {
      const fadeProgress = Math.min(1, (progress - 0.067) / 0.02); // Fade in over 2% scroll
      setFadeIn(fadeProgress);
    } else {
      setFadeIn(0);
    }
    
    if (!shouldShow) return;
    
    // Adjust progress to start from 0 when content becomes visible
    const adjustedProgress = Math.max(0, (progress - 0.067) / 0.933);
    const sectionIndex = Math.floor(adjustedProgress * CONTENT_SECTIONS.length);
    const clampedIndex = Math.min(sectionIndex, CONTENT_SECTIONS.length - 1);
    
    if (clampedIndex !== currentSectionIndex) {
      setCurrentSectionIndex(clampedIndex);
      setAnimationProgress(0); // Reset animation when section changes
      if (onSectionReached) {
        onSectionReached(CONTENT_SECTIONS[clampedIndex].id);
      }
    }

    // Animate content appearance
    if (animationProgress < 1) {
      setAnimationProgress(prev => Math.min(prev + 0.02, 1));
    }

    // Add subtle floating animation
    if (contentRef.current) {
      contentRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }

    // Animate video background
    if (videoMeshRef.current) {
      const t = adjustedProgress;
      const zoom = 1.0 + 0.1 * Math.sin(t * Math.PI * 2);
      videoMeshRef.current.scale.set(scale[0] * zoom, scale[1] * zoom, 1);
    }
  });

  const currentSection = CONTENT_SECTIONS[currentSectionIndex];

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <group ref={contentRef} position={[0, 0, 0.5]}>
      {/* Content Background Video - Second background video for content sections */}
      <mesh ref={videoMeshRef} scale={scale} position={[0, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={contentTexture} toneMapped={false} transparent opacity={fadeIn} />
      </mesh>

      {/* Dark overlay for content sections */}
      <mesh scale={scale} position={[0, 0, 0.01]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="black" transparent opacity={0.3 * fadeIn} />
      </mesh>

      {/* Content Overlay */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[viewport.width * 0.8, viewport.height * 0.6]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.6 * animationProgress * fadeIn}
        />
      </mesh>

      {/* Content Text */}
      <Text
        ref={titleRef}
        position={[0, 0.3 + (1 - animationProgress) * 0.5, 0.02]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/src/assets/fonts/avenir.woff2"
        maxWidth={viewport.width * 0.7}
        textAlign="center"
        fontFamily="Avenir, sans-serif"
        opacity={animationProgress * fadeIn}
      >
        {currentSection.title}
      </Text>

      <Text
        ref={contentTextRef}
        position={[0, 0 + (1 - animationProgress) * 0.3, 0.02]}
        fontSize={0.08}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        font="/src/assets/fonts/avenir.woff2"
        maxWidth={viewport.width * 0.6}
        textAlign="center"
        fontFamily="Avenir, sans-serif"
        opacity={animationProgress * 0.9 * fadeIn}
      >
        {currentSection.content}
      </Text>

      <Text
        ref={descriptionRef}
        position={[0, -0.2 + (1 - animationProgress) * 0.2, 0.02]}
        fontSize={0.06}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        font="/src/assets/fonts/avenir.woff2"
        maxWidth={viewport.width * 0.5}
        textAlign="center"
        fontFamily="Avenir, sans-serif"
        opacity={animationProgress * 0.8 * fadeIn}
      >
        {currentSection.description}
      </Text>

      {/* Decorative elements */}
      <mesh position={[-0.3, 0.4, 0.02]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6 * animationProgress * fadeIn} />
      </mesh>
      
      <mesh position={[0.3, 0.4, 0.02]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6 * animationProgress * fadeIn} />
      </mesh>

      <mesh position={[0, -0.4, 0.02]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6 * animationProgress * fadeIn} />
      </mesh>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 0.5 + 0.02
          ]}
        >
          <sphereGeometry args={[0.005, 4, 4]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.3 * animationProgress * fadeIn} 
          />
        </mesh>
      ))}
    </group>
  );
}