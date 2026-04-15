---
layout: none
title: Online Composition and Music Lessons | Sachie Kobayashi
permalink: /lesson_fr/
---

<head>

<title>
Online Composition, Music Theory and Sound Design Lessons | Sachie Kobayashi
</title>

<meta name="description" content="
Online composition, solfège, music theory and sound design lessons with an internationally active composer.
Available in English and French. 30-minute free trial available.
">

<meta name="robots" content="index, follow">

<link rel="canonical" href="https://あなたのURL/lesson_fr/">

</head>

{% include fonts.html %}

<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --ink: #1a1814;
    --ink-mid: #5a5650;
    --ink-light: #a09a93;
    --sand: #f5f1ec;
    --sand-mid: #e8e2da;
    --white: #fdfcfa;
    --accent: #c4a882;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--white);
    color: var(--ink);
    font-weight: 300;
    line-height: 1.7;
    font-size: 16px;
  }

  .hero-image {
    text-align: center;
  }

  .hero-image img {
    width: 100%;
    max-height: 600px;
    object-fit: cover;
    display: block;
  }

  .wrap {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 28px;
  }

  .lang-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(253, 252, 250, 0.96);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--sand-mid);
    padding: 14px 28px;
    display: flex;
    gap: 0;
  }

  .lang-bar button {
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    font-size: 13px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-light);
    cursor: pointer;
    padding: 4px 14px 4px 0;
    transition: color 0.2s;
  }

  .lang-bar button.active {
    color: var(--ink);
  }

  .lang-bar button:not(:last-child)::after {
    content: '/';
    margin-left: 14px;
    color: var(--sand-mid);
  }

  section {
    padding: 72px 0;
    border-bottom: 1px solid var(--sand-mid);
  }

  section:last-of-type {
    border-bottom: none;
  }

  .section-tight {
    padding-top: 0;
    border-bottom: none;
  }

  .label {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-light);
    margin-bottom: 28px;
    display: block;
  }

  h1 {
    font-family: 'EB Garamond', serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 400;
    line-height: 1.18;
    letter-spacing: -0.01em;
    margin-bottom: 28px;
  }

  h2 {
    font-family: 'EB Garamond', serif;
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    font-weight: 400;
    line-height: 1.25;
    margin-bottom: 20px;
  }

  h3 {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-mid);
    margin-bottom: 16px;
  }

  p {
    color: var(--ink-mid);
    margin-bottom: 18px;
  }

  p:last-child {
    margin-bottom: 0;
  }

  p strong {
    color: var(--ink);
    font-weight: 400;
  }

  .hero-subtitle {
    font-family: 'EB Garamond', serif;
    font-size: 1.15rem;
    color: var(--ink-mid);
    font-style: italic;
    margin-bottom: 32px;
  }

  .video-wrap {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    background: var(--sand);
  }

  .video-wrap iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin: 40px 0;
  }

  .gallery img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    display: block;
  }

  .strengths {
    list-style: none;
    border-top: 1px solid var(--sand-mid);
  }

  .strengths li {
    padding: 16px 0 16px 20px;
    border-bottom: 1px solid var(--sand-mid);
    color: var(--ink-mid);
    font-size: 15px;
    position: relative;
  }

  .strengths li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 24px;
    width: 6px;
    height: 1px;
    background: var(--accent);
  }

  .tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  .tools span {
    font-size: 13px;
    padding: 6px 14px;
    border: 1px solid var(--sand-mid);
    color: var(--ink-mid);
    letter-spacing: 0.02em;
  }

  .pricing {
    border-top: 1px solid var(--sand-mid);
    margin-top: 8px;
  }

  .pricing-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 18px 0;
    border-bottom: 1px solid var(--sand-mid);
    gap: 20px;
  }

  .pricing-label {
    font-size: 15px;
    color: var(--ink-mid);
  }

  .pricing-value {
    font-family: 'EB Garamond', serif;
    font-size: 1.2rem;
    color: var(--ink);
    white-space: nowrap;
  }

  .pricing-note {
    font-size: 13px;
    color: var(--ink-light);
    margin-top: 4px;
  }

  .trial-banner {
    background: var(--sand);
    padding: 36px 40px;
    text-align: center;
    margin: 48px 0;
  }

  .trial-banner .big {
    font-family: 'EB Garamond', serif;
    font-size: 1.6rem;
    font-style: italic;
    color: var(--ink);
    margin-bottom: 8px;
  }

  .trial-banner .sub {
    font-size: 13px;
    color: var(--ink-light);
  }

  .faq {
    border-top: 1px solid var(--sand-mid);
  }

  .faq-item {
    padding: 22px 0;
    border-bottom: 1px solid var(--sand-mid);
  }

  .faq-q {
    font-size: 14px;
    letter-spacing: 0.05em;
    color: var(--ink);
    margin-bottom: 10px;
  }

  .faq-a {
    font-size: 14px;
    color: var(--ink-mid);
    line-height: 1.65;
  }

  a {
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  a:hover {
    color: var(--accent);
  }

  .highlight-email {
    color: var(--ink);
    font-style: italic;
  }

  .calendly-inline-widget {
    width: 100%;
    min-width: 320px;
    height: 700px;
  }

  footer {
    padding: 48px 28px;
    text-align: center;
    font-size: 13px;
    color: var(--ink-light);
    letter-spacing: 0.05em;
    border-top: 1px solid var(--sand-mid);
  }

  .video-lang-toggle {
    display: flex;
    gap: 0;
    margin-bottom: 20px;
  }

  .video-lang-toggle button {
    background: none;
    border: 1px solid var(--sand-mid);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-light);
    cursor: pointer;
    padding: 8px 18px;
    transition: all 0.2s;
  }

  .video-lang-toggle button:first-child {
    border-right: none;
  }

  .video-lang-toggle button.active {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--white);
  }

  .wide-photo {
    margin: 0 -28px;
  }

  .wide-photo img {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 520px) {
    .wrap {
      padding: 0 20px;
    }

    .lang-bar {
      padding: 12px 20px;
    }

    .gallery {
      grid-template-columns: repeat(2, 1fr);
    }

    .pricing-row {
      flex-direction: column;
      gap: 4px;
    }

    .trial-banner {
      padding: 28px 20px;
    }

    .wide-photo {
      margin: 0 -20px;
    }
  }
