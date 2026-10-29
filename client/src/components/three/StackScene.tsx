// "The Stack": DevEdge's services as one machined block that explodes into its parts,
// drawn like a technical illustration (flat faces + crisp edge lines). Loaded lazily:
// three.js never ships in the main bundle.
import { useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Html, Line, useTexture } from "@react-three/drei";
import * as THREE from "three";

const C = {
    face: "#FBF3E9",
    part: "#EED9BF", // inner components, a shade darker than the slabs
    edge: "#1A1008",
    ember: "#C97B3A",
    dust: "#D4B896",
    muted: "#7A5C3A",
};

import { STACK_LAYERS, type Detail, type StackLayer } from "@/data/stack";

const GROW_COUNT = 3; // the top three layers are "Grow it", the rest "Build it"

const W = 3.2; // slab footprint
const GAP = 0.95; // extra space between layers when fully exploded
const LEADER = 0.9; // leader line length, in world units

const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
};

// ── Small parts that sit on each layer, revealed as it opens up ───────────────
function Part({ size, pos, round, edge }: { size: [number, number, number]; pos: [number, number, number]; round?: boolean; edge: string }) {
    return (
        <mesh position={pos}>
            {round ? <cylinderGeometry args={[size[0], size[0], size[1], 40]} /> : <boxGeometry args={size} />}
            <meshLambertMaterial color={C.part} />
            <Edges color={edge} threshold={20} />
        </mesh>
    );
}

function LayerDetail({ detail, edge }: { detail: Detail; edge: string }) {
    const p = (size: [number, number, number], x: number, z: number, y = 0, round = false) => (
        <Part key={`${x},${z},${y},${size.join()}`} size={size} pos={[x, y + size[1] / 2, z]} round={round} edge={edge} />
    );
    switch (detail) {
        case "target": // concentric rings around the shaft
            return <>{p([1.25, 0.05, 0], 0, 0, 0, true)}{p([0.85, 0.1, 0], 0, 0, 0, true)}{p([0.45, 0.16, 0], 0, 0, 0, true)}</>;
        case "bars": // rising rankings
            return <>{[0.1, 0.2, 0.32, 0.46].map((hh, i) => p([0.32, hh, 0.32], -0.9 + i * 0.5, 0.95))}</>;
        case "graph": {
            const pts = [[-1.1, 0.12], [-0.5, 0.3], [0.1, 0.2], [0.7, 0.42], [1.15, 0.5]] as const;
            return (
                <>
                    {pts.map(([x, hh]) => p([0.07, hh, 0.07], x, -0.9))}
                    <Line points={pts.map(([x, hh]) => [x, hh, -0.9] as [number, number, number])} color={C.ember} lineWidth={2} />
                </>
            );
        }
        case "browser": // a page: frame, nav bar, hero and content blocks
            return (
                <>
                    {p([2.3, 0.05, 1.5], 0.1, 0.45)}
                    {p([2.1, 0.06, 0.18], 0.1, -0.14, 0.05)}
                    {p([1.2, 0.1, 0.5], -0.35, 0.4, 0.05)}
                    {p([0.6, 0.14, 0.5], 0.75, 0.4, 0.05)}
                    {p([2.1, 0.08, 0.25], 0.1, 0.92, 0.05)}
                </>
            );
        case "devices": // phone and tablet
            return <>{p([0.55, 0.08, 1.0], -0.9, 0.6)}{p([1.0, 0.06, 1.3], 0.65, 0.4)}{p([0.25, 0.04, 0.06], -0.9, 0.12, 0.08)}</>;
        case "database": // three data stores
            return <>{p([0.32, 0.36, 0], -0.85, 0.75, 0, true)}{p([0.32, 0.5, 0], 0.15, 0.95, 0, true)}{p([0.32, 0.28, 0], 0.95, 0.35, 0, true)}</>;
        case "rack": // server fins
            return <>{[0, 1, 2, 3, 4, 5].map((i) => p([0.1, 0.32, 1.6], -1.15 + i * 0.3, 0.55))}</>;
    }
}

