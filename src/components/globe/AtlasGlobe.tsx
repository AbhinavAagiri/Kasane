import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { destinations } from '@/data/destinations';

type Dots = Array<[number, number]>;

const toVector = (lng: number, lat: number, radius = 1) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

const useDotTexture = () => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#f1ebdd';
      context.beginPath();
      context.arc(16, 16, 10, 0, Math.PI * 2);
      context.fill();
    }
    const next = new THREE.CanvasTexture(canvas);
    next.needsUpdate = true;
    return next;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
};

const LandLayer = ({ dots, radius, size, opacity }: { dots: Dots; radius: number; size: number; opacity: number }) => {
  const texture = useDotTexture();
  const geometry = useMemo(() => {
    const positions = new Float32Array(dots.length * 3);
    dots.forEach(([lng, lat], index) => {
      const point = toVector(lng, lat, radius);
      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.y;
      positions[index * 3 + 2] = point.z;
    });
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return buffer;
  }, [dots, radius]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        map={texture}
        color="#f2eee0"
        size={size}
        transparent
        opacity={opacity}
        alphaTest={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const Graticule = () => {
  const geometry = useMemo(() => {
    // Every consecutive pair is an explicit line segment: parallels run east–west,
    // meridians run pole-to-pole. No sentinel NaNs in the position buffer.
    const positions: number[] = [];
    const pushSegment = (from: THREE.Vector3, to: THREE.Vector3) => {
      positions.push(from.x, from.y, from.z, to.x, to.y, to.z);
    };

    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lng = -180; lng < 180; lng += 3) {
        pushSegment(
          toVector(lng, lat, 1.006),
          toVector(lng + 3, lat, 1.006),
        );
      }
    }
    for (let lng = -150; lng <= 180; lng += 30) {
      for (let lat = -90; lat < 90; lat += 3) {
        pushSegment(
          toVector(lng, lat, 1.006),
          toVector(lng, lat + 3, 1.006),
        );
      }
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return buffer;
  }, []);
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#d8d3c3" transparent opacity={0.2} />
    </lineSegments>
  );
};

const GlobeScene = () => {
  const [dots, setDots] = useState<Dots>([]);
  const group = useRef<THREE.Group>(null);
  const { invalidate } = useThree();

  useEffect(() => {
    let active = true;
    fetch('/map/world-dots.json')
      .then((response) => {
        if (!response.ok) throw new Error('world dots unavailable');
        return response.json() as Promise<Dots>;
      })
      .then((data) => {
        if (active) {
          setDots(data);
          invalidate();
        }
      })
      .catch(() => {
        /* handled by the section fallback */
      });
    return () => {
      active = false;
    };
  }, [invalidate]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.032;
  });

  return (
    <group ref={group} rotation={[0.18, -0.4, 0]}>
      <mesh>
        <sphereGeometry args={[0.985, 64, 64]} />
        <meshBasicMaterial color="#1c211b" transparent opacity={0.92} />
      </mesh>
      <LandLayer dots={dots} radius={0.997} size={0.0085} opacity={0.55} />
      <LandLayer dots={dots} radius={1.01} size={0.013} opacity={0.24} />
      <LandLayer dots={dots} radius={1.025} size={0.018} opacity={0.1} />
      <Graticule />
      {destinations.slice(0, 8).map((destination, index) => {
        const point = toVector(destination.coordinates.lng, destination.coordinates.lat, 1.02);
        return (
          <mesh key={destination.slug} position={point}>
            <sphereGeometry args={[0.009 + (index % 3) * 0.002, 12, 12]} />
            <meshBasicMaterial color="#a64332" transparent opacity={0.78} />
          </mesh>
        );
      })}
    </group>
  );
};

export const AtlasGlobe = () => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="globe-fallback relative aspect-square w-full max-w-[520px]" aria-hidden="true">
        <img src="/map/world.svg" alt="" />
      </div>
    );
  }

  return (
    <div className="globe-stage relative aspect-square w-full max-w-[620px]" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.1, 3.4], fov: 34 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onError={() => setFailed(true)}
      >
        <ambientLight intensity={0.7} />
        <GlobeScene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          autoRotate={false}
          minPolarAngle={Math.PI / 2 - 0.45}
          maxPolarAngle={Math.PI / 2 + 0.45}
        />
      </Canvas>
    </div>
  );
};

export default AtlasGlobe;
