---
layout: post
description: "Babel / TRANS-INSTRUMENTALISM by Sachie Kobayashi: an interactive audiovisual installation for the visitor’s voice, three machine listeners and four screens. Presented at IRCAM Forum Workshops TOKYO 2026."
title: Babel / TRANS-INSTRUMENTALISM
date: 2026-09-14
Author: Sachie
categories: 
tags: [Multimedia]
comments: false
---
Interactive audiovisual installation (2026) — for the visitor’s voice, three machine listeners, four screens

**Presented at IRCAM Forum Workshops TOKYO 2026**  
Sunday 22 November 2026 · Gallery, Temple University Japan (City Campus), Tokyo

<img src="{{ '/images/babel_2026_screen_speaker.jpg' | relative_url }}" alt="Babel / TRANS-INSTRUMENTALISM at IRCAM Forum Workshops TOKYO 2026: a vertical screen on a loudspeaker by the gallery window; a glassy face with misheard words written across it" width="100%">

<img src="{{ '/images/babel_2026_room_visitor.jpg' | relative_url }}" alt="A visitor standing at the microphone in the gallery, with screens and loudspeakers on stands in front of a glass wall and trees" width="100%">

Babel – Trans-Instrumentalism is an interactive audiovisual installation in which the visitor’s voice becomes the instrument. A sentence spoken once into a single microphone is passed to three machine listeners, which hear it only as sound, mishear it in their own languages and answer with synthetic voices through four speakers. On four small screens, faces press against a wet, glassy membrane and articulate every phoneme of these voices, while the misheard words drift across the surface.

The work continues the [TRANS-INSTRUMENTALISM series]({{ '/transinstrumentalism/' | relative_url }}) — [Day 0]({{ '/DAY0TRANS-INSTRUMENTALISM/' | relative_url }}) (2022), developed during the IRCAM Cursus, and RêVeRie (2025), a VR work with Ensemble Contrechamps — shifting its focus from instrumental gesture to speech. Rather than solving the language barrier through perfect translation, Babel lets meaning circulate between body, microphone, machine listening and synthetic voice, and lingers on what remains when words are displaced: accent, misrecognition, delay and silence.

<p style="display:flex;gap:8px"><img src="{{ '/images/babel_2026_still_intro.jpg' | relative_url }}" alt="Screen: glass letters gathering on a pale ground before a face appears" style="width:33.3%;height:auto"><img src="{{ '/images/babel_2026_still_face_ja.jpg' | relative_url }}" alt="Screen: misheard Japanese words written across a speaking face" style="width:33.3%;height:auto"><img src="{{ '/images/babel_2026_still_face_de2.jpg' | relative_url }}" alt="Screen: misheard German words written across a speaking face" style="width:33.3%;height:auto"></p>
*From one screen, recorded from the installation patch: the glass letters of the opening, then misheard Japanese and German over the speaking faces*

The visitor speaks once. The recording is heard by three machine listeners as a stream of phonemes only; each rebuilds it into words of its own language and answers with its own synthetic voice. The listeners enter one after another, so that a single sentence returns as a chain of mishearings — a small tower of Babel built from one person’s words.

Each voice has its own screen. Lips, membrane, refraction and light are computed in real time in Max 9 / Jitter with GLSL shaders, driven by the phoneme timings taken directly from the speech synthesiser. Each phoneme is mapped to a viseme and to articulatory parameters — aperture, width, rounding, protrusion, lip tension, asymmetry and contact pressure — with coarticulation, bilabial closure and residual tremor, so that the mouths behave like bodies rather than icons.

<img src="{{ '/images/babel_2026_room.jpg' | relative_url }}" alt="General view of the gallery: screens on loudspeakers, a microphone stand and the glass wall onto the garden" width="100%">

<p style="display:flex;gap:8px"><img src="{{ '/images/babel_2026_sachie.jpg' | relative_url }}" alt="Sachie Kobayashi beside one of the screens" style="width:50%;height:auto"><img src="{{ '/images/babel_2026_screen_face.jpg' | relative_url }}" alt="A screen showing a pale face above a loudspeaker, in front of the window" style="width:50%;height:auto"></p>

<img src="{{ '/images/babel_2026_setup.jpg' | relative_url }}" alt="The computer and audio interface running the installation" width="100%">
*Four vertical screens, four speakers and one microphone; speech recognition and voice synthesis run locally on a single computer.*

**Presentation**  
[IRCAM Forum Workshops TOKYO 2026](https://forum.ircam.fr/article/detail/babel-trans-instrumentalism-by-sachie-kobayashi-and-frederik-bous/) — Sunday 22 November 2026, Gallery, Temple University Japan (City Campus), Tokyo

**Credits**  
Concept, music, visual: Sachie Kobayashi  
Technology collaborator (AI and voice technology): [Frederik Bous](https://frederik.bous.cc/)  
Production: [Studio Cucurbits.](https://www.studiocucurbits.com/)  
Max 9 / Jitter (GLSL), local speech recognition and text-to-speech  
With IRCAM Forum, Temple University Japan, YAMAHA and Focusrite
