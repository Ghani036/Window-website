import React, { useState, useEffect } from "react";
import { useScroll, Html, Preload } from "@react-three/drei";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import dustAnimation from "../assets/lottie/dust.json";

import VideoBackground from "./VideoBackground";
import LogoVideoHUD from "./LogoVideoHUD";
import CameraRig from "./CameraRig";
import StarField from "./StarField";

const MENUS = [
  { name: "THE WINDOW", sub: ["The Founder", "Joined Forces", "The Systems"] },
  {
    name: "THE LAB",
    sub: [
      "The Art of Storytelling",
      "Story Board",
      "Digital Collage Art",
      "From Sketch to Digital to Ai",
    ],
  },
  { name: "THE CHAMBER", sub: ["Art Piece", "Wear the myth"] },
];

export default function Scene() {
  const scroll = useScroll();
  const [visibleSubs, setVisibleSubs] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      const progress = scroll.scroll.current; // 0 → 1

      // total items = menus + all submenus
      const totalMenus = MENUS.length;
      const totalSubs = MENUS.reduce((sum, m) => sum + m.sub.length, 0);
      const totalItems = totalMenus + totalSubs;

      // Map progress to items
      const currentIndex = Math.floor(progress * totalItems);

      // ✅ Submenus reveal progressively after menus
      const subIndex = currentIndex - totalMenus;
      setVisibleSubs(subIndex);
    };

    const el = scroll.el;
    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [scroll]);

  let subCounter = 0;

  return (
    <>
      <Html fullscreen className="fixed">
        <div className="absolute font-semibold top-0 left-1/4 w-1/2 ml-auto mr-auto flex justify-between p-4">
          {MENUS.map((item, index) => (
            <div key={index} className="relative">
              {/* Main Menu */}
              <div className="flex items-center">
                <Lottie
                  animationData={dustAnimation}
                  loop={false}
                  className="absolute"
                  style={{ width: 120, height: 120 }}
                />
                <motion.span
                  className="text-gray-200 font-avenir text-[18px] border-b border-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {item.name}
                </motion.span>
              </div>

              {/* Submenus appear progressively on scroll */}
              <div className="flex flex-col p-1 pl-4 mt-2">
                {item.sub.map((subItem, subIdx) => {
                  const globalSubIndex = subCounter++;
                  return globalSubIndex <= visibleSubs ? (
                    <motion.div
                      key={subIdx}
                      className="text-sm w-max flex items-center text-gray-300 py-1 px-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Lottie
                        animationData={dustAnimation}
                        loop={false}
                        style={{ width: 20, height: 20, marginRight: 8 }}
                      />
                      <div>{subItem}</div>
                    </motion.div>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </Html>

      <VideoBackground scroll={scroll} />
      <LogoVideoHUD scroll={scroll} />
      <CameraRig scroll={scroll} />
      <StarField scroll={scroll} />
      <Preload all />
    </>
  );
}
