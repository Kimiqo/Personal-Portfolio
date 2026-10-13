"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import { Suspense, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { hotspots, type HotspotPosition, type Station } from "@/content/studio";

type Props = { entryAnimation: boolean; onEntered: () => void; dark: boolean; viewRevision: number; onArrival: () => void; walkStep: { id: number; direction: number }; onProjection: (points: HotspotPosition[]) => void; station: Station; onNavigate: (station: Station) => void; reducedMotion: boolean; onThemeToggle: () => void; onWork: () => void; onAbout: () => void; onReady: () => void };
const ink = "#343a36";
const PaletteContext = createContext<Record<string, string>>({});
const darkPalette: Record<string, string> = {
  "#cfbda3": "#321c25", "#e2d8c6": "#4a2939", "#ddd1bd": "#432534", "#c9b89c": "#492331",
  "#aa805a": "#572b39", "#bd956d": "#713747", "#745945": "#321b25", "#9d7655": "#512736", "#d5ba93": "#ad7380",
  "#a1bbae": "#242a39", "#baccc0": "#283247", "#f0e8d8": "#6b4050", "#b89672": "#683b49",
  "#896a50": "#593240", "#f1e5d1": "#b09189", "#be754f": "#862e42", "#79816a": "#59303d",
  "#eadb8d": "#a77a77", "#a68563": "#582938", "#688577": "#7b3448", "#b89b7d": "#927572", "#d3b880": "#bc8d80", "#8c858f": "#544050",
  "#343a36": "#21131b", "#56665a": "#60323f", "#253d34": "#26131c", "#355b48": "#7b293e", "#aec99b": "#dc9cae", "#c4a16e": "#c88888", "#98b694": "#c98094", "#54745e": "#6d3044", "#cbd5aa": "#e7bac6",
  "#e4dec9": "#7a6067", "#b6b3a3": "#49313c", "#d2d0bc": "#795864", "#879080": "#50343f",
  "#536758": "#66283c", "#8a9b6c": "#ab5169", "#6b7f5b": "#7d3047", "#b77454": "#91394c", "#e5dcc2": "#a58281", "#7d9478": "#a1556e", "#5e7b69": "#6a2b41", "#b8c3a1": "#cf9caa",
  "#ede0c6": "#b28d8d", "#ebe0c5": "#d0b2a6", "#a0825d": "#74354a", "#f4ddb6": "#e0b5ae", "#e8d7b7": "#c69c96", "#c88e72": "#915066",
};
const lightPalette: Record<string, string> = {
  "#e2d8c6": "#ecd9d3", "#ddd1bd": "#e3cfc9", "#cfbda3": "#d8b8ae", "#253d34": "#371a24", "#355b48": "#7c3045", "#343a36": "#3e2832", "#536758": "#762b41", "#6b7f5b": "#87384d", "#5e7b69": "#783347", "#7d9478": "#a75b6f", "#54745e": "#824256", "#98b694": "#d29ead", "#aec99b": "#e5bbc7", "#b8c3a1": "#dbb3bf", "#be754f": "#8f3548", "#688577": "#8a3d54",
};

function StudioMaterial(props: { color?: THREE.ColorRepresentation; roughness?: number; metalness?: number; emissive?: THREE.ColorRepresentation; emissiveIntensity?: number; side?: THREE.Side; basic?: boolean }) {
  const palette = useContext(PaletteContext);
  const color = typeof props.color === "string" ? palette[props.color] || props.color : props.color;
  const emissive = typeof props.emissive === "string" ? palette[props.emissive] || props.emissive : props.emissive;
  if (props.basic) return <meshBasicMaterial color={color} side={props.side}/>;
  const { basic: _, ...rest } = props;
  return <meshStandardMaterial {...rest} color={color} emissive={emissive}/>;
}

