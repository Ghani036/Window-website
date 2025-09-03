import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";


export default function StarField({ scroll }) {
  const group = useRef();

  // Load star texture
  const starTexture = useMemo(
    () => new THREE.TextureLoader().load("/assets/star.png"),
    []
  );

  // Generate random star positions
  const stars = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      const size = Math.random() * 0.3 + 0.3;
      temp.push({ x, y, z, size });
    }
    return temp;
  }, []);


  useFrame((state, delta) => {
    const offset = scroll.offset;
    if (group.current) {
      // Slight rotation for star movement
      group.current.rotation.y += delta * 0.05;
      group.current.rotation.x += delta * 0.02;

      // Adjust stars distance based on scroll
      const scale = 1 + offset * 1;
      group.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={group}>
      {stars.map((star, i) => (
        <sprite key={i} position={[star.x, star.y, star.z]} scale={[0.2, 0.1, 1]}>
          <spriteMaterial
            attach="material"
            map={starTexture}
            transparent
            depthTest={false}
            color='white'
          />

        </sprite>
      ))}
    </group>
  );
}