</style>

<div class="hero-image">
  <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/header2.jpg" alt="Header">
</div>

<div class="lang-bar">
  <button id="enBtn" class="active">English</button>
  <button id="frBtn">Français</button>
</div>

<div class="wrap">

  <section>
    <span class="label" data-en="Sachie Kobayashi" data-fr="Sachie Kobayashi"></span>
    <h1 data-en="Online Exchange & Lessons" data-fr="Échanges et Cours en Ligne"></h1>
    <p class="hero-subtitle"
       data-en="Composer and creator — trained in Switzerland, Tokyo and Paris, active worldwide."
       data-fr="Compositrice et créatrice — formée en Suisse, à Tokyo et à Paris, active dans le monde entier."></p>
    <p data-en="Teaching composition, music theory, ear training, solfège, sound design, and music for film — from beginner to professional. Available in English and French."
       data-fr="Enseignement de la composition, théorie musicale, solfège, design sonore et musique pour l'image — du débutant au professionnel. Disponible en anglais et en français."></p>
  </section>

  <section>
    <span class="label" data-en="Introduction" data-fr="Présentation"></span>
    <div class="video-wrap">
      <iframe src="https://www.youtube.com/embed/EOf82PRXh3Y" title="Sachie Kobayashi Introduction" allowfullscreen></iframe>
    </div>
  </section>

  <section class="section-tight">
    <div class="gallery">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/lesson01.jpg" alt="">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/lesson02.jpg" alt="">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/lesson03.jpg" alt="">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/lesson04.jpg" alt="">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/lesson05.jpg" alt="">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/lesson06.jpg" alt="">
    </div>
  </section>

  <section>
    <span class="label" data-en="About" data-fr="À propos"></span>
    <p data-en="Sachie Kobayashi (b. 1990, Japan) is a composer exploring intuitive musical creation inspired by social phenomena. She completed a Master's in Composition and Music Education at the Haute École de Musique de Genève. Her works have been performed worldwide in collaboration with Klangforum Wien, Ensemble Modern, Ensemble Proton Bern, and The Geidai Philharmonia Orchestra."
       data-fr="Sachie Kobayashi (née en 1990 au Japon) est compositrice, explorant la création musicale intuitive inspirée par les phénomènes sociaux. Elle a obtenu un Master en Composition et Pédagogie Musicale à la Haute École de Musique de Genève. Ses œuvres ont été jouées dans le monde entier avec Klangforum Wien, Ensemble Modern, Ensemble Proton Bern et The Geidai Philharmonia Orchestra."></p>
    <p data-en="She has participated in IRCAM's composition program in Paris, won the impuls International Composition Competition 2023, and received scholarships from the Swiss Government, Nomura Foundation, and Kakehashi Foundation. Her recent works integrate video, stage, and multimedia."
       data-fr="Elle a participé au programme de composition de l'IRCAM à Paris, remporté le impuls International Composition Competition 2023, et reçu des bourses du gouvernement suisse, de la Fondation Nomura et de la Fondation Kakehashi. Ses œuvres récentes intègrent vidéo, scène et multimédia."></p>
    <p data-en="For professional collaborations: <span class='highlight-email'>info@sachiekobayashi.com</span> — <a href='https://www.sachiekobayashi.com/' target='_blank' rel='noopener'>sachiekobayashi.com</a>"
       data-fr="Pour les collaborations professionnelles : <span class='highlight-email'>info@sachiekobayashi.com</span> — <a href='https://www.sachiekobayashi.com/' target='_blank' rel='noopener'>sachiekobayashi.com</a>"></p>
  </section>

  <section>
    <span class="label" data-en="Why study with Sachie" data-fr="Pourquoi étudier avec Sachie"></span>
    <ul class="strengths">
      <li data-en="Internationally performed composer with a global portfolio." data-fr="Compositrice reconnue internationalement avec un portfolio mondial."></li>
      <li data-en="Collaborations with leading ensembles and multimedia artists worldwide." data-fr="Collaborations avec des ensembles de premier plan et des artistes multimédias."></li>
      <li data-en="Master's degrees in Composition and Music Education from Switzerland." data-fr="Masters en Composition et Pédagogie Musicale en Suisse."></li>
      <li data-en="Award-winner: impuls International Composition Competition 2023, Swiss Government Excellence Scholarship." data-fr="Primée : impuls International Composition Competition 2023, Bourse d'excellence du gouvernement suisse."></li>
      <li data-en="Patient, personalised guidance for all levels — children to professionals." data-fr="Accompagnement personnalisé pour tous les niveaux — enfants et professionnels."></li>
    </ul>
  </section>

  <div class="trial-banner">
    <div class="big" data-en="30-minute free trial available" data-fr="Essai gratuit de 30 minutes disponible"></div>
    <div class="sub" data-en="No commitment — book directly below" data-fr="Sans engagement — réservez directement ci-dessous"></div>
  </div>

  <section>
    <span class="label" data-en="Lesson preview" data-fr="Aperçu des cours"></span>
    <div class="video-lang-toggle">
      <button class="active" onclick="showVideo('en')" id="vEnBtn">English</button>
      <button onclick="showVideo('fr')" id="vFrBtn">Français</button>
    </div>
    <div id="video-en" class="video-wrap">
      <iframe src="https://www.youtube.com/embed/xFx8gj7iKCY" title="Lesson EN" allowfullscreen></iframe>
    </div>
    <div id="video-fr" class="video-wrap" style="display:none;">
      <iframe src="https://www.youtube.com/embed/SYYX3eBwMrc" title="Lesson FR" allowfullscreen></iframe>
    </div>
  </section>

  <section>
    <span class="label" data-en="Software & tools" data-fr="Logiciels et outils"></span>
    <div class="tools">
      <span>Ableton Live</span>
      <span>Reaper</span>
      <span>Pro Tools</span>
      <span>Logic Pro</span>
      <span>Kontakt</span>
      <span>iZotope</span>
      <span>GRMtools</span>
      <span>Pianoteq</span>
      <span>Sibelius</span>
      <span>MuseScore</span>
      <span>Max/MSP</span>
    </div>
  </section>

  <section>
    <span class="label" data-en="Rates" data-fr="Tarifs"></span>
    <div class="pricing">
      <div class="pricing-row">
        <div>
          <div class="pricing-label" data-en="Trial lesson (30 min)" data-fr="Leçon d'essai (30 min)"></div>
          <div class="pricing-note" data-en="One per student, one rescheduling allowed" data-fr="Une par élève, un changement autorisé"></div>
        </div>
        <div class="pricing-value" data-en="Free" data-fr="Gratuit"></div>
      </div>
      <div class="pricing-row">
        <div>
          <div class="pricing-label" data-en="Private lesson (60 min)" data-fr="Cours particulier (60 min)"></div>
