// "How it connects": one lead travelling through five systems, drawn in the same
// technical-illustration style as the Stack. Plays on its own; loaded lazily.
import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { C, LayerDetail } from "@/components/three/parts";
import type { Detail } from "@/data/stack";

export const STATIONS: { title: string; line: string; detail: Detail }[] = [
    { title: "Ad", line: "Someone sees your ad on Meta or Google", detail: "target" },
    { title: "Website", line: "Lands on a fast page and fills in the form", detail: "browser" },
    { title: "CRM", line: "The lead lands in your CRM and a follow-up goes out", detail: "database" },
    { title: "Xero", line: "Quote accepted, invoice raised automatically", detail: "invoice" },
    { title: "Report", line: "The sale is reported back, so the ads find more like them", detail: "bars" },
];

const B = 2.4; // station footprint
const TRAVEL = 0.9; // seconds between stations
const DWELL = 1.0; // seconds at each station
const RETURN = 1.8; // seconds for the loop back to the start
const CYCLE = DWELL + (STATIONS.length - 1) * (TRAVEL + DWELL) + RETURN;

// Desktop runs left → right across the screen; phones run top → bottom
const ACROSS = new THREE.Vector3(1, 0, -1).normalize();
const CAPTION_PX = 165; // caption width beside each station on phones
const DOWN = new THREE.Vector3(1, 0, 1).normalize();

function Station({ index, pos, active, compact }: { index: number; pos: THREE.Vector3; active: boolean; compact: boolean }) {
    const g = useRef<THREE.Group>(null);
    const st = STATIONS[index];
    const edge = active ? C.ember : C.edge;
    useFrame(() => {
        if (g.current) g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, active ? 0.18 : 0, 0.15);
    });
    // Caption under the station on desktop, to its right on phones
    const label = compact ? ACROSS.clone().multiplyScalar(1.6) : DOWN.clone().multiplyScalar(2.3);
    return (
        <group position={pos}>
            <group ref={g}>
                <mesh>
                    <boxGeometry args={[B, 0.45, B]} />
                    <meshLambertMaterial color={C.face} />
                    <Edges color={edge} threshold={20} />
                </mesh>
                <group position={[0, 0.225, 0]} scale={[0.72, 0.9, 0.72]}>
                    <LayerDetail detail={st.detail} edge={edge} />
                </group>
            </group>
            <Html position={[label.x, compact ? 0 : -0.3, label.z]} center={!compact} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
                <div className="flow-label" data-active={active || undefined} data-compact={compact || undefined}>
                    <span className="flow-label-num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="flow-label-title">{st.title}</span>
                    <span className="flow-label-line">{st.line}</span>
                </div>
            </Html>
        </group>
    );
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
    const { size, camera } = useThree();
    const compact = size.width < 640;
    const [active, setActive] = useState(reducedMotion ? -1 : 0);
    const dot = useRef<THREE.Mesh>(null);
    const clock = useRef(0);

    const spacing = 4.4;
    const dir = compact ? DOWN : ACROSS;
    const positions = useMemo(
        () => STATIONS.map((_, i) => dir.clone().multiplyScalar((i - (STATIONS.length - 1) / 2) * spacing)),
        [dir, spacing],
    );
    // The loop back from the report to the ad: an arc over the top (desktop) or round the left (phones)
    const arc = useMemo(() => {
        const a = positions[positions.length - 1].clone().setY(0.6);
        const b = positions[0].clone().setY(0.6);
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const ctrl = compact ? mid.add(new THREE.Vector3(-1, 0, 1).normalize().multiplyScalar(-5)).setY(1.2) : mid.setY(5.5);
        return new THREE.QuadraticBezierCurve3(a, ctrl, b);
    }, [positions, compact]);
    const arcPoints = useMemo(() => arc.getPoints(48), [arc]);

    useFrame((_, dt) => {
        // Frame all five stations plus their captions
        const cam = camera as THREE.OrthographicCamera;
        const span = (STATIONS.length - 1) * spacing;
        const zoom = compact
            ? Math.min((size.width - CAPTION_PX) / 4.3, (size.height * 0.92) / (span * 0.516 + 3))
            : Math.min((size.width * 0.94) / (span + B * 1.414), (size.height * 0.9) / 7.0);
        cam.zoom = zoom;
        // On phones, centre the drawing together with the captions to its right
        const look = compact ? new THREE.Vector3().addScaledVector(ACROSS, CAPTION_PX / zoom / 2) : new THREE.Vector3(0, 1.1, 0);
        cam.position.set(look.x + 10, look.y + 8.5, look.z + 10);
        cam.lookAt(look);
        cam.updateProjectionMatrix();

        if (reducedMotion || !dot.current) return;
        clock.current = (clock.current + Math.min(dt, 0.1)) % CYCLE;
        let c = clock.current;
        let here = -1;
        const p = new THREE.Vector3();
        let returning = false;
        if (c < DWELL) {
            here = 0;
            p.copy(positions[0]);
        } else {
            c -= DWELL;
            const leg = TRAVEL + DWELL;
            const i = Math.floor(c / leg);
            if (i < STATIONS.length - 1) {
                const k = c - i * leg;
                if (k < TRAVEL) {
                    const e = THREE.MathUtils.smoothstep(k / TRAVEL, 0, 1);
                    p.lerpVectors(positions[i], positions[i + 1], e);
                } else {
                    here = i + 1;
                    p.copy(positions[i + 1]);
                }
            } else {
                returning = true;
                const k = (c - (STATIONS.length - 1) * leg) / RETURN;
                p.copy(arc.getPoint(THREE.MathUtils.smoothstep(k, 0, 1)));
                p.y -= 0.6;
            }
        }
        // No room for the return arc on phones: the lead disappears and restarts at the ad
        dot.current.visible = !(compact && returning);
        dot.current.position.set(p.x, p.y + 0.6 + (here >= 0 ? 0.55 : 0), p.z);
        if (here !== active) setActive(here);
    });

    return (
        <>
            <ambientLight intensity={2.5} />
            <directionalLight position={[4, 10, 2]} intensity={1.4} />
            {positions.slice(0, -1).map((a, i) => (
                <Line key={i} points={[a.clone().setY(0.05), positions[i + 1].clone().setY(0.05)]} color={C.dust} lineWidth={2} />
            ))}
            {!compact && <Line points={arcPoints} color={C.ember} lineWidth={1.2} dashed dashSize={0.3} gapSize={0.18} transparent opacity={0.7} />}
            {positions.map((pos, i) => (
                <Station key={i} index={i} pos={pos} active={reducedMotion || active === i} compact={compact} />
            ))}
            {!reducedMotion && (
                <mesh ref={dot}>
                    <sphereGeometry args={[0.16, 20, 20]} />
                    <meshBasicMaterial color={C.ember} />
                </mesh>
            )}
        </>
    );
}

export default function ConnectsScene({ reducedMotion, active }: { reducedMotion: boolean; active: boolean }) {
    return (
        <Canvas
            orthographic
            camera={{ position: [10, 8.5, 10], zoom: 40, near: -100, far: 200 }}
            flat
            dpr={[1, 1.75]}
            frameloop={active ? "always" : "never"}
            gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
            style={{ touchAction: "pan-y" }}
            aria-hidden
        >
            <Scene reducedMotion={reducedMotion} />
        </Canvas>
    );
}
