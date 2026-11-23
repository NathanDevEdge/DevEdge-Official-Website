import { describe, expect, it } from "vitest";
import { DEFAULTS, bestBoardLength, boardsForRows, calculate, membersOver, validate } from "./calc";

describe("decking calculator", () => {
    it("works out the default 5 x 4 m deck", () => {
        const r = calculate(DEFAULTS);
        // 4000 mm across at 95 mm pitch: 42 boards + 41 gaps = 3985 mm, so 43 rows
        expect(r.rows).toBe(43);
        expect(r.lastBoardMm).toBe(4000 - 42 * 95); // 10 mm sliver on the last row
        expect(r.areaM2).toBe(20);
        expect(r.boardLmNet).toBe(215);
        expect(r.boardLm).toBe(236.5);
        // 5 m rows from 5.4 m boards: one row per board
        expect(r.boardsNet).toBe(43);
        expect(r.boards).toBe(48); // 43 x 1.1 = 47.3, rounded up
        expect(r.joinsPerRow).toBe(0);
        // Joists at 450 centres over 5 m: ceil(11.1) + 1
        expect(r.joists).toEqual({ count: 13, lengthM: 4, totalLm: 52 });
        // Bearers at 1800 centres over 4 m: ceil(2.2) + 1
        expect(r.bearers).toEqual({ count: 4, lengthM: 5, totalLm: 20 });
        expect(r.posts).toBe(4 * 4);
        expect(r.fixings.net).toBe(43 * 13 * 2);
        expect(r.fixings.count).toBe(Math.ceil(43 * 13 * 2 * 1.05));
    });

    it("counts clips as one per gap plus the two ends, per joist", () => {
        const r = calculate({ ...DEFAULTS, fixing: "clips" });
        expect(r.fixings.net).toBe((43 + 1) * 13);
    });

    it("covers the width exactly when the boards fit", () => {
        // 10 boards of 90 + 9 gaps of 10 = 990 mm
        const r = calculate({ ...DEFAULTS, acrossM: 0.99, gapMm: 10 });
        expect(r.rows).toBe(10);
        expect(r.lastBoardMm).toBe(90);
    });

    it("doesn't add a row for a strip narrower than one gap", () => {
        // 25 boards of 140 + 24 gaps of 4 = 3596 mm: 4 mm short, which is just an edge gap
        const r = calculate({ ...DEFAULTS, acrossM: 3.6, boardWidthMm: 140, gapMm: 4 });
        expect(r.rows).toBe(25);
        expect(r.lastBoardMm).toBe(140);
        // One more millimetre past a full gap does need a ripped row
        expect(calculate({ ...DEFAULTS, acrossM: 3.605, boardWidthMm: 140, gapMm: 4 }).rows).toBe(26);
    });

    it("reuses offcuts when two rows fit in one board", () => {
        expect(boardsForRows(10, 2.4, 5.4)).toBe(5);
        expect(boardsForRows(11, 2.4, 5.4)).toBe(6);
    });

    it("joins boards end to end when the deck is longer than a board", () => {
        // 8 m run from 5.4 m boards: 1 full board + 2.6 m piece per row, and 2 pieces fit in a board
        expect(boardsForRows(10, 8, 5.4)).toBe(10 + 5);
        const r = calculate({ ...DEFAULTS, runM: 8 });
        expect(r.joinsPerRow).toBe(1);
        // An exact multiple needs no part boards
        expect(boardsForRows(10, 10.8, 5.4)).toBe(20);
    });

    it("leaves board counts out for random lengths", () => {
        const r = calculate({ ...DEFAULTS, boardLengthM: 0 });
        expect(r.boards).toBeUndefined();
        expect(r.boardLm).toBe(236.5);
    });

    it("always has at least two joists and bearers", () => {
        expect(membersOver(300, 450)).toBe(2);
        expect(membersOver(900, 450)).toBe(3);
    });

    it("ignores floating point noise", () => {
        // 0.1 + 0.2 style errors must not add a joist: 4.5 m at 450 centres is exactly 10 spaces
        expect(membersOver(4.5 * 1000, 450)).toBe(11);
        expect(calculate({ ...DEFAULTS, runM: 4.5 }).joists.count).toBe(11);
    });

    it("picks the stock length with the least offcut", () => {
        // 2.7 m rows: 5.4 m boards give exactly two rows each, no offcut
        expect(bestBoardLength(2.7, 20, [3.6, 4.2, 4.8, 5.4, 6.0]).lengthM).toBe(5.4);
    });

    it("rejects inputs it can't use", () => {
        expect(validate(DEFAULTS)).toBeNull();
        expect(validate({ ...DEFAULTS, runM: 0 })).toMatch(/length and width/);
        expect(validate({ ...DEFAULTS, boardWidthMm: 5 })).toMatch(/Board width/);
        expect(validate({ ...DEFAULTS, gapMm: -1 })).toMatch(/gap/);
        expect(validate({ ...DEFAULTS, boardLengthM: 0.3 })).toMatch(/at least/);
        expect(validate({ ...DEFAULTS, wastePct: 80 })).toMatch(/Waste/);
    });
});