const entryDuration = 3.4;
function Door({ entryAnimation, reducedMotion }: Pick<Props, "entryAnimation" | "reducedMotion">) {
  const hinge = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);
  const sign = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 128;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#34121f"; context.fillRect(0, 0, 512, 128);
    context.font = "32px monospace"; context.textAlign = "center"; context.fillStyle = "#e5b9ba"; context.fillText("KIMIKO LABS", 256, 78);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
  useEffect(() => () => sign.dispose(), [sign]);
  useFrame(({ clock }) => {
    if (!hinge.current) return;
    if (start.current === null) start.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - start.current;
    const progress = !entryAnimation || reducedMotion ? 1 : THREE.MathUtils.clamp((elapsed - .25) / 1.45, 0, 1);
    const eased = progress * progress * (3 - 2 * progress);
    hinge.current.rotation.y = eased * Math.PI * .56;
  });
  return <group position={[0, 0, 7.8]}>
    <Box position={[-.94, 1.55, 0]} size={[.18, 3.1, .22]} color="#593240"/>
    <Box position={[.94, 1.55, 0]} size={[.18, 3.1, .22]} color="#593240"/>
    <Box position={[0, 3.08, 0]} size={[2.05, .18, .22]} color="#593240"/>
    <Box position={[0, .02, -.6]} size={[2.05, .06, 1.5]} color="#cfbda3"/>
    <group ref={hinge} position={[-.84, 0, 0]} rotation={[0, entryAnimation ? 0 : Math.PI * .56, 0]}>
      <Box position={[.84, 1.49, 0]} size={[1.68, 2.98, .09]} color="#602238" radius={.035}/>
      <Box position={[.84, 1.02, .055]} size={[1.36, 1.48, .032]} color="#4b1d2b"/>
      <Box position={[.84, 2.32, .055]} size={[1.36, .72, .032]} color="#4b1d2b"/>
      <mesh position={[.84, 2.3, .075]}><planeGeometry args={[.94, .235]}/><meshBasicMaterial map={sign}/></mesh>
      <mesh position={[1.43, 1.42, .12]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.045, .045, .14, 20]}/><StudioMaterial color="#bd8b6d" metalness={.75} roughness={.25}/></mesh>
      <Box position={[1.34, 1.42, .18]} size={[.25, .065, .065]} color="#bd8b6d" radius={.025}/>
    </group>
  </group>;
}

function Box({ position, size, color, rotation, radius = .04 }: { position: [number, number, number]; size: [number, number, number]; color: string; rotation?: [number, number, number]; radius?: number }) {
  return <RoundedBox args={size} radius={radius} smoothness={4} position={position} rotation={rotation} castShadow receiveShadow><StudioMaterial color={color} roughness={color === "#e2d8c6" || color === "#ddd1bd" ? 1 : .65}/></RoundedBox>;
}

function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}>
    <mesh position={[0, .17, 0]} castShadow><cylinderGeometry args={[.18, .13, .34, 32]}/><StudioMaterial color="#c88e72" roughness={.9}/></mesh>
    <mesh position={[0, .34, 0]}><cylinderGeometry args={[.16, .16, .025, 24]}/><StudioMaterial color="#564438"/></mesh>
    {[0, 1, 2, 3, 4, 5, 6].map(i => <group key={i} rotation={[0, i * 2.4, (i % 2 ? -1 : 1) * .25]}>
      <mesh position={[0, .55 + i * .025, 0]} rotation={[.35, 0, .35]}><cylinderGeometry args={[.009, .012, .45, 6]}/><StudioMaterial color="#66714b"/></mesh>
      <mesh position={[.08, .69 + i * .025, .03]} rotation={[.4, i, -.5]} scale={[.11, .23, .035]} castShadow><sphereGeometry args={[1, 16, 12]}/><StudioMaterial color={i % 2 ? "#78835c" : "#535f40"}/></mesh>
    </group>)}
  </group>;
}

const cameraStops: Record<Station, { position: [number, number, number]; target: [number, number, number] }> = {
  overview: { position: [0, 1.85, 6.1], target: [.15, 1.7, -.55] },
  work: { position: [-.28, 1.63, .93], target: [-.28, 1.63, -.175] },
  about: { position: [1.23, 2.04, .86], target: [1.23, 1.3, .23] },
  cv: { position: [-1.11, 2.02, .92], target: [-1.11, 1.2, .48] },
  contact: { position: [1.83, 1.82, -.51], target: [1.83, 1.8, -1.48] },
};

