---
title: "UTM Links Explained: How to See Which Ads and Posts Bring In Customers"
description: "What UTM parameters are, how to use them on ads, posts, emails and QR codes, and how to read the results in Google Analytics. Plain English, with examples."
date: 2026-11-23
category: Tracking
tool: utm-builder
takeaway:
  headline: "Tag every link you share, and Google Analytics shows *which ones bring in customers.*"
  answer: "UTM links are your normal web address with a few labels on the end. They take a minute to make, cost nothing, and turn \"Direct\" and \"Unassigned\" into real answers."
beforeAfter:
  before:
    items:
      - "Direct: 64%"
      - "Unassigned: 12%"
      - "facebook / Facebook / fb"
      - "note: was it the flyer or the email?"
    caption: "Lots of visits. No idea which marketing paid off."
  after:
    items:
      - "facebook / paid_social: 41 leads"
      - "newsletter / email: 18 leads"
      - "flyer / qr: 6 leads"
    caption: "Every channel named, counted and comparable."
flow:
  caption: "What happens when someone clicks a tagged link"
  steps:
    - label: Tag
      text: You add UTM labels to the link you share
    - label: Click
      text: Someone taps it in your ad, post or email
    - label: Read
      text: Google Analytics reads the labels on arrival
    - label: Report
      text: The visit, and any enquiry, is credited to that campaign
---

You're posting on Facebook, sending a newsletter, boosting the odd post and handing out flyers. Enquiries come in. But when you open Google Analytics to see what's working, most of your visitors are filed under "Direct" or "Unassigned", and the rest are split across three different spellings of Facebook.

That's not a Google Analytics problem. It's a labelling problem, and UTM links fix it.

## What a UTM link is

A UTM link is a normal web address with a few labels added to the end. Here's a plain link to a page:

`https://yourbusiness.com.au/spring-offer`

And here's the same link with UTM labels:

`https://yourbusiness.com.au/spring-offer?utm_source=facebook&utm_medium=paid_social&utm_campaign=spring_offer`

Both open exactly the same page. The visitor doesn't notice any difference. But the second one tells Google Analytics three things the moment someone clicks: the visit came from **Facebook**, it was a **paid social** ad, and it was part of the **spring offer** campaign.

UTM stands for "Urchin Tracking Module", after the company Google bought to make Google Analytics. You don't need to remember that. You only need to know the five labels.

{{flow}}

## The five labels, in plain English

- **utm_source: who sent them?** The website, platform or list. `facebook`, `instagram`, `google`, `newsletter`, `flyer`.
- **utm_medium: what kind of link?** The type of marketing. `paid_social` for social ads, `social` for normal posts, `email` for emails, `cpc` for search ads, `qr` for QR codes.
- **utm_campaign: which promotion?** The reason you're sending people. `spring_offer`, `black_friday`, `new_showroom`.
- **utm_content: which version?** Optional. Use it to tell two ads, images or buttons apart, like `video_ad` and `photo_ad`.
- **utm_term: which keyword or audience?** Optional, and mostly used for search ads or testing audiences.

Source, medium and campaign are the three you always need. If one is missing, Google Analytics can't report the campaign properly.

## Why your reports look messy without them

Plenty of visits arrive with no information about where they came from. Links in emails, PDFs, text messages, WhatsApp and most apps usually show up as "Direct", which really means "we don't know". A QR code on a flyer is the same.

Social media is a little better, but Google Analytics often can't tell a paid ad from a normal post, or one campaign from another. So you end up guessing which part of your marketing is paying for itself.

{{before-after}}

Once every link you share is tagged, those visits get proper names. You can see that the newsletter brought in 18 enquiries this month and the boosted post brought in two, and spend accordingly.

## How to tag a link in one minute

The quickest way is our free [UTM link builder](/tools/utm-builder). Paste your page, tap where you're sharing it (Facebook ad, email newsletter, QR code and so on), name the campaign and copy the finished link. It makes everything lowercase and swaps spaces for underscores, so your reports stay tidy.

Here's how a small business might tag one month of marketing:

| Where the link goes | utm_source | utm_medium | utm_campaign |
| --- | --- | --- | --- |
| Facebook ad | facebook | paid_social | spring_offer |
| Instagram ad | instagram | paid_social | spring_offer |
| Monthly newsletter | newsletter | email | spring_offer |
| Instagram bio | instagram | social | always_on |
| Flyer QR code | flyer | qr | spring_offer |
| Google Business Profile website button | google | organic | gbp_listing |

Notice that the campaign name stays the same across channels. That lets you see the whole spring offer in one report, then split it by where people came from.

## The rules that keep it clean

Google Analytics treats every spelling as something new. These five habits save a lot of cleaning up later:

1. **Always lowercase.** `Facebook` and `facebook` show as two different sources.
2. **No spaces.** Use underscores or dashes. Spaces turn into `%20` and get messy.
3. **One name per platform.** Pick `facebook` and never use `fb` or `facebook.com`.
4. **Use mediums Google understands.** `paid_social`, `social`, `email`, `cpc` and `referral` land in the right channels. Made-up ones like `ads` or `boost` end up in "Unassigned".
5. **Keep a list.** A simple shared spreadsheet of the sources, mediums and campaign names you use stops the team inventing new ones.

## Three places not to use UTM links

- **Links between pages on your own website.** Clicking one starts a new visit and wipes out where the person originally came from. UTMs are only for links you share somewhere else.
- **Google Ads, if auto-tagging is on.** Google already tags those clicks with more detail. Adding UTMs on top can override it.
- **Anything private.** Anyone who sees the link can read the labels. Never put a customer's name, email or phone number in a UTM.

## Where to see the results

In Google Analytics 4, go to **Reports**, then **Acquisition**, then **Traffic acquisition**. Change the first column to **Session source / medium** to see each channel, or **Session campaign** to see each promotion. New visits usually appear within a day.

If your enquiry form or phone clicks are tracked as key events, the same report shows which campaigns produced leads, not just visits. That's the number that matters.

## From clicks to customers

UTM links answer "where did this visit come from?". The next question is "did that visitor become a paying customer?", and that one needs your website, analytics, ad platforms and CRM passing the same information along. When it's set up properly, Meta and Google can learn which ads bring buyers instead of browsers, which is where a lot of wasted ad spend gets fixed. We wrote more about that in [why your Meta ads aren't working](/insights/meta-ads-tracking-small-business).

If you'd like it set up end to end, that's what our [tracking and reporting](/services/tracking-and-reporting) work does. Otherwise, start small: tag the links in your next ad, post and email with the [free UTM builder](/tools/utm-builder), and check the report in a week.