// ── One layer: slab + its parts + label with leader line ──────────────────────
function Layer({
    layer,
    index,
    yRef,
    tRef,
    hovered,
    setHovered,
    onSelect,
    compact,
}: {
    layer: StackLayer;
    index: number;
    yRef: MutableRefObject<number[]>;
    tRef: MutableRefObject<number>;
    hovered: number | null;
    setHovered: (i: number | null) => void;
    onSelect: (slug: string) => void;
    compact: boolean;
}) {
    const group = useRef<THREE.Group>(null);
    const parts = useRef<THREE.Group>(null);
    const label = useRef<HTMLButtonElement>(null);
    const leader = useRef<any>(null);
    const isHover = hovered === index;
    const edge = isHover ? C.ember : C.edge;

    // Rightmost corner on screen, at mid-height; the leader runs screen-right from it
    const corner: [number, number, number] = [W / 2, 0, -W / 2];
    const tip: [number, number, number] = [W / 2 + LEADER * 0.707, 0, -W / 2 - LEADER * 0.707];

    useFrame(() => {
        const t = tRef.current;
        if (group.current) {
            const lift = isHover ? 0.12 : 0;
            group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, yRef.current[index] + lift, 0.2);
        }
        // Each layer's parts and label appear in turn as the stack opens, top first
        const own = smooth(0.15 + index * 0.08, 0.55 + index * 0.06, t);
        if (parts.current) {
            parts.current.scale.set(1, Math.max(own, 0.0001), 1);
            parts.current.visible = own > 0.01; // a clean, closed block when assembled
        }
        if (leader.current) leader.current.material.opacity = own;
        if (label.current) {
            label.current.style.opacity = String(own);
            label.current.style.pointerEvents = own > 0.6 ? "auto" : "none";
        }
    });

    return (
        <group ref={group}>
            <mesh
                onPointerOver={(e) => (e.stopPropagation(), setHovered(index))}
                onPointerOut={() => setHovered(null)}
                onClick={(e) => (e.stopPropagation(), onSelect(layer.slug))}
            >
                <boxGeometry args={[W, layer.h, W]} />
                <meshLambertMaterial color={C.face} />
                <Edges color={edge} threshold={20} />
            </mesh>
            <group ref={parts} position={[0, layer.h / 2, 0]}>
                <LayerDetail detail={layer.detail} edge={edge} />
            </group>
            <Line ref={leader} points={[corner, tip]} color={isHover ? C.ember : C.muted} lineWidth={1} transparent opacity={0} />
            <Html position={tip} center={false} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
                <button
                    ref={label}
                    type="button"
                    onClick={() => onSelect(layer.slug)}
                    onPointerEnter={() => setHovered(index)}
                    onPointerLeave={() => setHovered(null)}
                    className="stack-label"
                    data-active={isHover || undefined}
                    style={{ opacity: 0 }}
                >
                    <span className="stack-label-num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="stack-label-name">{compact ? layer.short : layer.name}</span>
                </button>
            </Html>
        </group>
    );
}

// ── Group brackets on the left: "GROW IT" over the top layers, "BUILD IT" below ─
function Bracket({ from, to, yRef, tRef, text }: { from: number; to: number; yRef: MutableRefObject<number[]>; tRef: MutableRefObject<number>; text: string }) {
    const line = useRef<any>(null);
    const html = useRef<HTMLDivElement>(null);
    const g = useRef<THREE.Group>(null);
    const off = 0.55;
    useFrame(() => {
        const top = yRef.current[from] + STACK_LAYERS[from].h / 2;
        const bottom = yRef.current[to] - STACK_LAYERS[to].h / 2;
        const a = smooth(0.55, 0.9, tRef.current);
        if (g.current) g.current.position.y = (top + bottom) / 2;
        if (line.current) {
            const half = (top - bottom) / 2;
            line.current.geometry.setPositions([0, half, 0, -0.15, half, 0.15, -0.15, -half, 0.15, 0, -half, 0]);
            line.current.material.opacity = a;
        }
        if (html.current) html.current.style.opacity = String(a);
    });
    return (
        <group ref={g} position={[-W / 2 - off * 0.707, 0, W / 2 + off * 0.707]}>
            <Line ref={line} points={[[0, 0.5, 0], [-0.15, 0.5, 0.15], [-0.15, -0.5, 0.15], [0, -0.5, 0]]} color={C.ember} lineWidth={1.2} transparent />
            <Html position={[-0.3, 0, 0.3]} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
                <div ref={html} className="stack-bracket" style={{ opacity: 0 }}>{text}</div>
            </Html>
        </group>
    );
}

