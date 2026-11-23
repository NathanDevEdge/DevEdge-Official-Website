import { defineTool } from "@/tools/types";
import DeckingCalculator from "./DeckingCalculator";

// The how-to text under the tool. Plain h2/h3/p/ul: the tool page wraps it in the site's prose styles.
function About() {
    return (
        <>
            <h2>How to use the decking calculator</h2>
            <p>
                Measure the deck, then fill in the four steps. The results update as you type, so you can try a different board,
                spacing or length and see what changes straight away.
            </p>
            <ul>
                <li>
                    <strong>Deck size.</strong> The length and width of the finished deck in metres, and which way the boards will run.
                    Boards usually run along the longer side, at right angles to the house, so rain drains off the ends.
                </li>
                <li>
                    <strong>Boards.</strong> The face width of the board (90 mm and 140 mm are the most common hardwood sizes), the gap
                    you'll leave between boards, and whether you're buying set lengths (such as 5.4 m) or random lengths by the metre.
                </li>
                <li>
                    <strong>Frame.</strong> How far apart the joists, bearers and posts or stumps will be. If you're only re-boarding an
                    existing frame, the board and screw numbers are the ones you need.
                </li>
                <li>
                    <strong>Fixing and waste.</strong> Screws or hidden clips, and how much extra to allow for offcuts, splits and mistakes.
                </li>
            </ul>
            <p>
                When you're happy, press <strong>Copy shopping list</strong> and paste it into an email or text to your timber yard.
            </p>

            <h2>How it works it out</h2>
            <h3>Decking boards</h3>
            <p>
                Each row of boards covers the board width plus one gap. The calculator divides the width across the boards by that, and
                rounds up, because you can't buy part of a row. It then multiplies the rows by the length of the run to get the lineal
                metres, and adds your waste allowance.
            </p>
            <p>
                For set lengths it works out how many boards you'll actually cut. If two rows fit in one board, the offcut gets used. If
                the deck is longer than a board, it allows for a join in every row. It also tells you when a different stock length would
                leave less offcut.
            </p>
            <h3>Joists, bearers and posts</h3>
            <p>
                Joists sit under the boards at right angles to them. Bearers sit under the joists, running the same way as the boards,
                and the posts or stumps hold up the bearers. For each one, the calculator divides the distance by the spacing, rounds up
                and adds one, because you need a member at both ends.
            </p>
            <h3>Screws and clips</h3>
            <p>
                Face-fixed boards take two screws at every joist they cross. Hidden clips go in each gap at every joist, plus a start and
                end clip. Both counts include 5% spare for the ones that get dropped through the gaps.
            </p>

            <h2>Worked example</h2>
            <p>
                A 5 m by 4 m deck, with 90 mm boards running along the 5 m length, a 5 mm gap, 5.4 m boards, joists at 450 mm and
                bearers and stumps at 1,800 mm:
            </p>
            <ul>
                <li>
                    <strong>Rows:</strong> each row takes 95 mm (90 mm board plus 5 mm gap), and 4,000 mm across needs 43 rows. The last
                    row is a thin 10 mm strip, so the calculator suggests ripping the first and last boards to the same width instead.
                </li>
                <li>
                    <strong>Boards:</strong> 43 rows of 5 m is 215 lineal metres. Each 5.4 m board covers one row, so that's 43 boards, or
                    48 with 10% waste.
                </li>
                <li>
                    <strong>Joists:</strong> 5,000 mm at 450 mm centres is 12 spaces, so 13 joists, each 4 m long.
                </li>
                <li>
                    <strong>Bearers and stumps:</strong> 4,000 mm at 1,800 mm centres is 3 spaces, so 4 bearers of 5 m, each on 4 stumps,
                    for 16 stumps.
                </li>
                <li>
                    <strong>Screws:</strong> 43 rows times 13 joists times 2 screws is 1,118, or 1,174 with 5% spare.
                </li>
            </ul>

            <h2>Getting the spacing right</h2>
            <p>
                Joist spacing depends on the board, not just the frame. 450 mm centres is standard for 19 mm thick hardwood boards, while
                most composite boards need 350 to 400 mm, and boards laid on an angle need closer joists again. Bearer and post spacing
                depend on the size and grade of your joists and bearers. In Australia these come from the span tables in AS 1684 or your
                timber supplier's tables, and your council may need to approve a raised deck.
            </p>
            <p>
                This calculator is for estimating and ordering. It doesn't size your frame or replace your builder, engineer or the board
                maker's installation guide.
            </p>
        </>
    );
}

export default defineTool({
    slug: "decking-calculator",
    name: "Decking Calculator",
    linkText: "Decking calculator by DevEdge",
    categories: ["trade-installer"],
    summary: "Work out the boards, joists, bearers, posts and screws or clips for any deck, in metric.",
    tagline:
        "Enter your deck size and board details to see how many decking boards, joists, bearers, posts and screws you need, with waste included.",
    seoTitle: "Decking Calculator: Boards, Joists, Screws & Clips (Metric) | DevEdge",
    seoDescription:
        "Free decking calculator for Australian decks. Work out how many deck boards, joists, bearers, stumps and screws or clips you need, with waste included.",
    launched: "2026-11-24",
    Component: DeckingCalculator,
    About,
    faqs: [
        {
            q: "How many deck boards do I need?",
            a: "Divide the deck's width (across the boards) by the board width plus the gap, and round up to get the number of rows. Multiply the rows by the deck's length to get lineal metres, then add 10% for waste. The calculator does this for you and turns it into a board count for the length you're buying.",
        },
        {
            q: "How much waste should I allow for decking?",
            a: "Around 10% for a simple rectangular deck, and 15% or more for decks with angles, curves, steps or a diagonal board pattern. If you're buying boards in a length that suits your deck, you can go lower.",
        },
        {
            q: "What gap should I leave between deck boards?",
            a: "Most hardwood decks use a 3 to 5 mm gap, depending on how dry the boards are when laid. Composite boards usually have a set gap, often from the clip system. Always follow the board maker's guide.",
        },
        {
            q: "What joist spacing do I need for decking?",
            a: "450 mm centres is standard for 19 mm thick hardwood boards. Most composite boards need 350 to 400 mm centres, and boards laid diagonally need closer joists. Check your board maker's installation guide.",
        },
        {
            q: "How many screws do I need per square metre of decking?",
            a: "With 90 mm boards and joists at 450 mm, it's roughly 45 to 50 screws per square metre: two screws in every board at every joist. Wider boards and wider joist spacing need fewer. The calculator works out the exact count for your deck.",
        },
        {
            q: "Can I put this calculator on my own website?",
            a: "Yes. It's free to embed. Use the embed code on this page, and your visitors can use it without leaving your site.",
        },
    ],
    related: {
        service: "web-and-mobile-apps",
        post: "how-many-deck-boards-do-i-need",
    },
    embedHeight: 1280,
});
