import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useAvatarStore } from '../../store/avatarStore';

interface AvatarProps {
  speaking: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ speaking }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarModel = useAvatarStore((state) => state.avatarModel);
  
  useEffect(() => {
    if (!containerRef.current || !avatarModel) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Load avatar model
    const loader = new GLTFLoader();
    loader.load(avatarModel, (gltf) => {
      scene.add(gltf.scene);
      camera.position.z = 2;
      
      // Animation
      const animate = () => {
        requestAnimationFrame(animate);
        if (speaking) {
          // Add speaking animation logic here
        }
        renderer.render(scene, camera);
      };
      animate();
    });

    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [avatarModel, speaking]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default Avatar;