// A first-person camera: looking turns the view around the viewer's position.
// Walking translates the viewer; selecting an object starts a guided approach.
function CameraRig({ station, viewRevision, reducedMotion, onArrival, walkStep, entryAnimation, onEntered }: Pick<Props, "station" | "viewRevision" | "reducedMotion" | "onArrival" | "walkStep" | "entryAnimation" | "onEntered">) {
  const { camera, gl, size } = useThree();
  const destination = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const destinationQuaternion = useRef(new THREE.Quaternion());
  const helper = useRef(new THREE.PerspectiveCamera());
  const manual = useRef(false);
  const arrived = useRef(false);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const keys = useRef(new Set<string>());
  const entryStart = useRef<number | null>(null);
  const entryComplete = useRef(false);
  const lookEuler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const direction = useRef(new THREE.Vector3());

  function beginLooking() {
    if (!manual.current) {
      lookEuler.current.setFromQuaternion(camera.quaternion, "YXZ");
      yaw.current = lookEuler.current.y;
      pitch.current = lookEuler.current.x;
      destination.current.copy(camera.position);
      manual.current = true;
    }
  }

  function move(forward: number, sideways: number, amount: number) {
    beginLooking();
    camera.getWorldDirection(direction.current);
    direction.current.y = 0;
    direction.current.normalize();
    const nextX = THREE.MathUtils.clamp(destination.current.x + (direction.current.x * forward + Math.cos(yaw.current) * sideways) * amount, -2.25, 2.25);
    const nextZ = THREE.MathUtils.clamp(destination.current.z + (direction.current.z * forward - Math.sin(yaw.current) * sideways) * amount, -1.25, 7.4);
    // Keep the visitor on the near side of the solid workbench.
    if (!(nextX > -1.7 && nextX < 1.95 && nextZ > -.7 && nextZ < .95)) {
      destination.current.set(nextX, 1.85, nextZ);
    }
  }

  useEffect(() => {
    const stop = cameraStops[station];
    destination.current.set(...stop.position);
    lookTarget.current.set(...stop.target);
    helper.current.position.copy(destination.current);
    helper.current.lookAt(lookTarget.current);
    destinationQuaternion.current.copy(helper.current.quaternion);
    manual.current = false;
    arrived.current = false;
    keys.current.clear();
  }, [station, viewRevision]);

  useEffect(() => {
    if (station === "overview" && walkStep.id > 0) move(walkStep.direction, 0, .35);
    // A new command should take one step, rather than depend on camera updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walkStep.id]);

  useEffect(() => {
    if (station !== "overview" || entryAnimation) return;
    let pointer: { id: number; x: number; y: number } | null = null;
    const canvas = gl.domElement;
    function down(event: PointerEvent) {
      if (event.button !== 0) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    }
    function drag(event: PointerEvent) {
      if (!pointer || event.pointerId !== pointer.id) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (Math.abs(dx) + Math.abs(dy) < 2) return;
      beginLooking();
      yaw.current -= dx * .003;
      pitch.current = THREE.MathUtils.clamp(pitch.current - dy * .003, -.65, .8);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }
    function up() { pointer = null; }
    function wheel(event: WheelEvent) { event.preventDefault(); move(Math.sign(event.deltaY), 0, Math.min(.25, Math.abs(event.deltaY) * .002)); }
    function keydown(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, [contenteditable=true]")) return;
      if (["w", "a", "s", "d"].includes(event.key.toLowerCase())) { event.preventDefault(); beginLooking(); keys.current.add(event.key.toLowerCase());
        if (!event.repeat) { const key = event.key.toLowerCase(); move(key === "w" ? 1 : key === "s" ? -1 : 0, key === "d" ? 1 : key === "a" ? -1 : 0, .04); } }
    }
    function keyup(event: KeyboardEvent) { keys.current.delete(event.key.toLowerCase()); }
    function blur() { keys.current.clear(); pointer = null; }
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", drag);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", blur);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", drag);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", blur);
    };
    // Listeners read mutable camera refs, keeping look and movement state current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station, gl, camera, entryAnimation]);

  useFrame(({ clock }, delta) => {
    if (entryAnimation && !entryComplete.current) {
      if (entryStart.current === null) entryStart.current = clock.elapsedTime;
      const elapsed = reducedMotion ? entryDuration : clock.elapsedTime - entryStart.current;
      const progress = THREE.MathUtils.clamp((elapsed - 1.0) / (entryDuration - 1), 0, 1);
      const eased = progress * progress * (3 - 2 * progress);
      camera.position.set(0, THREE.MathUtils.lerp(1.78, 1.85, eased), THREE.MathUtils.lerp(9.6, 6.1, eased));
      camera.lookAt(.15 * eased, 1.7, -.55);
      if (elapsed >= entryDuration) { entryComplete.current = true; onEntered(); }
      return;
    }
    const dt = Math.min(delta, .05);
    if (manual.current) {
      const forward = Number(keys.current.has("w")) - Number(keys.current.has("s"));
      const sideways = Number(keys.current.has("d")) - Number(keys.current.has("a"));
      if (forward || sideways) move(forward, sideways, dt * .8);
      camera.position.lerp(destination.current, reducedMotion ? 1 : 1 - Math.exp(-12 * dt));
      lookEuler.current.set(pitch.current, yaw.current, 0, "YXZ");
      camera.quaternion.setFromEuler(lookEuler.current);
    } else {
      const easing = reducedMotion ? 1 : 1 - Math.exp(-5 * dt);
      camera.position.lerp(destination.current, easing);
      camera.quaternion.slerp(destinationQuaternion.current, easing);
      if (!arrived.current && camera.position.distanceTo(destination.current) < .025 && camera.quaternion.angleTo(destinationQuaternion.current) < .02) { arrived.current = true; onArrival(); }
    }
    const perspective = camera as THREE.PerspectiveCamera;
    const targetFov = station === "overview" ? size.width < 700 ? 78 : 62 : 44;
    if (Math.abs(perspective.fov - targetFov) > .01) {
      perspective.fov = THREE.MathUtils.lerp(perspective.fov, targetFov, reducedMotion ? 1 : 1 - Math.exp(-5 * dt));
      perspective.updateProjectionMatrix();
    }
  });
  return null;
}

function ProjectHotspots({ station, onProjection }: Pick<Props, "station" | "onProjection">) {
  const point = useRef(new THREE.Vector3());
  useFrame(({ camera, size }) => {
    if (station !== "overview") return;
    onProjection(hotspots.map(item => {
      point.current.set(...item.position).project(camera);
      return { id: item.id, x: (point.current.x + 1) * size.width / 2, y: (1 - point.current.y) * size.height / 2, visible: point.current.z > -1 && point.current.z < 1 };
    }));
  });
  return null;
}

function World({ station, viewRevision, onNavigate, onProjection, onArrival, walkStep, reducedMotion, dark, onThemeToggle, onWork, onAbout, onReady, entryAnimation, onEntered }: Props) {
  const decor = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  useEffect(() => { onReady(); }, [onReady]);
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => { document.body.style.cursor = ""; };
  }, [hovered]);
  useFrame(({ clock }) => {
    if (!decor.current || reducedMotion) return;
    decor.current.rotation.y = clock.elapsedTime * .18;
    decor.current.position.y = 2.8 + Math.sin(clock.elapsedTime * .8) * .06;
  });
  const hover = (id: string) => ({ onPointerOver: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setHovered(id); }, onPointerOut: () => setHovered(null) });

  return <>
    <CameraRig entryAnimation={entryAnimation} onEntered={onEntered} viewRevision={viewRevision} station={station} reducedMotion={reducedMotion} onArrival={onArrival} walkStep={walkStep}/>
    <ambientLight intensity={dark ? 1.05 : 1.15}/><hemisphereLight args={[dark ? "#d9a3b7" : "#fff1e5", dark ? "#24111c" : "#ac7f80", dark ? 1.2 : 1.4]}/>
    <directionalLight position={[0, 3.25, 4]} intensity={dark ? 1.8 : 2.5} color={dark ? "#ecc0c4" : "#fff0e0"} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6}/>
    <directionalLight position={[-4, 4, -1]} intensity={dark ? .65 : 1.2} color={dark ? "#8898bf" : "#dfddeb"}/>
    <pointLight position={[0, 3.15, 2]} color={dark ? "#e6b2c1" : "#fff0dc"} intensity={dark ? 5 : 7} distance={7}/>
    <pointLight position={[0, 3.15, 5.8]} color={dark ? "#e6b2c1" : "#fff0dc"} intensity={dark ? 5 : 7} distance={7}/>
    <Door entryAnimation={entryAnimation} reducedMotion={reducedMotion}/>
    <Box position={[0, -.08, 9]} size={[5.3, .16, 2.5]} color="#cfbda3"/>
    {/* The room is entered through the hinged front door. */}
    <Box position={[0, -.08, 3]} size={[5.3, .16, 9.6]} color="#cfbda3" radius={.08}/>
    <Box position={[0, 1.7, -1.7]} size={[5.3, 3.5, .14]} color="#e2d8c6"/>
    <Box position={[-2.57, 1.7, 3]} size={[.14, 3.5, 9.6]} color="#ddd1bd"/>
    <Box position={[2.57, 1.7, 3]} size={[.14, 3.5, 9.6]} color="#ddd1bd"/>
    <Box position={[0, 3.5, 3]} size={[5.3, .14, 9.6]} color="#e2d8c6"/>
    <Box position={[-1.77, 1.7, 7.8]} size={[1.65, 3.5, .14]} color="#e2d8c6"/>
    <Box position={[1.77, 1.7, 7.8]} size={[1.65, 3.5, .14]} color="#e2d8c6"/>
    <Box position={[0, 3.3, 7.8]} size={[1.9, .4, .14]} color="#e2d8c6"/>
    <Box position={[0, .015, 4.2]} size={[1.6, .025, 4.65]} color="#593240" radius={.015}/>
    {[2.8, 4.1, 5.4, 6.7].map(z => <group key={z}>
      <Box position={[-2.45, 2.5, z]} size={[.045, .35, .12]} color="#bd8b6d"/>
      <pointLight position={[-2.35, 2.45, z]} color={dark ? "#edb4c3" : "#ffe8d2"} intensity={dark ? .55 : .3} distance={2.7}/>
    </group>)}
    <Box position={[2.48, 1.9, 4.5]} size={[.06, 1.02, .82]} color="#896a50"/>
    <Box position={[2.43, 1.9, 4.5]} size={[.025, .88, .68]} color="#f1e5d1"/>
    <Box position={[0, .12, -1.58]} size={[5.1, .14, .1]} color="#c9b89c"/>
    {/* Window, inset sky and wood mullions. */}
    <Box position={[-2.47, 2.12, -.35]} size={[.07, 1.9, 1.75]} color="#a1bbae"/>
    <mesh position={[-2.42, 2.12, -.35]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.62, 1.78]}/><StudioMaterial basic color="#baccc0"/></mesh>
    {[-1.24, .55].map(z => <Box key={z} position={[-2.38, 2.12, z]} size={[.12, 2.04, .065]} color="#f0e8d8"/>)}
    {[1.14, 2.12, 3.12].map(y => <Box key={y} position={[-2.38, y, -.35]} size={[.12, .065, 1.85]} color="#f0e8d8"/>)}
    <Box position={[-2.35, 1.12, -.35]} size={[.4, .09, 2]} color="#b89672"/>
    <Plant position={[-2.25, 1.17, .19]} scale={.65}/>
    {/* Wall art and pinned note. */}
    <Box position={[.13, 2.53, -1.57]} size={[.92, 1.12, .08]} color="#896a50"/>
    <Box position={[.13, 2.53, -1.515]} size={[.81, 1.01, .028]} color="#f1e5d1"/>
    <mesh position={[.13, 2.66, -1.49]}><circleGeometry args={[.25, 48]}/><StudioMaterial color="#be754f"/></mesh>
    <Box position={[.13, 2.26, -1.48]} size={[.51, .06, .015]} color="#79816a" radius={.006}/>
    <Box position={[1.05, 2.23, -1.57]} size={[.35, .42, .02]} color="#eadb8d" rotation={[0, 0, -.08]}/>
    <mesh position={[1.04, 2.4, -1.54]}><sphereGeometry args={[.025, 12, 12]}/><StudioMaterial color="#c37760"/></mesh>
    {/* Floating shelf with books and a curious sculpture. */}
    <Box position={[1.6, 2.75, -1.4]} size={[1.65, .09, .44]} color="#a68563"/>
    {["#688577", "#b89b7d", "#d3b880", "#8c858f"].map((color, i) => <Box key={color} position={[1.21 + i * .14, 2.99, -1.42]} size={[.11, .4 + i * .035, .24]} color={color} rotation={[0, 0, i === 3 ? -.16 : 0]} radius={.012}/>)}
    <mesh position={[2.05, 2.96, -1.4]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.14, .045, 12, 32]}/><StudioMaterial color="#c88761"/></mesh>
    {/* Desk and legs. */}
    <Box position={[.12, 1.08, .05]} size={[3.55, .14, 1.38]} color="#aa805a" radius={.06}/>
    <Box position={[.12, 1.15, .05]} size={[3.51, .018, 1.35]} color="#bd956d" radius={.005}/>
    {[[-1.36, -.43], [1.59, -.43], [-1.36, .53], [1.59, .53]].map(([x, z], i) => <Box key={i} position={[x, .51, z]} size={[.12, 1.06, .12]} color="#745945"/>)}
    <Box position={[1.27, .82, .05]} size={[.69, .43, 1.05]} color="#9d7655"/>
    <Box position={[1.27, .83, .59]} size={[.6, .023, .025]} color="#d5ba93" radius={.008}/>
    {/* Clickable computer. Screen elements are geometry so no external font assets are needed. */}
    <group position={[-.28, 1.17, -.22]} onClick={e => { e.stopPropagation(); onWork(); }} {...hover("screen")}>
      <Box position={[0, .025, .4]} size={[1.42, .065, .82]} color="#879080" radius={.04}/>
      <Box position={[0, .43, 0]} size={[1.35, .86, .08]} color={hovered === "screen" ? "#56665a" : ink} radius={.06}/>
      <mesh position={[0, .44, .046]}><planeGeometry args={[1.22, .72]}/><StudioMaterial color="#253d34" emissive="#355b48" emissiveIntensity={.35}/></mesh>
      <Box position={[-.42, .61, .057]} size={[.15, .018, .01]} color="#aec99b" radius={.004}/>
      {[.37, .56, .24, .45].map((width, i) => <Box key={i} position={[-.29 + width / 2 - .17, .54 - i * .09, .059]} size={[width, .016, .009]} color={i === 2 ? "#c4a16e" : "#98b694"} radius={.004}/>)}
      <Box position={[.39, .36, .06]} size={[.23, .24, .012]} color="#54745e" radius={.012}/>
      <mesh position={[.39, .36, .07]}><ringGeometry args={[.056, .068, 32]}/><StudioMaterial basic color="#cbd5aa"/></mesh>
    </group>
    <Box position={[-.3, 1.19, .52]} size={[.91, .055, .31]} color="#e4dec9" rotation={[0, .03, 0]}/>
    {Array.from({ length: 3 }, (_, row) => Array.from({ length: 10 }, (_, col) => <Box key={`${row}-${col}`} position={[-.67 + col * .08, 1.221, .43 + row * .07]} size={[.055, .009, .038]} color="#b6b3a3" radius={.002}/>))}
    <Box position={[.39, 1.18, .51]} size={[.21, .065, .3]} color="#d2d0bc" radius={.05}/>
    {/* Lamp, with a real light switch. */}
    <group position={[-1.2, 1.17, -.3]} onClick={e => { e.stopPropagation(); onThemeToggle(); }} {...hover("lamp")}>
      <mesh position={[0, .025, 0]} castShadow><cylinderGeometry args={[.23, .25, .055, 32]}/><StudioMaterial color="#536758"/></mesh>
      <mesh position={[0, .32, 0]}><cylinderGeometry args={[.025, .025, .58, 16]}/><StudioMaterial color="#aa9975" metalness={.5} roughness={.3}/></mesh>
      <mesh position={[.06, .69, .025]} rotation={[0, 0, -.25]} castShadow><coneGeometry args={[.35, .35, 32, 1, true]}/><StudioMaterial color={hovered === "lamp" ? "#8a9b6c" : "#6b7f5b"} side={THREE.DoubleSide}/></mesh>
      <mesh position={[.08, .58, .025]}><sphereGeometry args={[.065, 16, 16]}/><StudioMaterial color="#ffe4ad" emissive="#ffce80" emissiveIntensity={dark ? 2 : .5}/></mesh>
      {<pointLight position={[.08, .55, .1]} intensity={dark ? 2.2 : 1} distance={3.5} color="#ffcc80"/>}
    </group>
    {/* A stack of clickable sketchbooks. */}
    <group position={[1.23, 1.2, .23]} rotation={[0, -.18, 0]} onClick={e => { e.stopPropagation(); onAbout(); }} {...hover("book")}>
      <Box position={[0, .015, 0]} size={[.52, .065, .68]} color="#b77454"/>
      <Box position={[.01, .07, -.015]} size={[.49, .05, .64]} color="#e5dcc2"/>
      <Box position={[0, .105, -.02]} size={[.52, .025, .68]} color={hovered === "book" ? "#7d9478" : "#5e7b69"}/>
      <Box position={[0, .121, -.02]} size={[.2, .008, .29]} color="#b8c3a1" radius={.006}/>
    </group>
    <group position={[1.83, 1.8, -1.54]} onClick={e => { e.stopPropagation(); onNavigate("contact"); }} {...hover("contact")}>
      <Box position={[0, 0, 0]} size={[.66, .52, .06]} color="#a0825d"/>
      <Box position={[0, 0, .04]} size={[.55, .4, .025]} color={hovered === "contact" ? "#f4ddb6" : "#e8d7b7"}/>
      <Box position={[0, -.06, .06]} size={[.26, .014, .01]} color="#ad916d" radius={.003}/>
      <mesh position={[0, .08, .068]}><ringGeometry args={[.044, .055, 24]}/><StudioMaterial basic color="#9a7a58"/></mesh>
    </group>
    {/* Ceramic cup, desk details, and a stool. */}
    <mesh position={[.61, 1.31, -.19]} castShadow><cylinderGeometry args={[.105, .09, .28, 32]}/><StudioMaterial color="#ede0c6"/></mesh>
    <mesh position={[.61, 1.456, -.19]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.085, 32]}/><StudioMaterial color="#71503a" side={THREE.DoubleSide}/></mesh>
    <mesh position={[.74, 1.32, -.19]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[.07, .023, 10, 24]}/><StudioMaterial color="#ede0c6"/></mesh>
    <Plant position={[1.65, 1.17, .47]} scale={.77}/>
    <group onClick={e => { e.stopPropagation(); onNavigate("cv"); }} {...hover("cv")}>
      <Box position={[-1.11, 1.18, .48]} size={[.48, .025, .54]} color="#9e7f60" rotation={[0, -.2, 0]}/>
      <Box position={[-1.11, 1.2, .48]} size={[.4, .012, .47]} color={hovered === "cv" ? "#fff4d8" : "#ebe0c5"} rotation={[0, -.2, 0]} radius={.01}/>
      <Box position={[-1.11, 1.22, .28]} size={[.14, .025, .05]} color="#78816e" radius={.01}/>
      <Box position={[-1.13, 1.22, .51]} size={[.28, .015, .022]} color="#6b7f5b" rotation={[0, .4, 0]} radius={.005}/>
    </group>
    <mesh position={[-.13, .63, 1.1]} castShadow><cylinderGeometry args={[.4, .4, .13, 40]}/><StudioMaterial color="#aa805a"/></mesh>
    {[-1, 1].map(x => [-1, 1].map(z => <Box key={`${x}-${z}`} position={[-.13 + x * .23, .29, 1.1 + z * .23]} size={[.065, .58, .065]} color="#745945" rotation={[z * .12, 0, -x * .12]}/>))}
    {/* Floating idea: motion adds life without needing camera controls. */}
    <group ref={decor} position={[.35, 2.8, .1]} rotation={[.4, 0, .2]}>
      <mesh><torusGeometry args={[.19, .035, 16, 48]}/><StudioMaterial color="#c89659" metalness={.45} roughness={.3}/></mesh>
      <mesh><sphereGeometry args={[.09, 24, 24]}/><StudioMaterial color="#d9a57f"/></mesh>
    </group>
    <ProjectHotspots station={station} onProjection={onProjection}/>
    <ContactShadows position={[0, -.17, 0]} opacity={.35} scale={9} blur={2.6} far={5} resolution={256} color="#6b5842"/>
  </>;
}

export default function StudioScene(props: Props) {
  return <Canvas camera={{ position: props.entryAnimation ? [0, 1.78, 9.6] : [0, 1.85, 6.1], fov: 62, near: .03 }} dpr={[1, 1.5]} shadows gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} fallback={<div className="canvas-fallback">A small space for big ideas.</div>} aria-label="Walk through the studio with WASD or scroll, drag to look, and select objects for close-up views."><PaletteContext.Provider value={props.dark ? darkPalette : lightPalette}><Suspense fallback={null}><World {...props}/></Suspense></PaletteContext.Provider></Canvas>;
}
