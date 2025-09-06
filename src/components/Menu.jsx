import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import dustAnimation from "../assets/lottie/dust.json";

const MENUS = [
  { name: "THE WINDOW", sub: ["The Founder", "Joined Forces", "The Systems"] },
  {
    name: "THE LAB",
    sub: [
      "The Art of Storytelling",
      "Story Board",
      "Digital Collage Art",
      "From Sketch to Digital to AI",
    ],
  },
  { name: "THE CHAMBER", sub: ["Art Piece", "Wear the myth"] },
  { name: "CONTACT", sub: [] },
];

export default function Menu({ visibleSubs, onMenuClick, currentSection, isTransitioning }) {
  let subCounter = 0;

  const [menuOpen, setMenuOpen] = useState(true);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleClick = (key) => {
    console.log("Menu - handleClick called with key:", key);
    if (onMenuClick) {
      onMenuClick(key);
    }
    
    // Close menu on mobile after clicking
    if (window.innerWidth < 768) {
      setMenuOpen(false);
    }
  };

  // Single-scene mode: reveal up to 9 subs gradually based on visibleSubs
  const effectiveVisibleSubs = Math.max(1, Math.min(visibleSubs, 9));

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden block absolute left-4 top-10 z-50">
        <img 
          src="/assets/menu.png" 
          alt="Menu"
          className="h-8 w-8 cursor-pointer"
          onClick={toggleMenu}
        />
      </div>

      <motion.div
        className={`
          fixed font-semibold md:top-0
          top-24
          left-0 w-full 
          md:left-1/4 md:w-1/2 
          mx-auto 
          flex flex-col md:flex-row 
          md:justify-between 
          items-start md:items-center 
          md:p-4 z-50 gap-4
          ml-4 md:ml-0 mt-4 md:mt-0
          border-l border-white md:border-none 
          ${menuOpen ? "block" : "hidden"} 
        `}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : 10 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.6 }}
      >
        {MENUS.map((item, index) => (
          <div key={index} className={`relative`}>
            {/* Main Menu */}
            <div className="flex text-gray-200 font-avenir items-center relative">
              <div className="relative md:w-max">
                <Lottie
                  animationData={dustAnimation}
                  loop={false}
                  className="absolute inset-0 pointer-events-none"
                  style={{ width: 120, height: 120 }}
                />
                <motion.span
                  className={`font-avenir md:pl-0 pl-4 text-[14px] inline-block md:w-max w-[150px] cursor-pointer border-b-2 border-white/90 relative z-10 transition-all duration-300 ${
                    isTransitioning ? 'opacity-50' : 'opacity-100'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isTransitioning ? 0.5 : 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleClick(item.name.toLowerCase().replace(/\s+/g, ""))}
                >
                  {item.name}
                </motion.span>
              </div>
            </div>

            {/* Submenus */}
            <div
              className="
                mt-2
                flex flex-col pl-4 
                md:pl-0
                md:absolute md:top-full md:left-0 md:mt-2
              "
            >
              {item.sub.map((subItem, subIdx) => {
                const globalSubIndex = subCounter++;
                const subKey = subItem.toLowerCase().replace(/\s+/g, "");
                console.log("Menu - Generated subKey:", subKey, "from subItem:", subItem);
                return globalSubIndex < effectiveVisibleSubs ? (
                  <motion.div
                    key={subIdx}
                    className="text-sm relative w-max flex items-center text-gray-300 px-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="relative w-max">
                      <Lottie
                        animationData={dustAnimation}
                        loop={false}
                        className="absolute inset-0 pointer-events-none"
                        style={{ width: 120, height: 120 }}
                      />
                      <motion.span
                        className={`relative z-10 pl-4 text-xs cursor-pointer transition-all duration-300 ${
                          isTransitioning ? 'opacity-50' : 'opacity-100'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isTransitioning ? 0.5 : 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                        onClick={() => handleClick(subKey)}
                      >
                        - {subItem}
                      </motion.span>
                    </div>
                  </motion.div>
                ) : null;
              })}
            </div>
          </div>
        ))}

      </motion.div>
    </>
  );
}
