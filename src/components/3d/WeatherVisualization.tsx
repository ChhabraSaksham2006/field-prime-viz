import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated, config } from '@react-spring/three';
import { Text, Float, Cloud, Billboard, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';

// Weather data for visualization
const WEATHER_DATA = [
  { day: 'Mon', temp: 28, humidity: 65, rainfall: 0, condition: 'sunny' },
  { day: 'Tue', temp: 30, humidity: 70, rainfall: 0, condition: 'sunny' },
  { day: 'Wed', temp: 27, humidity: 75, rainfall: 10, condition: 'rainy' },
  { day: 'Thu', temp: 25, humidity: 80, rainfall: 15, condition: 'rainy' },
  { day: 'Fri', temp: 26, humidity: 72, rainfall: 5, condition: 'cloudy' },
  { day: 'Sat', temp: 29, humidity: 68, rainfall: 0, condition: 'sunny' },
  { day: 'Sun', temp: 31, humidity: 60, rainfall: 0, condition: 'sunny' },
];

// Weather icons as 3D objects
const WeatherIcon = ({ condition, position, scale = 1 }) => {
  const group = useRef();
  
  useFrame((state) => {
    if (group.current) {
      // The THREE import should be moved to the top of the file with other imports
      const THREE = require('three');
      (group.current as any).rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  // Render different 3D objects based on weather condition
  return (
    <group ref={group as React.RefObject<import('three').Group>} position={position} scale={scale}>
      {condition === 'sunny' && (
        <>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#FDB813" emissive="#FDB813" emissiveIntensity={0.5} />
          </mesh>
          {/* Sun rays */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * 0.8;
            const y = Math.sin(angle) * 0.8;
            return (
              <mesh key={i} position={[x, y, 0]}>
                <boxGeometry args={[0.1, 0.4, 0.05]} />
                <meshStandardMaterial color="#FDB813" emissive="#FDB813" emissiveIntensity={0.5} />
              </mesh>
            );
          })}
        </>
      )}
      
      {condition === 'cloudy' && (
        <>
          <Cloud opacity={0.8} speed={0.4} segments={20} />
        </>
      )}
      
      {condition === 'rainy' && (
        <>
          <Cloud opacity={0.8} speed={0.4} segments={20} scale={[3, 1, 0.4]} />
          {/* Rain drops */}
          {Array.from({ length: 15 }).map((_, i) => {
            const x = (Math.random() - 0.5) * 2;
            const y = -0.5 - Math.random() * 1;
            const z = (Math.random() - 0.5) * 0.5;
            return (
              <mesh key={i} position={[x, y, z]}>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
                <meshStandardMaterial color="#7BB2D9" transparent opacity={0.7} />
              </mesh>
            );
          })}
        </>
      )}
    </group>
  );
};

// Data bar for temperature, humidity, or rainfall
const DataBar = ({ value, maxValue, position, color, label, isSelected, onClick }) => {
  const height = (value / maxValue) * 3; // Scale height based on value
  
  // Animation for selection and hover
  const [hovered, setHovered] = useState(false);
  
  const { barScale, barColor, labelOpacity } = useSpring({
    barScale: [1, isSelected ? 1.2 : 1, 1],
    barColor: isSelected ? '#ffffff' : hovered ? '#dddddd' : color,
    labelOpacity: isSelected || hovered ? 1 : 0.7,
    config: config.wobbly
  });
  
  return (
    <group position={position} onClick={onClick}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, height + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          fillOpacity={labelOpacity.get()}
        >
          {`${label}: ${value}`}
        </Text>
      </Billboard>
      
      <animated.mesh 
        position={[0, height/2, 0]}
        scale={[barScale.get()[0], barScale.get()[1], barScale.get()[2]]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.5, height, 0.5]} />
        <animated.meshStandardMaterial color={barColor} metalness={0.5} roughness={0.2} />
      </animated.mesh>
    </group>
  );
};

// Main weather visualization component
const WeatherVisualization = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [dataType, setDataType] = useState('temp'); // 'temp', 'humidity', 'rainfall'
  
  // Get max values for scaling
  const maxTemp = Math.max(...WEATHER_DATA.map(d => d.temp));
  const maxHumidity = Math.max(...WEATHER_DATA.map(d => d.humidity));
  const maxRainfall = Math.max(...WEATHER_DATA.map(d => d.rainfall));
  
  // Get current max value based on selected data type
  const getCurrentMax = () => {
    switch(dataType) {
      case 'temp': return maxTemp;
      case 'humidity': return maxHumidity;
      case 'rainfall': return maxRainfall;
      default: return maxTemp;
    }
  };
  
  // Get color based on data type
  const getDataColor = (type) => {
    switch(type) {
      case 'temp': return '#FF5722';
      case 'humidity': return '#2196F3';
      case 'rainfall': return '#4CAF50';
      default: return '#FF5722';
    }
  };
  
  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-indigo-900 to-purple-900">
      <Canvas camera={{ position: [0, 3, 10], fov: 45 }}>
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Weather icons */}
        {WEATHER_DATA.map((data, idx) => (
          <WeatherIcon 
            key={idx}
            condition={data.condition}
            position={[idx * 2 - 6, 4, -2]}
            scale={idx === selectedDay ? 1.5 : 1}
          />
        ))}
        
        {/* Data bars */}
        {WEATHER_DATA.map((data, idx) => {
          const value = data[dataType];
          return (
            <DataBar
              key={idx}
              value={value}
              maxValue={getCurrentMax()}
              position={[idx * 2 - 6, 0, 0]}
              color={getDataColor(dataType)}
              label={data.day}
              isSelected={idx === selectedDay}
              onClick={() => setSelectedDay(idx)}
            />
          );
        })}
        
        {/* Base platform */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 10]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.2} roughness={0.8} />
        </mesh>
      </Canvas>
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/50 backdrop-blur-sm p-4 rounded-lg"
        >
          <h3 className="text-white text-lg mb-2 text-center">Weather Forecast</h3>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => setDataType('temp')}
              className={`px-3 py-1 rounded-md transition-colors ${dataType === 'temp' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-200'}`}
            >
              Temperature
            </button>
            <button 
              onClick={() => setDataType('humidity')}
              className={`px-3 py-1 rounded-md transition-colors ${dataType === 'humidity' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
            >
              Humidity
            </button>
            <button 
              onClick={() => setDataType('rainfall')}
              className={`px-3 py-1 rounded-md transition-colors ${dataType === 'rainfall' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-200'}`}
            >
              Rainfall
            </button>
          </div>
          <div className="mt-2 text-center text-white">
            {WEATHER_DATA[selectedDay].day}: {WEATHER_DATA[selectedDay][dataType]}
            {dataType === 'temp' ? '°C' : dataType === 'humidity' ? '%' : ' mm'}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WeatherVisualization;