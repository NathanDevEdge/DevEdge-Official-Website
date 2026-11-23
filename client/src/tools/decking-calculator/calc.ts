// Decking calculator maths. Pure functions only, so the page, the embed and the
// tests all share one source of truth. Everything is Australian metric:
// deck sizes in metres, board widths, gaps and spacings in millimetres.
//
// The layout it assumes is the standard one for a ground-level or raised deck:
//   - Decking boards run along the "board run" direction.
//   - Joists sit under the boards, at right angles to them, spaced along the run.
//   - Bearers sit under the joists, parallel to the boards, spaced across the deck.
//   - Posts or stumps hold up the bearers.

export type Fixing = "screws" | "clips";

export interface DeckInputs {
    /** Deck size the way the boards run, in metres */
    runM: number;
    /** Deck size across the boards, in metres */
    acrossM: number;
    /** Board face width in mm (e.g. 90, 140) */
    boardWidthMm: number;
    /** Gap between boards in mm */
    gapMm: number;
    /** Length of the boards being bought, in metres. 0 = random lengths, buy by the lineal metre */
    boardLengthM: number;
    /** Joist centres in mm */
    joistSpacingMm: number;
    /** Bearer centres in mm */
    bearerSpacingMm: number;
    /** Post or stump centres along each bearer, in mm */
    postSpacingMm: number;
    fixing: Fixing;
    /** Extra board allowance for offcuts and mistakes, as a percentage (10 = 10%) */
    wastePct: number;
}

export interface DeckResult {
    areaM2: number;
    /** Rows of boards laid side by side across the deck */
    rows: number;
    /** Width of the last row in mm. Less than the board width means it gets ripped down. */
    lastBoardMm: number;
    /** Boards needed with no allowance, then with the waste allowance added */
    boardLmNet: number;
    boardLm: number;
    /** Only when a board length is set */
    boardsNet?: number;
    boards?: number;
    /** Joins along each row (boards shorter than the run). Each join needs to land on a joist. */
    joinsPerRow: number;
    joists: { count: number; lengthM: number; totalLm: number };
    bearers: { count: number; lengthM: number; totalLm: number };
    posts: number;
    /** Screws or clips, including a small spare allowance */
    fixings: { type: Fixing; count: number; net: number };
}

export const DEFAULTS: DeckInputs = {
    runM: 5,
    acrossM: 4,
    boardWidthMm: 90,
    gapMm: 5,
    boardLengthM: 5.4,
    joistSpacingMm: 450,
    bearerSpacingMm: 1800,
    postSpacingMm: 1800,
    fixing: "screws",
    wastePct: 10,
};

/** Extra screws or clips on top of the exact count, for drops and the odd bad one */
export const FIXING_SPARE_PCT = 5;
/** Screws per board at each joist it crosses */
export const SCREWS_PER_CROSSING = 2;

const EPS = 1e-9;
/** Rounds away float noise (0.1 + 0.2) before a ceil or floor */
const clean = (n: number) => Math.round(n * 1e6) / 1e6;
const ceil = (n: number) => Math.ceil(clean(n) - EPS);
const floor = (n: number) => Math.floor(clean(n) + EPS);
const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Members spaced at `spacing` centres over `length`, with one at each end */
export const membersOver = (lengthMm: number, spacingMm: number) => Math.max(2, ceil(lengthMm / spacingMm) + 1);

/** Why an input can't be used, in plain English, or null when they're all fine */
export function validate(i: DeckInputs): string | null {
    const ok = (n: number) => Number.isFinite(n) && n > 0;
    if (!ok(i.runM) || !ok(i.acrossM)) return "Enter the deck's length and width in metres.";
    if (i.runM > 100 || i.acrossM > 100) return "That's a very big deck. Keep each side under 100 metres.";
    if (!ok(i.boardWidthMm) || i.boardWidthMm < 40 || i.boardWidthMm > 300) return "Board width should be between 40 and 300 mm.";
    if (!Number.isFinite(i.gapMm) || i.gapMm < 0 || i.gapMm > 20) return "The gap between boards should be between 0 and 20 mm.";
    if (!Number.isFinite(i.boardLengthM) || i.boardLengthM < 0 || i.boardLengthM > 12) return "Board length should be up to 12 metres.";
    if (i.boardLengthM > 0 && i.boardLengthM < 0.6) return "Board length should be at least 0.6 metres.";
    if (!ok(i.joistSpacingMm) || i.joistSpacingMm < 200 || i.joistSpacingMm > 900) return "Joist spacing should be between 200 and 900 mm.";
    if (!ok(i.bearerSpacingMm) || i.bearerSpacingMm < 400 || i.bearerSpacingMm > 6000) return "Bearer spacing should be between 400 and 6000 mm.";
    if (!ok(i.postSpacingMm) || i.postSpacingMm < 400 || i.postSpacingMm > 6000) return "Post spacing should be between 400 and 6000 mm.";
    if (!Number.isFinite(i.wastePct) || i.wastePct < 0 || i.wastePct > 50) return "Waste allowance should be between 0 and 50%.";
    return null;
}