// ── Centre line through every layer (drawn dash-dot, like a drawing's centre line),
//    with "leads" travelling down from the ads to the systems underneath ───────────
function Shaft({ yRef, tRef, animate }: { yRef: MutableRefObject<number[]>; tRef: MutableRefObject<number>; animate: boolean }) {
    const line = useRef<any>(null);
    const dots = useRef<THREE.Mesh[]>([]);
    useFrame(({ clock }) => {
        const top = yRef.current[0] + 0.9;
        const bottom = yRef.current[STACK_LAYERS.length - 1] - 0.5;
        const span = top - bottom;
        const a = smooth(0.4, 0.8, tRef.current);
        if (line.current) {
            line.current.geometry.setPositions([0, top, 0, 0, bottom, 0]);
            line.current.computeLineDistances();
            line.current.material.opacity = 0.85 * a;
        }
        dots.current.forEach((d, i) => {
            if (!d) return;
            const phase = animate ? (clock.elapsedTime * 0.18 + i / 3) % 1 : 0.2 + i * 0.3;
            d.position.y = top - 0.3 - phase * (span - 0.6);
            (d.material as THREE.MeshBasicMaterial).opacity = a * Math.sin(phase * Math.PI);
        });
    });
    return (
        <>
            <Line
                ref={line}
                points={[[0, 1, 0], [0, 0, 0]]}
                color={C.ember}
                lineWidth={1.5}
                dashed
                dashSize={0.35}
                gapSize={0.12}
                transparent
                opacity={0}
                depthTest={false}
                renderOrder={10}
            />
            {[0, 1, 2].map((i) => (
                <mesh key={i} ref={(el) => { if (el) dots.current[i] = el; }} renderOrder={11}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshBasicMaterial color={C.ember} transparent opacity={0} depthTest={false} />
                </mesh>
            ))}
        </>
    );
}

// ── DE mark on the lid, visible while assembled ─────────────────────────────────
function Lid({ yRef, tRef }: { yRef: MutableRefObject<number[]>; tRef: MutableRefObject<number> }) {
    const tex = useTexture("/images/logo-mark.webp");
    const mesh = useRef<THREE.Mesh>(null);
    useMemo(() => { tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; }, [tex]);
    useFrame(() => {
        if (!mesh.current) return;
        mesh.current.position.y = yRef.current[0] + STACK_LAYERS[0].h / 2 + 0.002;
        const a = 1 - smooth(0.05, 0.3, tRef.current);
        (mesh.current.material as THREE.MeshBasicMaterial).opacity = a;
        mesh.current.visible = a > 0.01;
    });
    return (
        <mesh ref={mesh} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
            <planeGeometry args={[1.3, 1.3]} />
            <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
    );
}

