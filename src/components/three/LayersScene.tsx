import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Line, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

type Sheet = {
  y: number;
  size: number;
  radius: number;
  colour: string;
  opacity: number;
  rings: number[];
  seed: number;
};

const sheets: Sheet[] = [
  { y: 0.72, size: 2.34, radius: 0.16, colour: '#efe9dc', opacity: 0.46, rings: [0.5, 0.82], seed: 0.6 },
  { y: 0.26, size: 2.7, radius: 0.2, colour: '#e3dccd', opacity: 0.46, rings: [0.58, 0.92, 1.16], seed: 1.9 },
  { y: -0.2, size: 3, radius: 0.24, colour: '#d6cebd', opacity: 0.44, rings: [0.68, 1.04, 1.27], seed: 3.1 },
  { y: -0.66, size: 3.24, radius: 0.28, colour: '#c7bfae', opacity: 0.4, rings: [0.76, 1.12, 1.38], seed: 4.4 },
];

const ringPoints = (radius: number, seed: number, y: number) => {
  const points: THREE.Vector3[] = [];
  const segments = 120;
  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    const wobble =
      1 + Math.sin(angle * 3 + seed) * 0.09 + Math.cos(angle * 5 - seed * 0.7) * 0.045;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius * wobble,
        y + 0.012,
        Math.sin(angle) * radius * wobble,
      ),
    );
  }
  return points;
};

const SheetStack = () => {
  const group = useRef<THREE.Group>(null);

  const lines = useMemo(
    () =>
      sheets.map((sheet) =>
        sheet.rings.map((radius) => ({
          key: `${sheet.y}-${radius}`,
          points: ringPoints(radius, sheet.seed, sheet.y),
        })),
      ),
    [],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const damp = Math.min(1, delta * 1.8);
    group.current.rotation.y += delta * 0.075;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -0.06 + state.pointer.y * 0.075,
      damp,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      state.pointer.x * 0.05,
      damp,
    );
  });

  return (
    <Float speed={1.1} rotationIntensity={0.16} floatIntensity={0.5}>
      <group ref={group} rotation={[0, -0.55, 0]} position={[0, 0.02, 0]}>
        {sheets.map((sheet, index) => (
          <group key={sheet.y}>
            <RoundedBox
              args={[sheet.size, 0.045, sheet.size]}
              radius={sheet.radius}
              smoothness={4}
              position={[0, sheet.y, 0]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={sheet.colour}
                transparent
                opacity={sheet.opacity}
                roughness={0.72}
                metalness={0}
                depthWrite={false}
              />
            </RoundedBox>
            {lines[index]?.map((line) => (
              <Line
                key={line.key}
                points={line.points}
                color="#5b6152"
                lineWidth={0.85}
                transparent
                opacity={0.5}
              />
            ))}
            <Line
              points={[
                [-sheet.size / 2 + sheet.radius, sheet.y + 0.014, 0],
                [sheet.size / 2 - sheet.radius, sheet.y + 0.014, 0],
              ]}
              color="#4a4f42"
              lineWidth={0.7}
              transparent
              opacity={0.22}
            />
          </group>
        ))}

        <mesh position={[0.42, 0.8, 0.16]} castShadow>
          <sphereGeometry args={[0.055, 24, 24]} />
          <meshStandardMaterial color="#3e443a" roughness={0.4} metalness={0.15} />
        </mesh>
        <Line
          points={[
            [0.42, 0.78, 0.16],
            [0.42, -0.92, 0.16],
          ]}
          color="#5b6152"
          lineWidth={0.7}
          transparent
          opacity={0.4}
        />

        <ContactShadows
          position={[0, -1.02, 0]}
          opacity={0.24}
          scale={8}
          blur={2.8}
          far={3.4}
          color="#3c3f35"
        />
      </group>
    </Float>
  );
};

const LayersScene = () => (
  <Canvas
    dpr={[1, 1.7]}
    gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
    shadows
    aria-hidden="true"
  >
    <PerspectiveCamera
      makeDefault
      position={[4, 3.45, 4.95]}
      fov={32}
      onUpdate={(camera) => camera.lookAt(0, -0.05, 0)}
    />
    <ambientLight intensity={1.5} color="#fffaf0" />
    <directionalLight
      position={[4, 6, 3]}
      intensity={1.8}
      color="#fff6e6"
      castShadow
      shadow-mapSize={[1024, 1024]}
    />
    <directionalLight position={[-4, 1, -3]} intensity={0.45} color="#dce2d2" />
    <SheetStack />
  </Canvas>
);

export default LayersScene;