/**
 * How many boards of `boardLengthM` it takes to lay `rows` rows that are each `runM` long.
 * Offcuts are reused where a whole row piece fits in them, but short scraps aren't.
 */
export function boardsForRows(rows: number, runM: number, boardLengthM: number): number {
    if (rows <= 0) return 0;
    const piecesPerBoard = floor(boardLengthM / runM);
    if (piecesPerBoard >= 1) return ceil(rows / piecesPerBoard);

    // The run is longer than one board: full boards end to end, then a shorter piece to finish
    const fullPerRow = floor(runM / boardLengthM);
    const remainder = clean(runM - fullPerRow * boardLengthM);
    if (remainder <= 0) return rows * fullPerRow;
    const remaindersPerBoard = Math.max(1, floor(boardLengthM / remainder));
    return rows * fullPerRow + ceil(rows / remaindersPerBoard);
}

export function calculate(i: DeckInputs): DeckResult {
    const runMm = i.runM * 1000;
    const acrossMm = i.acrossM * 1000;
    const pitch = i.boardWidthMm + i.gapMm;

    // Rows: n boards plus (n - 1) gaps cover the width across the deck. A strip no wider
    // than one gap left at the edge doesn't need another row, so n x (board + gap) is enough.
    const rows = Math.max(1, ceil(acrossMm / pitch));
    const lastBoardMm = Math.round(Math.min(i.boardWidthMm, acrossMm - (rows - 1) * pitch));

    const waste = 1 + i.wastePct / 100;
    const boardLmNet = rows * i.runM;
    const boardLm = boardLmNet * waste;

    let boardsNet: number | undefined;
    let boards: number | undefined;
    let joinsPerRow = 0;
    if (i.boardLengthM > 0) {
        boardsNet = boardsForRows(rows, i.runM, i.boardLengthM);
        boards = ceil(boardsNet * waste);
        joinsPerRow = Math.max(0, ceil(i.runM / i.boardLengthM) - 1);
    }

    // Joists run across the deck, spaced along the run
    const joistCount = membersOver(runMm, i.joistSpacingMm);
    // Bearers run along the deck, spaced across it, under the joists
    const bearerCount = membersOver(acrossMm, i.bearerSpacingMm);
    const postsPerBearer = membersOver(runMm, i.postSpacingMm);

    const crossings = rows * joistCount;
    const fixingsNet = i.fixing === "screws" ? crossings * SCREWS_PER_CROSSING : (rows + 1) * joistCount; // one clip per gap, plus a start and end clip
    const fixings = ceil(fixingsNet * (1 + FIXING_SPARE_PCT / 100));

    return {
        areaM2: round2(i.runM * i.acrossM),
        rows,
        lastBoardMm,
        boardLmNet: round1(boardLmNet),
        boardLm: round1(boardLm),
        boardsNet,
        boards,
        joinsPerRow,
        joists: { count: joistCount, lengthM: i.acrossM, totalLm: round1(joistCount * i.acrossM) },
        bearers: { count: bearerCount, lengthM: i.runM, totalLm: round1(bearerCount * i.runM) },
        posts: bearerCount * postsPerBearer,
        fixings: { type: i.fixing, count: fixings, net: fixingsNet },
    };
}

/** Of the common stock lengths, the one that leaves the least offcut for this deck */
export function bestBoardLength(runM: number, rows: number, lengths: number[]): { lengthM: number; boards: number; offcutLm: number } {
    let best = { lengthM: lengths[0], boards: Infinity, offcutLm: Infinity };
    for (const L of lengths) {
        const boards = boardsForRows(rows, runM, L);
        const offcutLm = round1(boards * L - rows * runM);
        if (offcutLm < best.offcutLm - EPS || (Math.abs(offcutLm - best.offcutLm) < EPS && boards < best.boards)) {
            best = { lengthM: L, boards, offcutLm };
        }
    }
    return best;
}
