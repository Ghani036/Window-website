import React from "react";
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

    return (
        <div className="fixed  font-semibold top-0 left-1/4 w-1/2 ml-auto mr-auto flex justify-between p-4 z-50">
            {MENUS.map((item, index) => (
                <div key={index} className="relative">
                    {/* Main Menu */}
                    <div className="flex text-gray-200 font-avenir items-center">
                        <Lottie
                            animationData={dustAnimation}
                            loop={false}
                            className="absolute"
                            style={{ width: 120, height: 120 }}
                        />
                        <motion.span
                            className=" font-avenir text-[18px] border-b border-white"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            {item.name}
                        </motion.span>
                    </div>

                    {/* Submenus */}
                    <div className="flex flex-col p-1 pl-4 mt-2">
                        {item.sub.map((subItem, subIdx) => {
                            const globalSubIndex = subCounter++;
                            return globalSubIndex <= visibleSubs ? (
                                <motion.div
                                    key={subIdx}
                                    className="text-sm relative w-max flex items-center text-gray-300 py-1 px-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Lottie
                                        animationData={dustAnimation}
                                        loop={false}
                                        className="absolute -top-2"
                                        style={{ width: 120, height: 120 }}
                                    />
                                    <div>{subItem}</div>
                                </motion.div>
                            ) : null;
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