<div class="pricing-note" data-en="Rescheduling is possible within the same month. No-shows on the day will be counted as one lesson."
     data-fr="Le report est possible dans le même mois. Toute absence non signalée le jour même sera comptée comme une séance.">
</div>
        </div>
        <div class="pricing-value">CHF/EUR/USD 45</div>
      </div>
      <div class="pricing-row">
        <div>
          <div class="pricing-label" data-en="Trial lesson discount" data-fr="Réduction après essai"></div>
          <div class="pricing-note" data-en="Coupon sent after completing trial" data-fr="Coupon envoyé après la leçon d'essai"></div>
        </div>
        <div class="pricing-value">−10%</div>
      </div>
    </div>
  </section>

  <section>
    <span class="label" data-en="Frequently asked questions" data-fr="Questions fréquentes"></span>
    <div class="faq">
      <div class="faq-item">
        <div class="faq-q" data-en="What platform do you use?" data-fr="Quelle plateforme utilisez-vous ?"></div>
        <div class="faq-a" data-en="Lessons are conducted via Zoom. The link is sent automatically upon booking." data-fr="Les cours se déroulent via Zoom. Le lien est envoyé automatiquement après la réservation."></div>
      </div>
      <div class="faq-item">
        <div class="faq-q" data-en="Do I need a specific computer or software?" data-fr="Ai-je besoin d'un ordinateur ou logiciel particulier ?"></div>
        <div class="faq-a" data-en="Any PC or Mac is fine. Any software is welcome, though the instructor primarily uses Ableton Live. Not all plugins may be available." data-fr="PC ou Mac convient. Tout logiciel est bienvenu, bien que l'enseignante utilise principalement Ableton Live. Tous les plugins ne sont pas forcément disponibles."></div>
      </div>
      <div class="faq-item">
        <div class="faq-q" data-en="What subjects can be covered?" data-fr="Quels sujets peuvent être abordés ?"></div>
        <div class="faq-a" data-en="Composition, orchestration, sheet music notation, solfège, ear training, sound design, and music for film. Suitable for all skill levels." data-fr="Composition, orchestration, notation musicale, solfège, formation auditive, design sonore et musique pour l'image. Adapté à tous les niveaux."></div>
      </div>
      <div class="faq-item">
        <div class="faq-q" data-en="What is the cancellation policy?" data-fr="Quelle est la politique d'annulation ?"></div>
        <div class="faq-a">
        <span  data-en="Rescheduling is possible within the same month. No-shows on the day will be counted as one lesson. If there are unavoidable circumstances (such as serious illness or technical issues), please contact:"
  data-fr="Le report est possible dans le même mois. Toute absence non signalée le jour même sera comptée comme une séance. En cas de circonstances inévitables (maladie grave ou problème technique), veuillez contacter :">
