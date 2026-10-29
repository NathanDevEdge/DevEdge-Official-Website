// Shared drawing language for the 3D scenes: flat parchment faces with crisp edge lines,
// like a technical illustration.
import { Edges, Line } from "@react-three/drei";
import type { Detail } from "@/data/stack";

export const C = {
    face: "#FBF3E9",
    part: "#EED9BF", // inner components, a shade darker than the slabs
    edge: "#1A1008",
    ember: "#C97B3A",
    dust: "#D4B896",
    muted: "#7A5C3A",
};

export const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
};

// ── Small parts that sit on each layer, revealed as it opens up ───────────────
export function Part({ size, pos, round, edge }: { size: [number, number, number]; pos: [number, number, number]; round?: boolean; edge: string }) {
    return (
        <mesh position={pos}>
            {round ? <cylinderGeometry args={[size[0], size[0], size[1], 40]} /> : <boxGeometry args={size} />}
            <meshLambertMaterial color={C.part} />
            <Edges color={edge} threshold={20} />
        </mesh>
    );
}

export function LayerDetail({ detail, edge }: { detail: Detail; edge: string }) {
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
        case "invoice": // a short pile of documents
            return <>{[0, 1, 2].map((i) => p([1.5, 0.06, 1.9], -0.1 + i * 0.12, 0.1 - i * 0.12, i * 0.07))}</>;
        case "rack": // server fins
            return <>{[0, 1, 2, 3, 4, 5].map((i) => p([0.1, 0.32, 1.6], -1.15 + i * 0.3, 0.55))}</>;
    }
}

