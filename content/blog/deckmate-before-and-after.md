---
title: "DeckMate, Before and After: Rebuilding a Decking Website Around Its Calculator"
description: "How we rebuilt DeckMate's website around a deck calculator that turns a sketch into a take-off and a quote, and what made the calculator harder than it looks."
date: 2026-11-25
category: Websites
draft: true
beforeAfter:
  before:
    items:
      - The old DeckMate website
      - A deck calculator
      - "note: TODO what was wrong with the old site?"
    caption: "TODO: one line on the old site, in Nathan's words."
  after:
    items:
      - Draw the deck, get a take-off
      - Pick a range and colour
      - Written quote in 1 to 2 days
    caption: "From a tape measure to a proper quote."
flow:
  caption: "How a homeowner gets from a sketch to a written quote on deckmate.au."
  steps:
    - label: "Draw"
      text: "Start from a rectangle, L or U shape and type the side lengths."
    - label: "Take-off"
      text: "Boards, clips, joists, bearers and screws add up as you go."
    - label: "Choose"
      text: "WoodEvo HOME, WoodEvo ADVANCED or Millboard, in your colour."
    - label: "Quote"
      text: "DeckMate checks it and sends back a written quote."
---

DeckMate supplies WoodEvo and Millboard composite decking, dispatched from Melbourne and Sydney and delivered Australia-wide. Owner Graeme Bell has supplied more than 1,000 Australian homeowners, and almost every one of them starts with the same question: how much decking do I actually need?

We've worked with Graeme on DeckMate from the start, and this year our team gave the website a big upgrade. This post shows where it started, where it is now, and why the deck calculator at the heart of it was much harder to build than it looks.

## Before

<!-- TODO: before screenshot(s) of the old DeckMate site, and two or three lines from Nathan on what wasn't working. -->

The first DeckMate site gave customers a deck calculator and sent every enquiry into Zoho CRM, so no lead got lost in an inbox. In Graeme's words, it gave customers "an accurate way to measure their deck out and get the fastest quotes".

## After: draw your deck and we'll count every board

![The new DeckMate homepage: draw your deck and we'll count every board for you](/images/work/deckmate-home.webp)

The new [deckmate.au](https://deckmate.au) is built around one job: getting a homeowner from a tape measure to a proper quote. The calculator is the front door, not a page tucked away in the menu.

- **Draw the deck.** Start from a rectangle, L-shape or U-shape, then drag the corners or type each side length in millimetres or metres. Decks with several sections can have up to five shapes.
- **Get a take-off.** The deck area, boards, clip boxes, joists, bearers and screws add up as you draw.
- **Pick a range.** WoodEvo HOME, WoodEvo ADVANCED or Millboard, each explained in plain English: which one suits a pool, full sun or a bushfire zone.
- **Send it for a quote.** No account needed. DeckMate checks the take-off and sends back a written quote, usually within 1 to 2 business days.

There's also a trade section with trade accounts and a trade login for builders and installers.

## Why the deck calculator was hard to build

A deck calculator looks like simple maths: area divided by board coverage. That gets you a rough number. A take-off a supplier can quote from is a different thing.

<!-- TODO: these are inferred from what the calculator does. Nathan to correct or replace with the real war stories. -->

**Real decks aren't rectangles.** L-shapes, U-shapes and decks in several sections mean every row of boards can be a different length. The calculator has to work from the shape someone drew, not the box around it.

**Boards are bought by length, not by square metre.** Each range comes in different widths and lengths, so the count changes with the range you pick, and offcuts and joins have to be allowed for.

**It's not just boards.** Composite decking is clip fixed, and clips come in boxes. Joists and bearers have to be set out for the subframe underneath. All of it has to update the moment a corner moves.

**It has to be easy on a phone.** Most people measure their deck standing in the backyard. Dragging corners, typing lengths and switching between millimetres and metres all have to work with a thumb.

**It has to lead to a real quote.** The take-off isn't the end. It goes to DeckMate with the customer's details, so the team can check it and quote properly.

## What changed

<!-- TODO: any numbers Nathan can share (enquiries, quote turnaround, conversion). -->

If your business quotes from measurements, a calculator like this can do the first half of the job before the customer even calls. That's the kind of thing we build: see our [Web & Mobile Apps](/services/web-and-mobile-apps) work, or try our own free [decking calculator](/tools/decking-calculator).
