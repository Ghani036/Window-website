import React from "react";
import { Preload, useScroll } from "@react-three/drei";

import VideoBackground from "./VideoBackground";
import CameraRig from "./CameraRig";
import StarField from "./StarField";
import ParticleSystem from "./ParticleSystem";
import FloatingParticles from "./FloatingParticles";
import DustParticles from "./DustParticles";
import LogoVideoHUD from "./LogoVideoHUD";

export default function Scene({ showContent, visibleSubs }) {
  const scroll = useScroll();

  return (
    <>
      <VideoBackground scroll={scroll} showContent={showContent} visibleSubs={visibleSubs} />
      <CameraRig scroll={scroll} />
      <StarField scroll={scroll} />
      
      {/* Logo Reveal for Scene 1 */}
      <LogoVideoHUD scroll={scroll} showContent={showContent} />
      
      {/* Particle Systems for First Section */}
      <ParticleSystem
        count={1500}
        scroll={scroll}
        showContent={showContent}
        visibleSubs={visibleSubs}
        section="first"
      />
      <FloatingParticles 
        scroll={scroll} 
        showContent={showContent} 
        visibleSubs={visibleSubs}
        section="first"
      />
      
      {/* Dust Particles for First Section */}
      <DustParticles
        scroll={scroll}
        showContent={showContent}
        visibleSubs={visibleSubs}
        section="first"
      />
      
      <Preload all />
    </>
  );
}


