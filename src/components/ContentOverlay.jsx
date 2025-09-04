import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ContentOverlay({ isVisible, sectionId, onClose }) {
  const [currentSection, setCurrentSection] = useState(null);

  useEffect(() => {
    if (sectionId) {
      const section = CONTENT_SECTIONS.find(s => s.id === sectionId);
      setCurrentSection(section);
    }
  }, [sectionId]);

  if (!isVisible || !currentSection) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed  inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background overlay */}
        <motion.div
          className="absolute inset-0 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Content container */}
        <motion.div
          className="relative w-full h-screen max-w-4xl mx-auto px-8 text-center z-10"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Video background */}
          <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videos/section-2-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-12">
            <motion.h1
              className="text-6xl md:text-8xl font-avenir font-bold text-white mb-8 tracking-wider"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {currentSection.title}
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {currentSection.content}
            </motion.p>

            <motion.p
              className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {currentSection.description}
            </motion.p>

            {/* Close button */}
            <motion.button
              className="mt-12 px-8 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              onClick={onClose}
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
