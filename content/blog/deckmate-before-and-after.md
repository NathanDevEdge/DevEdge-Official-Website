---
title: "DeckMate, Before and After: From a Deck Calculator to a Full Quoting App"
description: "How DeckMate grew from a website with a deck calculator into an app that draws, frames, prices and quotes a deck on site, and what made the calculator hard to build."
date: 2026-11-25
category: Apps
draft: true
beforeAfter:
  before:
    items:
      - A website with a deck calculator
      - Enquiry form into Zoho CRM
      - "note: framing and cut list still done by hand"
    caption: "Good for getting enquiries. The real quote still happened at 9pm."
  after:
    items:
      - Draw the deck on screen
      - Framing, 3D and cut list worked out
      - Branded quote sent from site
    caption: "A full deck quote before you've left the driveway."
flow:
  caption: "One site visit, from tape measure to a signed quote."
  steps:
    - label: "Draw"
      text: "Sketch any shape, add steps, a pergola or a pool."
    - label: "Frame"
      text: "Stumps, bearers and joists set out and checked."
    - label: "Cut list"
      text: "Every piece packed into the lengths you buy."
    - label: "Price"
      text: "Your own rates, markup and margin, live."
    - label: "Send"
      text: "A branded PDF quote, emailed from the app."
---

DeckMate started with a simple idea from Graeme Bell, a Melbourne carpenter who was tired of quoting decks at 9pm after a full day on the tools. Quoting a deck properly takes about 45 minutes: measure it, work out the joists and bearers, count the stumps, price the boards, add the labour, then type it into something that doesn't look like a text message. Do that three times a week and you start guessing. Guessing is how you end up building a deck for free.

We built the first version of DeckMate with Graeme. This year our team took it much further, from a website into a full quoting app. This post shows where it started, where it is now, and the parts of the deck calculator that were much harder than they look.

## Before: a website with a calculator

<!-- TODO: before screenshot of the original DeckMate site -->

The first DeckMate was a website with a deck calculator built in. A homeowner could put in the size of their deck and get a fast estimate, and every enquiry landed in Zoho CRM so it went straight into the sales pipeline instead of an inbox.

That did its job. In Graeme's words, it gave customers "an accurate way to measure their deck out and get the fastest quotes". But it was built around the enquiry. Once a job came in, the real work of a quote (the framing, the timber list, the labour and the PDF) still happened by hand.

## After: draw the deck, price it, send the quote

![The new DeckMate homepage: draw the deck, price it, send the quote](/images/insights/deckmate/after-homepage.webp)

The new DeckMate is a quoting app for carpenters, on the web and on iPhone. You draw the deck on screen, and the app works out everything a quote needs from that one drawing:

- **The plan.** Rectangles, L-shapes, cut corners, curves and two-section decks, with steps, handrails, pergolas, bench seats and pools added on. Drag a corner or type the length.
- **The framing.** Stumps or screw piles, bearers and joists set out to the shape, with span checks.
- **A 3D build.** Spin the finished deck, then peel it back stage by stage: stump holes, stumps, bearers, joists, boards.
- **The cut list.** Every joist, bearer, rim, stringer and post, packed into the stock lengths you actually buy, with the offcuts shown.
- **The price.** Melbourne trade rates loaded to start, every one editable, with markup and margin sliders that move the quote live.
- **The quote.** A branded A4 PDF with the plan drawing on it, emailed to the client from the app.

There's also a free cost calculator for homeowners, permit drawing sets, and a marketplace where homeowners can post a job for up to five local carpenters to quote.

![Drawing a deck in the DeckMate app, with the pergola, stairs and dimensions set out](/images/insights/deckmate/after-app-plan.webp)

## Why the deck calculator was hard to build

A deck calculator looks like simple maths: length times width, divided by board width. That gets you a rough number of boards. A quote a carpenter will put their name to is a different thing. Here's what made it hard.

<!-- TODO: replace or add to these with Nathan's own war stories -->

**Real decks aren't rectangles.** As soon as a deck has an L-shape, a cut corner or an angled side, every row of boards is a different length, and the joists stop lining up neatly. The app has to work out the framing for the shape you drew, not for the box around it.

**The timber has to fit what you can buy.** Knowing you need 140 metres of joist isn't useful. You need to know how many 5.4 m and 6.0 m lengths to order, where the joins fall, and what's left over. Packing every piece into stock lengths with the least waste is a genuinely tricky puzzle, and it has to run in a second on an iPad on site.

**The structure has to be right.** Bearer and joist spans, stump spacing and stair rules all depend on the timber size and the height of the deck. Getting those wrong doesn't just cost money; it fails an inspection. The checks are built in, so a quote can't quietly describe a deck that wouldn't pass.

**Everything is connected.** Change the board from merbau to composite and the joist spacing, the screws or clips, the cost and the cut list all change with it. Drag a corner and the 3D view, the drawings and the price all have to follow straight away.

**The prices have to be real.** A calculator full of guessed rates is worse than no calculator. The rates in DeckMate are Melbourne trade buy prices, and the labour hours come from decks DeckMate's own carpentry crew has built and timed.

## What changed for the business

<!-- TODO: any numbers Nathan can share (quotes sent, time per quote, users, App Store launch) -->

The old site brought in enquiries. The new one is a product: carpenters sign up, draw and price decks, and send quotes, and homeowners get a straight answer on what their deck should cost before they ring anyone.

If you've got a calculator, quoting tool or spreadsheet that's running part of your business, that's the kind of thing we build. See our [Web & Mobile Apps](/services/web-and-mobile-apps) work, or try our own free [decking calculator](/tools/decking-calculator).
