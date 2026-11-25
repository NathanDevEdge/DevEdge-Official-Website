---
title: "DeckMate, Before and After: Rebuilding a Decking Website Around Its Calculator"
description: "How we rebuilt DeckMate's website around its deck calculator, and the problems behind turning a rough sketch into a take-off, a quote and an order."
date: 2026-11-25
category: Websites
draft: true
beforeAfter:
  before:
    items:
      - A dark, photo-led homepage
      - The calculator as a separate tool
      - Drag the corners, no typing
      - "note: where do I type 3.6m??"
    caption: "It looked good. The calculator felt like a different site."
  after:
    items:
      - The calculator is the front door
      - Type 3.6m and the corners stay square
      - Clips and screws matched to the job
    caption: "From a sketch on a phone to a real quote."
flow:
  caption: "How a sketch becomes a quote, and for installers, an order."
  steps:
    - label: "Draw"
      text: "Rectangle, L or U, then type the sides or drag the corners."
    - label: "Take-off"
      text: "Boards, clips, joists, bearers and screws add up as you go."
    - label: "Match"
      text: "Real stock items picked for the range, frame and bushfire rating."
    - label: "Quote"
      text: "DeckMate checks it and quotes, with prices from Zoho."
    - label: "Order"
      text: "Installers add their margin and order from the same drawing."
---

DeckMate supplies WoodEvo and Millboard composite decking, delivered Australia-wide from Melbourne and Sydney. Owner Graeme Bell has supplied more than 1,000 Australian homeowners, and nearly every one of them starts with the same question: how much decking do I actually need?

We've built DeckMate with Graeme from the start: the website, the deck calculator, an installer portal and the Zoho systems behind them. This month our team gave the website a big upgrade. Here's where it started, where it is now, and why the calculator at the heart of it was a lot harder than it looks.

## Before: a good-looking site with a calculator off to the side

![The old DeckMate homepage: "The perfect deck, made simple." over a dark photo of a deck](/images/work/deckmate-before-home.webp)

The original DeckMate site was dark and photo-led, with a bold "The perfect deck, made simple." headline and a big "Get Instant Quote" button. Behind it was a lot of machinery. Every calculator enquiry created a deal in Zoho CRM and an estimate in Zoho Books, the products and colours came straight from Zoho Inventory, and installers had their own portal for quotes and orders.

![The old DeckMate calculator: a separate tool with shapes drawn on a grid](/images/work/deckmate-before-calculator.webp)

The calculator was where it showed its age. It opened as a separate tool that didn't look like the rest of the site. You could only change a shape by dragging its handles, with nowhere to simply type "3.6 metres", and an L-shaped deck had to be built from two rectangles. It worked, but it asked a lot of someone standing in their backyard with a tape measure.

## After: draw your deck and we'll count every board

![The new DeckMate homepage: draw your deck and we'll count every board for you](/images/work/deckmate-home.webp)

The new [deckmate.au](https://deckmate.au) is built around one job: getting someone from a tape measure to a proper quote. The calculator isn't tucked away in the menu any more. It's the headline, it's on the homepage, and it lives inside the site instead of beside it.

![The new DeckMate calculator with an L-shaped deck and its side lengths typed in](/images/work/deckmate-after-calculator.webp)

- **Start from a shape.** A rectangle, an L or a U, placed for you, with up to five shapes for decks in several sections.
- **Type the sides, or drag them.** Tap any side and type its length; the drawing follows.
- **Read the take-off.** Deck area, boards, clip boxes, joists, bearers and screws, updated as you go.
- **Pick a range and send it.** WoodEvo HOME, WoodEvo ADVANCED or Millboard, explained in plain English, and no account needed. DeckMate checks every take-off and sends a written quote, usually within 1 to 2 business days.

## Why the deck calculator was hard to build

On paper, a deck calculator is simple maths: work out the area and divide by what a board covers. The hard part is everything around that maths: getting a correct shape out of a rough sketch on a phone, then turning it into real stock items a supplier can quote, and an order an installer can place.

**Keeping a shape square while you type.** When you type a new length into one side of an L-shaped deck, the calculator sets that side to exactly that length and keeps it pointing the same way. Then it has to decide what happens to the rest of the outline. If the next corner is a right angle, that corner moves too, so the L stays an L instead of turning into a strange, slanted shape. Get that wrong and a single typed number can tie the whole drawing in knots.

**Reading lengths the way people actually write them.** Customers type "3.6m", "360cm", "3600mm", "3600" or "3,600". The calculator accepts all of them, works out what was meant, and quietly rejects anything that can't be a real deck side: under 100 mm, or over 50 metres.

**Never accepting an impossible shape.** You can drag any corner anywhere, add corners, zoom and pan. If a dragged corner would make a deck's sides cross over each other, the calculator refuses it. The area is worked out for the true outline, not the rectangle around it.

**Turning a drawing into real stock items.** Boards are only part of the take-off. The clips and screws depend on the board range, whether the frame is timber or steel, and the bushfire (BAL) rating. Each rule points at a real item in DeckMate's Zoho stock, matched by ID, then SKU, then name, and where it matters, it must be the same colour as the boards. Where DeckMate hasn't confirmed a quantity yet, the quote says "Check quantity" instead of quietly guessing.

**Making it work with a thumb.** Most people measure a deck standing on the lawn, so the calculator had to work on a phone first: shapes that start in sensible places, a starting zoom that fits a small screen, and corners big enough to grab. Folding the separate desktop and mobile calculators into one, inside the site, also removed around 1,300 lines of duplicated code.

**From a drawing to an order, without double handling.** Installers can draw a job in the same calculator and send the drawing straight to their quote. They add their margin, prices are refreshed from Zoho, and the quote moves from draft to sent, accepted and ordered. An ordered quote is locked, it can only be ordered once, and it's only marked as sent once the email has actually gone out.

## What changed

The old site brought in enquiries. The new one does more of the quoting before anyone picks up the phone. A customer can measure their deck, see the take-off and ask for a quote in about five minutes, and DeckMate now measures how many people start the calculator, finish it and send a quote, so it's clear where people drop off.

If your business quotes from measurements, a calculator like this can do the first half of the job before the customer even calls. That's the kind of thing we build: see our [Web & Mobile Apps](/services/web-and-mobile-apps) work, or try our own free [decking calculator](/tools/decking-calculator).