// ── Scene: positions, camera framing, pointer parallax ──────────────────────────
function Scene({ progressRef, reducedMotion, onSelect }: { progressRef: MutableRefObject<number>; reducedMotion: boolean; onSelect: (slug: string) => void }) {
    const { size, camera } = useThree();
    const compact = size.width < 640;
    const [hovered, setHovered] = useState<number | null>(null);
    const tRef = useRef(reducedMotion ? 1 : 0);
    const yRef = useRef<number[]>(STACK_LAYERS.map(() => 0));
    const rig = useRef<THREE.Group>(null);
    const pointer = useRef({ x: 0, y: 0 });

    useFrame((state, dt) => {
        // Ease toward the scroll position rather than snapping to it
        const target = reducedMotion ? 1 : progressRef.current;
        tRef.current = THREE.MathUtils.damp(tRef.current, target, 6, dt);
        const t = tRef.current;

        // Stack layers from the bottom up; each gap grows with t
        let y = 0;
        for (let i = STACK_LAYERS.length - 1; i >= 0; i--) {
            const h = STACK_LAYERS[i].h;
            yRef.current[i] = y + h / 2;
            y += h + GAP * t;
        }
        const height = y - GAP * t;

        // Frame the whole stack plus room for labels (right) and brackets (left)
        const cam = camera as THREE.OrthographicCamera;
        // Room for labels/brackets is only reserved as they appear, so the closed block fills the frame
        const open = smooth(0.1, 0.6, t);
        const labelPx = 20 + (compact ? 110 : 220) * open;
        const bracketPx = 20 + (compact ? 0 : 110) * open;
        const projH = 0.857 * height + W * 1.414 * 0.516 + 0.8;
        const projW = W * 1.414 + LEADER * open;
        const zoom = Math.min((size.width - labelPx - bracketPx) / projW, (size.height * 0.92) / projH);
        cam.zoom = THREE.MathUtils.damp(cam.zoom, zoom, 6, dt);
        const shift = (labelPx - bracketPx) / 2 / cam.zoom; // keep the drawing centred with its labels
        const right = new THREE.Vector3(1, 0, -1).normalize();
        const look = new THREE.Vector3(0, height / 2, 0).addScaledVector(right, shift);
        cam.position.set(look.x + 10, look.y + 8.5, look.z + 10);
        cam.lookAt(look);
        cam.updateProjectionMatrix();

        // A little parallax so it reads as a real object, not a picture
        if (rig.current && !reducedMotion) {
            pointer.current.x = THREE.MathUtils.damp(pointer.current.x, state.pointer.x, 3, dt);
            pointer.current.y = THREE.MathUtils.damp(pointer.current.y, state.pointer.y, 3, dt);
            rig.current.rotation.y = pointer.current.x * 0.12 + Math.sin(state.clock.elapsedTime * 0.25) * 0.03;
            rig.current.rotation.x = -pointer.current.y * 0.04;
            rig.current.position.y = height / 2;
            rig.current.children[0].position.y = -height / 2;
        }
    });

    return (
        <>
            <ambientLight intensity={2.5} />
            <directionalLight position={[4, 10, 2]} intensity={1.4} />
            <directionalLight position={[-6, 2, 8]} intensity={0.35} />
            <group ref={rig}>
                <group>
                    {STACK_LAYERS.map((layer, i) => (
                        <Layer
                            key={layer.slug}
                            layer={layer}
                            index={i}
                            yRef={yRef}
                            tRef={tRef}
                            hovered={hovered}
                            setHovered={setHovered}
                            onSelect={onSelect}
                            compact={compact}
                        />
                    ))}
                    <Shaft yRef={yRef} tRef={tRef} animate={!reducedMotion} />
                    <Lid yRef={yRef} tRef={tRef} />
                    {!compact && <Bracket from={0} to={GROW_COUNT - 1} yRef={yRef} tRef={tRef} text="Grow it" />}
                    {!compact && <Bracket from={GROW_COUNT} to={STACK_LAYERS.length - 1} yRef={yRef} tRef={tRef} text="Build it" />}
                </group>
            </group>
        </>
    );
}

export default function StackScene({
    progressRef,
    reducedMotion,
    active,
    onSelect,
}: {
    progressRef: MutableRefObject<number>;
    reducedMotion: boolean;
    active: boolean;
    onSelect: (slug: string) => void;
}) {
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
            <Scene progressRef={progressRef} reducedMotion={reducedMotion} onSelect={onSelect} />
        </Canvas>
    );
}
