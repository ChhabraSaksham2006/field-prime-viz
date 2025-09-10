import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Text, Float, MeshDistortMaterial, Environment, Cloud } from '@react-three/drei';
import { motion } from 'framer-motion';

// Animated floating sphere
const AnimatedSphere = ({ position, color, speed, distort }) => {
  const meshRef = useRef();
  
  // Animation for the sphere
  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current as any).rotation.x = state.clock.elapsedTime * speed * 0.2;
      (meshRef.current as any).rotation.y = state.clock.elapsedTime * speed * 0.5;
    }
  });

  // Spring animation for hover effect
  const [spring, api] = useSpring(() => ({
    scale: 1,
    config: { mass: 2, tension: 300, friction: 15 }
  }));

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.5} 
      floatIntensity={2}
      position={position}
    >
      <animated.mesh
        ref={meshRef as React.RefObject<import('three').Mesh>}
        scale={spring.scale}
        onPointerOver={() => api.start({ scale: 1.2 })}
        onPointerOut={() => api.start({ scale: 1 })}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color={color || '#ffffff'} 
          speed={distort ? 2 : 0} 
          distort={distort ? 0.4 : 0} 
          roughness={0.2}
          metalness={0.8}
          toneMapped={true}
        />
        
      </animated.mesh>
    </Float>
  );
};

// 3D text with animation
const AnimatedText = ({ text, position, color, size }) => {
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      position={position}
    >
      <Text
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {text}
      </Text>
    </Float>
  );
};

// Particle system for background effect
const ParticleField = ({ count = 100 }) => {
  const particles = useRef();
  
  useFrame((state) => {
    if (particles.current) {
      (particles.current as any).rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const particlePositions = Array.from({ length: count }, () => [
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  ]);

  return (
    <group ref={particles}>
      {particlePositions.map((position, i) => {
        const materialProps = {
          color: i % 3 === 0 ? '#4CAF50' : i % 3 === 1 ? '#2196F3' : '#FFC107',
          toneMapped: false
        };
        return (
          <mesh key={i} position={[position[0], position[1], position[2]]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial {...materialProps} />
            
          </mesh>
        );
      })}
    </group>
  );
};

// 3D scene for the hero section
const HeroScene = () => {
  return (
    <>
      <Environment preset="sunset" />
      
      <ParticleField count={200} />
      
      {/* Decorative clouds */}
      <Cloud position={[-4, 2, -10]} speed={0.2} opacity={0.5} />
      <Cloud position={[4, 0, -8]} speed={0.1} opacity={0.3} />
      
      {/* Main spheres */}
      <AnimatedSphere position={[-2.5, 0, 0]} color="#4CAF50" speed={1} distort={true} />
      <AnimatedSphere position={[0, -1, -2]} color="#2196F3" speed={0.7} distort={false} />
      <AnimatedSphere position={[2.5, 0.5, -1]} color="#FFC107" speed={1.2} distort={true} />
      
      {/* 3D Text elements */}
      <AnimatedText 
        text="Field" 
        position={[-2, 2, 0]} 
        color="#ffffff" 
        size={1.2} 
      />
      <AnimatedText 
        text="Prime" 
        position={[2, 2, 0]} 
        color="#4CAF50" 
        size={1.2} 
      />
    </>
  );
};

// Main component with both 3D canvas and 2D overlay
const AnimatedHero = () => {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <HeroScene />
        </Canvas>
      </div>
      
      {/* Text overlay with animations */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-black/30 backdrop-blur-lg p-8 rounded-xl max-w-3xl"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gradient-primary mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Agricultural Monitoring Reimagined
          </motion.h1>
          
          <motion.p
            className="text-xl text-white/80 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Advanced analytics and visualization for modern farming
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button className="px-8 py-3 bg-gradient-primary rounded-full text-white font-medium hover:shadow-glow transition-all">
              Get Started
            </button>
            <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-all">
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedHero;