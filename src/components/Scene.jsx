import React from "react";
import { useScroll, Preload } from "@react-three/drei";
import VideoBackground from "./VideoBackground";
import LogoVideoHUD from "./LogoVideoHUD";
import CameraRig from "./CameraRig";
import StarField from "./StarField";
import { Html } from "@react-three/drei";



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

  return (
    <>


      <Html fullscreen>
        <div className="absolute font-semibold top-0 left-1/4 w-1/2 ml-auto mr-auto flex justify-between p-4">
          {MENUS.map((item, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Parent menu */}
              <span className="text-gray-200 font-avenir text-[18px]  border-b border-white">
                {item.name}
              </span>

              {/* Submenu */}
              <div className="absolute left-0 hidden flex-col  rounded-md p-1 pl-4 group-hover:flex">
                {item.sub.map((subMenuItem, subIdx) => (
                  <div
                    key={subIdx}
                    className="text-sm w-max flex justify-center items-center text-gray-300 hover:text-white py-1 px-2"
                  >
                    <div className="w-[4px] h-[4px] bg-white rounded-full mr-2" />
                    <div>{subMenuItem}</div>
                  </div>
                ))}
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
