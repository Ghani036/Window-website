import React from "react";
import { Preload, useScroll } from "@react-three/drei";

import VideoBackground from "./VideoBackground";
import LogoVideoHUD from "./LogoVideoHUD";
import CameraRig from "./CameraRig";
import StarField from "./StarField";
import ParticleSystem from "./ParticleSystem";
import AdvancedParticleSystem from "./AdvancedParticleSystem";
import FloatingParticles from "./FloatingParticles";

export default function Scene({ showContent, visibleSubs }) {
  const scroll = useScroll();

  return (
    <>
      <VideoBackground scroll={scroll} showContent={showContent} visibleSubs={visibleSubs} />
      <LogoVideoHUD scroll={scroll} />
      <CameraRig scroll={scroll} />
      <StarField scroll={scroll} />
      
      {/* Particle Systems for First Section */}
      <ParticleSystem 
        count={800} 
        scroll={scroll} 
        showContent={showContent} 
        visibleSubs={visibleSubs}
        section="first"
      />
      <AdvancedParticleSystem 
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
      
      <Preload all />
    </>
  );
}


