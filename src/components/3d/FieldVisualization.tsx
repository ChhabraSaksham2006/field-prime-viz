import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Text, Environment } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { Vector3 } from 'three';
import { motion } from 'framer-motion';

// Props typing for FieldSection
interface FieldSectionProps {
  position: [number, number, number];
  size: [number, number, number];
  health: number;
  onClick: () => void;
  isHovered: boolean;
  isSelected: boolean;
}

const FieldSection: React.FC<FieldSectionProps> = ({
  position,
  size,
  health,
  onClick,
  isHovered,
  isSelected,
}) => {
  const meshRef = useRef<import('three').Mesh | null>(null);

  const getHealthColor = (health: number): [number, number, number] => {
    if (health > 80) return [0.1, 0.8, 0.1];
    if (health > 60) return [0.6, 0.8, 0.1];
    if (health > 40) return [0.8, 0.8, 0.1];
    if (health > 20) return [0.8, 0.4, 0.1];
    return [0.8, 0.1, 0.1];
  };

  const healthColor = getHealthColor(health);

  const { elevation, color } = useSpring({
    elevation: isHovered || isSelected ? 0.2 : 0,
    color: isSelected ? [0.3, 0.7, 1.0] : healthColor,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.03;
    }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={[position[0], position[1] + elevation.get(), position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      scale={[size[0], size[1], size[2]]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 0.1, 1]} />
      <animated.meshStandardMaterial
        color={color.to((r, g, b) => `rgb(${r * 255}, ${g * 255}, ${b * 255})`)}
        roughness={0.6}
        metalness={0.1}
        toneMapped={true}
      />
    </animated.mesh>
  );
};

interface DataPointProps {
  position: [number, number, number];
  value: string;
  color: string;
}

const DataPoint: React.FC<DataPointProps> = ({ position, value, color }) => {
  const [hovered, setHovered] = useState(false);
  const { scale } = useSpring({
    scale: hovered ? 1.4 : 1,
    config: { tension: 300, friction: 10 },
  });

  return (
    <group position={[position[0], position[1] + 0.1, position[2]]}>
      <animated.mesh
        scale={scale.to((s) => [s, s, s])}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={color || '#ffffff'} emissive={color || '#ffffff'} emissiveIntensity={0.5} toneMapped={true} />
      </animated.mesh>
      {hovered && (
        <Text
          position={[0, 0.15, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {value}
        </Text>
      )}
    </group>
  );
};

const FieldModel: React.FC = () => {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const { camera } = useThree();

  const fieldSections = [
    { id: 1, position: [-1.5, 0, -1.5], size: [0.9, 0.2, 0.9], health: 85 },
    { id: 2, position: [-0.5, 0, -1.5], size: [0.9, 0.2, 0.9], health: 75 },
    { id: 3, position: [0.5, 0, -1.5], size: [0.9, 0.2, 0.9], health: 90 },
    { id: 4, position: [1.5, 0, -1.5], size: [0.9, 0.2, 0.9], health: 65 },
    { id: 5, position: [-1.5, 0, -0.5], size: [0.9, 0.2, 0.9], health: 45 },
    { id: 6, position: [-0.5, 0, -0.5], size: [0.9, 0.2, 0.9], health: 80 },
    { id: 7, position: [0.5, 0, -0.5], size: [0.9, 0.2, 0.9], health: 30 },
    { id: 8, position: [1.5, 0, -0.5], size: [0.9, 0.2, 0.9], health: 70 },
    { id: 9, position: [-1.5, 0, 0.5], size: [0.9, 0.2, 0.9], health: 60 },
    { id: 10, position: [-0.5, 0, 0.5], size: [0.9, 0.2, 0.9], health: 20 },
    { id: 11, position: [0.5, 0, 0.5], size: [0.9, 0.2, 0.9], health: 55 },
    { id: 12, position: [1.5, 0, 0.5], size: [0.9, 0.2, 0.9], health: 95 },
    { id: 13, position: [-1.5, 0, 1.5], size: [0.9, 0.2, 0.9], health: 40 },
    { id: 14, position: [-0.5, 0, 1.5], size: [0.9, 0.2, 0.9], health: 75 },
    { id: 15, position: [0.5, 0, 1.5], size: [0.9, 0.2, 0.9], health: 85 },
    { id: 16, position: [1.5, 0, 1.5], size: [0.9, 0.2, 0.9], health: 50 },
  ];

  const dataPoints = [
    { position: [-1.2, 0, -1.2], value: 'N+', color: '#4285F4' },
    { position: [0.8, 0, -0.3], value: 'P-', color: '#EA4335' },
    { position: [-0.7, 0, 0.7], value: 'K+', color: '#FBBC05' },
    { position: [1.3, 0, 1.3], value: 'pH', color: '#34A853' },
  ];

  // Smooth camera animation on selection
  useEffect(() => {
    if (selectedSection !== null) {
      const section = fieldSections.find((s) => s.id === selectedSection);
      if (section) {
        const targetPosition = new Vector3(
          section.position[0],
          section.position[1] + 1.5,
          section.position[2] + 1.5
        );

        const animateCamera = () => {
          const currentPos = camera.position.clone();
          const direction = targetPosition.clone().sub(currentPos);
          if (direction.length() > 0.1) {
            camera.position.add(direction.multiplyScalar(0.05));
            camera.lookAt(
              section.position[0],
              section.position[1],
              section.position[2]
            );
            requestAnimationFrame(animateCamera);
          }
        };
        animateCamera();
      }
    }
  }, [selectedSection, camera, fieldSections]);

  const groundTexture = useTexture('/placeholder.svg');

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial key={undefined}
          color="#2c3e50"
          roughness={0.8}
          metalness={0.2}
          map={groundTexture}
          toneMapped={true}
        />
      </mesh>

      {/* Field sections */}
      {fieldSections.map((section) => (
        <FieldSection
          key={section.id}
          position={section.position as [number, number, number]}
          size={section.size as [number, number, number]}
          health={section.health}
          onClick={() =>
            setSelectedSection(section.id === selectedSection ? null : section.id)
          }
          isHovered={hoveredSection === section.id}
          isSelected={selectedSection === section.id}
        />
      ))}

      {/* Data points */}
      {dataPoints.map((point, index) => (
        <DataPoint
          key={index}
          position={point.position as [number, number, number]}
          value={point.value}
          color={point.color}
        />
      ))}

      {/* Grid helper */}
      <gridHelper args={[10, 20, '#ffffff', '#303030']} position={[0, 0.01, 0]} />
    </group>
  );
};

const FieldVisualization: React.FC = () => {
  return (
    <div className="w-full h-[500px] bg-black/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
      <Canvas shadows camera={{ position: [0, 3, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Environment preset="sunset" />
        <FieldModel />
        <OrbitControls
          enableZoom
          enablePan
          minDistance={2}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2 - 0.1}
        />
      </Canvas>
    </div>
  );
};

export default FieldVisualization;