</span>
<span class="highlight-email">info@sachiekobayashi.com</span>.
          <span data-en=" Full policies at " data-fr=" Conditions complètes sur "></span><a href="https://www.sachiekobayashi.com/policies/" target="_blank" rel="noopener" data-en="sachiekobayashi.com/policies" data-fr="sachiekobayashi.com/policies"></a>.
        </div>
      </div>
    </div>
  </section>

  <div class="wide-photo">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/photo_lesson.jpg" alt="">
  </div>

  <section>
    <span class="label" data-en="Book a lesson" data-fr="Réserver un cours"></span>
    <div class="trial-banner" style="margin-bottom:40px;">
      <div class="big" data-en="30-minute free trial available" data-fr="Essai gratuit de 30 minutes disponible"></div>
    </div>
    <div class="calendly-inline-widget"
         data-url="https://calendly.com/sound-sachiekobayashi/new-meeting?primary_color=c4a882"
         style="min-width:320px;height:700px;"></div>
    <script src="https://assets.calendly.com/assets/external/widget.js" async></script>
  </section>

</div>

<footer>
  <span data-en="Looking forward to meeting you." data-fr="Au plaisir de vous rencontrer."></span><br><br>
  <span data-en="© 2025 Sachie Kobayashi. All rights reserved." data-fr="© 2025 Sachie Kobayashi. Tous droits réservés."></span>
</footer>

<script>
  const enBtn = document.getElementById('enBtn');
  const frBtn = document.getElementById('frBtn');
  const els = document.querySelectorAll('[data-en]');

  function setLang(lang) {
    els.forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (val !== null) el.innerHTML = val;
    });
    enBtn.classList.toggle('active', lang === 'en');
    frBtn.classList.toggle('active', lang === 'fr');
  }

  enBtn.addEventListener('click', () => setLang('en'));
  frBtn.addEventListener('click', () => setLang('fr'));
  setLang('en');

  function showVideo(lang) {
    document.getElementById('video-en').style.display = lang === 'en' ? 'block' : 'none';
    document.getElementById('video-fr').style.display = lang === 'fr' ? 'block' : 'none';
    document.getElementById('vEnBtn').classList.toggle('active', lang === 'en');
    document.getElementById('vFrBtn').classList.toggle('active', lang === 'fr');
  }
</script>
