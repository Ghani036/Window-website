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
  const [visibleIndex, setVisibleIndex] = useState(-1);

  // Track scroll and show menus one by one
  useEffect(() => {
    const unsubscribe = scroll.el.addEventListener("scroll", () => {
      const progress = scroll.scroll.current; // scroll progress 0 -> 1
      const nextIndex = Math.floor(progress * MENUS.length);

      if (nextIndex !== visibleIndex) {
        setVisibleIndex(nextIndex);
      }
    });

    return () => scroll.el.removeEventListener("scroll", unsubscribe);
  }, [scroll, visibleIndex]);

  return (
    <>
      <Html fullscreen>
        <div className="absolute font-semibold top-0 left-1/4 w-1/2 ml-auto mr-auto flex justify-between p-4">
          {MENUS.map((item, index) => (
            <div key={index} className="relative group">
              {index <= visibleIndex ? (
                <>
                  {/* Dust animation first */}
                  <Lottie
                    animationData={dustAnimation}
                    loop={false}
                    className="absolute"
                    style={{ width: 120, height: 120 }}
                  />
                  {/* Menu text appears after dust */}
                  <motion.span
                    className="text-gray-200 font-avenir text-[18px] border-b border-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {item.name}
                  </motion.span>

                  {/* Submenus with dust + stagger animation */}
                  <div className="absolute left-0 hidden flex-col rounded-md p-1 pl-4 group-hover:flex">
                    {item.sub.map((subMenuItem, subIdx) => (
                      <motion.div
                        key={subIdx}
                        className="text-sm w-max flex justify-center items-center text-gray-300 hover:text-white py-1 px-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + subIdx * 0.2 }}
                      >
                        <Lottie
                          animationData={dustAnimation}
                          loop={false}
                          style={{ width: 20, height: 20, marginRight: 8 }}
                        />
                        <div className=" animate-bounce " >{subMenuItem}</div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : null}
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
