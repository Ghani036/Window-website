import React, { useState } from "react";
import { motion } from "framer-motion";
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
      "From Sketch to Digital to Ai",
    ],
  },
  { name: "THE CHAMBER", sub: ["Art Piece", "Wear the myth"] },
];

export default function Menu({ visibleSubs }) {
  let subCounter = 0;

  const [menuOpen, setMenuOpen] = useState(true)


  const toggleMenu = () => setMenuOpen((prev => !prev))

  return (
    <>
      <div className=" md:hidden block absolute left-4 top-10 z-50 ">
        <img src="/assets/menu.png" alt="Menu"
          className="h-8 w-8 cursor-pointer "
          onClick={() => toggleMenu()}
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
          <div key={index} className={`relative  `}>
            {/* Main Menu */}
            <div className="flex  text-gray-200 font-avenir items-center relative">
              <div className="relative md:w-max   ">
                <Lottie
                  animationData={dustAnimation}
                  loop={false}
                  className="absolute inset-0 pointer-events-none"
                  style={{ width: 120, height: 120 }}
                />
                <motion.span
                  className="font-avenir md:pl-0 pl-4 text-[14px] inline-block md:w-max w-[150px]  border-b-2 border-white/90 relative z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}

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
                return globalSubIndex < visibleSubs ? (
                  <motion.div
                    key={subIdx}
                    className="text-sm relative w-max flex items-center text-gray-300  px-2"
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
                        className=" relative z-10 pl-4 text-xs cursor-pointer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
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



        <div className={`relative md:w-max md:hidden transform transition-all duration-500 ease-in-out `}>
          <Lottie
            animationData={dustAnimation}
            loop={false}
            className="absolute inset-0 pointer-events-none"
            style={{ width: 120, height: 120 }}
          />
          <motion.span
            className="font-avenir text-white inline-block md:w-max w-[150px]  md:pl-0 pl-4 text-[14px] border-b-2  border-white/90 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            CONTACT
          </motion.span>

          <motion.div
            className="text-sm relative flex items-center text-gray-300  px-2"
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
                className=" relative z-10 pl-4 text-xs cursor-pointer "
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                - Send Us Some Good Gifts
              </motion.span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>

  );
}
