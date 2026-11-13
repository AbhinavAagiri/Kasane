import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Html, OrbitControls } from '@react-three/drei';
import { destinations } from '@/data/destinations';
import type { Destination } from '@/data/types';
import {
  countryCodesForDestinations,
  focusRotation,
  latLngToVector,
  makeBoundaryGeometry,
  makeGlobeTexture,
  makeHighlightTexture,
  type GlobeData,
} from '@/components/globe/globeData';
import {
  globeMotionAt,
  type JourneyScene,
} from '@/components/globe/worldScenes';
import { overscanFov } from '@/components/globe/globeView';

type GlobeSceneProps = {
  data: GlobeData;
  scene: JourneyScene;
  interactive: boolean;
  inView: boolean;
  visibleSlugs: string[];
  selectedSlug: string | null;
  hoveredSlug: string | null;
  resetSignal?: number;
  scrollProgress: MutableRefObject<number>;
  quality: 'low' | 'high';
  distanceScale: number;
  eventsElement: HTMLElement | null;
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
};

const ALL_DESTINATIONS = destinations;

// Keep the globe alive while the page is at rest, then hand the yaw back to
// the scroll track when the reader starts moving again.
const IDLE_SPIN_DELAY = 1.4;
const IDLE_SPIN_SPEED = 0.1;
const TWO_PI = Math.PI * 2;

const Marker = ({
  destination,
  selected,
  hovered,
  showLabel,
  onSelect,
  onHover,
}: {
  destination: Destination;
  selected: boolean;
  hovered: boolean;
  showLabel: boolean;
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
}) => {
  const group = useRef<THREE.Group>(null);
  const position = useMemo(
    () => latLngToVector(destination.coordinates.lat, destination.coordinates.lng, 1.012),
    [destination.coordinates.lat, destination.coordinates.lng],
  );
  const quaternion = useMemo(() => {
    const normal = position.clone().normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  }, [position]);
  const currentScale = useRef(0.35);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = selected ? 1.55 : hovered ? 1.28 : 1;
    currentScale.current = THREE.MathUtils.damp(currentScale.current, target, 7, delta);
    group.current.scale.setScalar(currentScale.current);
  });

  const pointTone = selected || hovered ? '#fff1d0' : '#c9a86b';
  const ringTone = selected || hovered ? '#e3c48a' : '#f1e9d8';

  return (
    <group position={position} quaternion={quaternion}>
      <group ref={group}>
        <mesh
          onPointerOver={(event) => {
            event.stopPropagation();
            onHover(destination.slug);
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            onHover(null);
          }}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(destination.slug);
          }}
        >
          <sphereGeometry args={[selected ? 0.028 : 0.02, 18, 18]} />
          <meshBasicMaterial color={pointTone} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.001]} renderOrder={2}>
          <ringGeometry
            args={[
              selected ? 0.052 : hovered ? 0.043 : 0.034,
              selected ? 0.059 : hovered ? 0.048 : 0.04,
              40,
            ]}
          />
          <meshBasicMaterial
            color={ringTone}
            transparent
            opacity={selected ? 1 : hovered ? 0.95 : 0.82}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        {selected ? (
          <mesh position={[0, 0, 0.001]} renderOrder={2}>
            <ringGeometry args={[0.071, 0.073, 48]} />
            <meshBasicMaterial
              color={ringTone}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ) : null}
        <mesh>
          <sphereGeometry args={[0.052, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      {showLabel ? (
        <Html
          position={[0, 0, 0.052]}
          center
          distanceFactor={2.1}
          zIndexRange={[20, 0]}
          className="pointer-events-none"
        >
          <div className="globe-label">
            <span>{destination.name}</span>
            <small>
              {destination.coordinates.lat.toFixed(2)}° {destination.coordinates.lng.toFixed(2)}°
            </small>
          </div>
        </Html>
      ) : null}
    </group>
  );
};

