---
title: "Why Your Meta Ads Aren't Working (It's Usually the Tracking)"
description: "Before you blame the creative or the budget, check what you're telling Meta a win looks like. Broken tracking quietly wastes more ad spend than bad ads do."
date: 2026-10-29
category: Tracking
readTime: 6 min read
---

When Meta ads stop performing, the usual reaction is to change the creative, change the audience or turn up the budget. Sometimes that's right. But more often than not, the real problem is underneath: the ad account doesn't know what a good result looks like, because the tracking is broken.

## The algorithm optimises for what you tell it

Meta's delivery system is very good at finding people who will do the thing you're tracking. If you're tracking page views, it finds people who view pages. If your lead event fires twice, or not at all, it learns from bad data. Garbage in, wasted spend out.

## The most common problems we find

- **Pixel only, no Conversions API.** Browser privacy settings and ad blockers mean the pixel on its own misses a meaningful share of conversions. The Conversions API sends events from your server too, so Meta sees what actually happened.
- **Duplicate events.** Pixel and server events without a shared event ID get counted twice. Your results look great in Ads Manager and don't match your inbox.
- **Optimising for the wrong event.** Campaigns set to clicks or landing page views when what you actually want is a form submission or a phone call.
- **Leads tracked, sales not.** If leads go into a CRM and nobody tells Meta which ones became customers, the algorithm can't tell a tyre-kicker from a buyer.
- **A landing page that leaks.** Slow load times, a form that's hard to use on a phone, or a page that doesn't match the ad. Tracking can't fix that, but it will show you where people drop off.

## What a solid setup looks like

For most small businesses, good tracking means: GA4 set up with real key events, the Meta pixel plus Conversions API with deduplication, Google Ads conversions if you run Google too, and every lead landing in your CRM with its source attached. The best setups go one step further and send closed deals back to the ad platforms, so you optimise for customers instead of form fills.

## Three checks you can do today

- **Test Events in Events Manager.** Submit your own form and watch whether the lead event fires once, and from both browser and server.
- **Check Event Match Quality.** A low score means Meta struggles to connect conversions to real people.
- **Count the leads.** Compare last month's leads in Ads Manager with the enquiries you actually received. If they're far apart, the tracking needs work.

## Then fix the ads

Once the data is right, creative and offer testing actually means something, because you can trust the numbers you're judging them by. That's why we set up tracking before we touch a campaign. See how we handle [Tracking & Reporting](/services/tracking-and-reporting) and [Paid Media](/services/paid-media), or get in touch for an honest look at your setup.