const Atmosphere = ({ scrollProgress }: { scrollProgress: MutableRefObject<number> }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uIntensity: { value: 1 } }), []);

  useFrame((_, delta) => {
    const uniform = materialRef.current?.uniforms.uIntensity;
    if (!uniform) return;
    const target = globeMotionAt(scrollProgress.current).atmosphere;
    uniform.value = THREE.MathUtils.damp(uniform.value, target, 1.8, delta);
  });

  return (
    <mesh scale={1.17}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uIntensity;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.67 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.1);
            gl_FragColor = vec4(0.56, 0.57, 0.46, 1.0) * intensity * 0.68 * uIntensity;
          }
        `}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

const Surface = ({
  data,
  quality,
  highlightedCodes,
  scrollProgress,
}: {
  data: GlobeData;
  quality: 'low' | 'high';
  highlightedCodes: string[];
  scrollProgress: MutableRefObject<number>;
}) => {
  const textureWidth = quality === 'high' ? 3072 : 2048;
  const segmentCount = quality === 'high' ? 128 : 72;
  const baseTexture = useMemo(() => makeGlobeTexture(data, textureWidth), [data, textureWidth]);
  // The highlight is a soft gold boundary overlay, not the base map. A 1024px
  // canvas is visually indistinguishable here and avoids a large texture
  // upload every time the chapter's country set changes.
  const highlightTexture = useMemo(
    () => makeHighlightTexture(data, highlightedCodes, quality === 'high' ? 1024 : 512),
    [data, highlightedCodes, quality],
  );
  const boundaryGeometry = useMemo(() => makeBoundaryGeometry(data, null, 1.0035), [data]);
  const highlightGeometry = useMemo(
    () => (highlightedCodes.length ? makeBoundaryGeometry(data, highlightedCodes, 1.007) : null),
    [data, highlightedCodes],
  );

  useEffect(
    () => () => {
      baseTexture?.dispose();
      highlightTexture?.dispose();
      boundaryGeometry.dispose();
      highlightGeometry?.dispose();
    },
    [baseTexture, highlightTexture, boundaryGeometry, highlightGeometry],
  );

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, segmentCount, segmentCount]} />
        {baseTexture ? (
          <meshStandardMaterial
            map={baseTexture}
            roughness={0.88}
            metalness={0.02}
            color={new THREE.Color('#ffffff')}
          />
        ) : (
          <meshStandardMaterial color="#d7d2c1" roughness={0.9} />
        )}
      </mesh>

      <lineSegments geometry={boundaryGeometry} renderOrder={1}>
        <lineBasicMaterial color="#f2ecdc" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>

      {highlightTexture ? (
        <mesh renderOrder={2}>
          <sphereGeometry args={[1.006, segmentCount, segmentCount]} />
          <meshBasicMaterial
            map={highlightTexture}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : null}

      {highlightGeometry ? (
        <lineSegments geometry={highlightGeometry} renderOrder={3}>
          <lineBasicMaterial color="#e3c78f" transparent opacity={0.85} depthWrite={false} />
        </lineSegments>
      ) : null}

      <Atmosphere scrollProgress={scrollProgress} />
    </group>
  );
};

const CameraRig = ({
  interactive,
  selectedSlug,
  resetSignal,
  groupRef,
  distanceScale,
  scrollProgress,
}: {
  interactive: boolean;
  selectedSlug: string | null;
  resetSignal: number;
  groupRef: React.RefObject<THREE.Group | null>;
  distanceScale: number;
  scrollProgress: MutableRefObject<number>;
}) => {
  const { camera } = useThree();
  const controls = useThree((state) => state.controls) as {
    target?: THREE.Vector3;
    reset?: () => void;
    update?: () => void;
    _sphericalDelta?: THREE.Spherical;
    _panOffset?: THREE.Vector3;
  } | null;
  const rotation = useRef({ x: 0, y: 0 });
  const idle = useRef({
    started: false,
    lastProgress: scrollProgress.current,
    lastActivity: 0,
    blend: 0,
  });
  const flight = useRef<{
    active: boolean;
    from: THREE.Vector3;
    to: THREE.Vector3;
    elapsed: number;
  } | null>(null);

  useEffect(() => {
    const motion = globeMotionAt(scrollProgress.current);
    const target = focusRotation(motion.lat, motion.lng);
    rotation.current = { x: target.x + motion.tilt, y: target.y + motion.spin };
    camera.position.set(motion.cameraX, motion.cameraY, motion.distance * distanceScale);
    camera.lookAt(0, 0, 0);
  }, [camera, distanceScale, scrollProgress]);

  useEffect(() => {
    if (!interactive) return;
    const motion = globeMotionAt(1);
    const target = focusRotation(motion.lat, motion.lng);
    rotation.current = { x: target.x + motion.tilt, y: target.y + motion.spin };
    if (groupRef.current) {
      groupRef.current.rotation.order = 'YXZ';
      groupRef.current.rotation.set(rotation.current.x, rotation.current.y, motion.roll);
      groupRef.current.scale.setScalar(motion.scale);
    }
    camera.position.set(motion.cameraX, motion.cameraY + 0.04, motion.distance * distanceScale);
    camera.lookAt(0, 0, 0);
  }, [camera, distanceScale, groupRef, interactive, scrollProgress]);

  useEffect(() => {
    if (!interactive || !resetSignal) return;
    flight.current = null;
    const motion = globeMotionAt(1);
    const target = focusRotation(motion.lat, motion.lng);
    rotation.current = { x: target.x + motion.tilt, y: target.y + motion.spin };
    if (groupRef.current) {
      groupRef.current.rotation.order = 'YXZ';
      groupRef.current.rotation.set(rotation.current.x, rotation.current.y, motion.roll);
      groupRef.current.scale.setScalar(motion.scale);
    }
    // Clear any residual orbit delta from a drag or zoom before restoring the
    // canonical interactive camera; otherwise damping re-applies it after the
    // reset and leaves the globe at an off-axis angle.
    controls?.reset?.();
    controls?._sphericalDelta?.set(0, 0, 0);
    controls?._panOffset?.set(0, 0, 0);
    camera.position.set(
      motion.cameraX,
      motion.cameraY + 0.04,
      motion.distance * distanceScale,
    );
    camera.lookAt(0, 0, 0);
    controls?.target?.set(0, 0, 0);
    controls?.update?.();
  }, [camera, controls, distanceScale, groupRef, interactive, resetSignal]);

  useEffect(() => {
    if (!interactive || !selectedSlug || !groupRef.current) return;
    const destination = ALL_DESTINATIONS.find((item) => item.slug === selectedSlug);
    if (!destination) return;
    const local = latLngToVector(destination.coordinates.lat, destination.coordinates.lng, 1);
    const world = groupRef.current.localToWorld(local.clone()).normalize();
    const targetDistance = Math.max(2.55 * distanceScale, globeMotionAt(1).distance * distanceScale);
    flight.current = {
      active: true,
      from: camera.position.clone(),
      to: world.multiplyScalar(targetDistance).add(new THREE.Vector3(0, 0.08, 0)),
      elapsed: 0,
    };
  }, [camera, distanceScale, groupRef, interactive, selectedSlug]);

  useFrame((state, delta) => {
    if (!interactive) {
      const motion = globeMotionAt(scrollProgress.current);
      const target = focusRotation(motion.lat, motion.lng);
      const now = state.clock.elapsedTime;
      const idleState = idle.current;
      const progress = scrollProgress.current;

      if (!idleState.started) {
        idleState.started = true;
        idleState.lastProgress = progress;
        idleState.lastActivity = now;
      }
      if (Math.abs(progress - idleState.lastProgress) > 0.00001) {
        idleState.lastProgress = progress;
        idleState.lastActivity = now;
      }

      const idleAllowed = progress < 0.86;
      const shouldSpin = idleAllowed && now - idleState.lastActivity >= IDLE_SPIN_DELAY;
      idleState.blend = THREE.MathUtils.damp(
        idleState.blend,
        shouldSpin ? 1 : 0,
        2.2,
        delta,
      );

      const scrollYaw = target.y + motion.spin;
      if (shouldSpin) {
        // Ease into the idle turn instead of starting at full speed. Keep the
        // angle bounded so a long pause cannot wind up multiple revolutions
        // that have to be unwound all at once when scrolling resumes.
        rotation.current.y = THREE.MathUtils.euclideanModulo(
          rotation.current.y + Math.min(delta, 0.05) * IDLE_SPIN_SPEED * idleState.blend,
          TWO_PI,
        );
      } else {
        // The idle yaw is equivalent modulo a full turn. Bring it into the
        // nearest revolution before damping so returning to the scroll track
        // never spins backward through several accumulated turns.
        const wind = rotation.current.y - scrollYaw;
        if (Math.abs(wind) > Math.PI) {
          rotation.current.y -= Math.round(wind / TWO_PI) * TWO_PI;
        }
        rotation.current.y = THREE.MathUtils.damp(
          rotation.current.y,
          scrollYaw,
          2.5,
          delta,
        );
      }
      rotation.current.x = THREE.MathUtils.damp(
        rotation.current.x,
        target.x + motion.tilt,
        3.2,
        delta,
      );

      if (groupRef.current) {
        const group = groupRef.current;
        const drift = Math.sin(state.clock.elapsedTime * 0.09) * 0.018;
        group.rotation.order = 'YXZ';
        group.rotation.y = rotation.current.y + drift;
        group.rotation.x = rotation.current.x + Math.sin(state.clock.elapsedTime * 0.07) * 0.008;
        group.rotation.z = motion.roll + Math.sin(state.clock.elapsedTime * 0.05) * 0.004;
        const nextScale = THREE.MathUtils.damp(group.scale.x, motion.scale, 2.8, delta);
        group.scale.setScalar(nextScale);
      }

      state.camera.position.x = THREE.MathUtils.damp(
        state.camera.position.x,
        motion.cameraX,
        4,
        delta,
      );
      state.camera.position.y = THREE.MathUtils.damp(
        state.camera.position.y,
        motion.cameraY,
        4,
        delta,
      );
      state.camera.position.z = THREE.MathUtils.damp(
        state.camera.position.z,
        motion.distance * distanceScale,
        2.6,
        delta,
      );
      if (state.camera instanceof THREE.PerspectiveCamera) {
        const nextFov = THREE.MathUtils.damp(
          state.camera.fov,
          overscanFov(motion.fov),
          2.5,
          delta,
        );
        if (Math.abs(nextFov - state.camera.fov) > 0.01) {
          state.camera.fov = nextFov;
          state.camera.updateProjectionMatrix();
        }
      }
      state.camera.lookAt(0, 0, 0);
      return;
    }

    if (flight.current?.active) {
      flight.current.elapsed += delta;
      const progress = Math.min(1, flight.current.elapsed / 0.9);
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      state.camera.position.lerpVectors(flight.current.from, flight.current.to, eased);
      state.camera.lookAt(0, 0, 0);
      if (progress >= 1) flight.current.active = false;
    }
  });

  return null;
};

const LightRig = ({ scrollProgress }: { scrollProgress: MutableRefObject<number> }) => {
  const ambient = useRef<THREE.AmbientLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);

  useFrame((_, delta) => {
    const light = globeMotionAt(scrollProgress.current).light;
    if (ambient.current) {
      ambient.current.intensity = THREE.MathUtils.damp(
        ambient.current.intensity,
        0.78 + light * 0.18,
        2,
        delta,
      );
    }
    if (key.current) {
      key.current.intensity = THREE.MathUtils.damp(key.current.intensity, 1.9 * light, 2, delta);
    }
    if (fill.current) {
      fill.current.intensity = THREE.MathUtils.damp(
        fill.current.intensity,
        0.32 + light * 0.14,
        2,
        delta,
      );
    }
  });

  return (
    <>
      <ambientLight ref={ambient} color="#c5c8ba" intensity={0.92} />
      <directionalLight ref={key} position={[3.8, 2.4, 4.5]} color="#fff4e3" intensity={2.25} />
      <directionalLight ref={fill} position={[-4, -1.4, -3]} color="#69745f" intensity={0.42} />
    </>
  );
};

const Scene = ({
  data,
  interactive,
  visibleSlugs,
  selectedSlug,
  hoveredSlug,
  resetSignal = 0,
  scrollProgress,
  quality,
  distanceScale,
  eventsElement,
  onSelect,
  onHover,
}: Omit<GlobeSceneProps, 'inView'>) => {
  const groupRef = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as {
    reset?: () => void;
    update?: () => void;
  } | null;
  const [flightState, setFlightState] = useState(false);
  const selectedDestination = selectedSlug
    ? ALL_DESTINATIONS.find((item) => item.slug === selectedSlug)
    : null;
  const visibleKey = visibleSlugs.join('|');
  const visibleDestinations = useMemo(
    () =>
      visibleKey
        .split('|')
        .map((slug) => ALL_DESTINATIONS.find((item) => item.slug === slug))
        .filter((item): item is Destination => Boolean(item)),
    [visibleKey],
  );
  const highlightedCodes = useMemo(() => {
    if (selectedDestination) return countryCodesForDestinations(data, [selectedDestination]);
    return countryCodesForDestinations(data, visibleDestinations);
  }, [data, selectedDestination, visibleDestinations]);

  useEffect(() => {
    if (!interactive || !selectedSlug) return;
    const start = window.setTimeout(() => setFlightState(true), 0);
    const end = window.setTimeout(() => setFlightState(false), 950);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
      setFlightState(false);
    };
  }, [interactive, selectedSlug]);

  useEffect(() => {
    if (!interactive) return;
    const frame = window.requestAnimationFrame(() => {
      controls?.reset?.();
      const motion = globeMotionAt(1);
      camera.position.set(
        motion.cameraX,
        motion.cameraY + 0.04,
        motion.distance * distanceScale,
      );
      camera.lookAt(0, 0, 0);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = overscanFov(motion.fov);
        camera.updateProjectionMatrix();
      }
      controls?.update?.();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [camera, controls, distanceScale, interactive]);

  return (
    <>
      <LightRig scrollProgress={scrollProgress} />
      <CameraRig
        interactive={interactive}
        selectedSlug={selectedSlug}
        resetSignal={resetSignal}
        groupRef={groupRef}
        distanceScale={distanceScale}
        scrollProgress={scrollProgress}
      />
      <group ref={groupRef}>
        <Surface
          data={data}
          quality={quality}
          highlightedCodes={highlightedCodes}
          scrollProgress={scrollProgress}
        />
        {visibleDestinations.map((destination) => (
          <Marker
            key={destination.slug}
            destination={destination}
            selected={selectedSlug === destination.slug}
            hovered={hoveredSlug === destination.slug}
            showLabel={hoveredSlug === destination.slug || selectedSlug === destination.slug}
            onSelect={onSelect}
            onHover={onHover}
          />
        ))}
      </group>
      <OrbitControls
        key={resetSignal}
        makeDefault
        domElement={eventsElement ?? undefined}
        enabled={interactive && !flightState}
        enablePan={false}
        enableDamping
        dampingFactor={0.065}
        rotateSpeed={0.42}
        zoomSpeed={0.55}
        minDistance={2.2}
        maxDistance={5.2}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI - 0.3}
        target={[0, 0, 0]}
      />
      <AdaptiveDpr pixelated />
    </>
  );
};

export const GlobeScene = (props: GlobeSceneProps) => {
  return <Scene {...props} />;
};

export default GlobeScene;
