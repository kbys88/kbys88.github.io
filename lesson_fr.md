---
layout: page
title: Lesson_FR
permalink: /lesson_fr/
---
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Sachie Kobayashi — Online Tutorials & Lessons</title>
<style>
  body { font-family: sans-serif; background:#f7fafc; margin:0; color:#111;}
  .container{max-width:800px;margin:40px auto;padding:20px;}
  h1,h2,h3{margin-top:0;}
  .card{background:#fff;padding:20px;margin-bottom:20px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.06);}
  .btn{display:inline-block;padding:12px 20px;border-radius:8px;background:#2b6cb0;color:white;text-decoration:none;font-weight:600;}
  .small{font-size:0.9rem;color:#555;margin-top:8px;}
  .lang-btns{margin-bottom:20px;}
  .lang-btns button{margin-right:8px;padding:6px 12px;border-radius:6px;border:1px solid #2b6cb0;background:#fff;color:#2b6cb0;cursor:pointer;}
  .lang-btns button.active{background:#2b6cb0;color:#fff;}
  .bio {margin-bottom:20px;}
</style>
</head>
<body>
<div class="container">
  <div class="lang-btns">
    <button id="enBtn" class="active">English</button>
    <button id="frBtn">Français</button>
  </div>

  <!-- Hero Section / Title -->
  <h1 data-en="Sachie Kobayashi — Online Tutorials & Lessons" data-fr="Sachie Kobayashi — Tutoriels & Cours en ligne"></h1>

  <!-- Bio Section -->
  <div class="card bio">
    <p data-en="Sachie Kobayashi (b. 1990, Japan) is a composer exploring intuitive musical creation and expression inspired by social phenomena. She studied piano from age seven and composition from twenty, completing a Master’s in Composition and Music Theory at Haute École de Musique de Genève, and a Master’s in Music Education. Her works have been performed worldwide, including collaborations with Klangforum Wien, Ensemble Modern, Ensemble Proton Bern, and The Geidai Philharmonia Orchestra. Sachie has participated in IRCAM’s composition program in Paris, won numerous prizes including the impuls International Composition Competition 2023, and received scholarships from the Swiss Government, Nomura Foundation, and Kakehashi Foundation. She integrates video, stage, and multimedia in her recent works, bridging traditional and contemporary music expression."
       data-fr="Sachie Kobayashi (née en 1990 au Japon) est compositrice, explorant la création musicale intuitive et l’expression inspirée par les phénomènes sociaux. Elle a étudié le piano dès l’âge de sept ans et la composition à vingt ans, et a obtenu un Master en Composition et Théorie Musicale ainsi qu’un Master en Éducation Musicale à la Haute École de Musique de Genève. Ses œuvres ont été jouées dans le monde entier, avec des collaborations incluant Klangforum Wien, Ensemble Modern, Ensemble Proton Bern et The Geidai Philharmonia Orchestra. Sachie a participé au programme de composition de l’IRCAM à Paris, a remporté de nombreux prix dont le impuls International Composition Competition 2023, et a reçu des bourses du gouvernement suisse, de la Fondation Nomura et de la Fondation Kakehashi. Ses œuvres récentes intègrent vidéo, scène et multimédia, reliant la musique traditionnelle et contemporaine."></p>
  </div>

  <!-- Tutorial Video -->
  <div class="card">
    <h2 data-en="Tutorial Video (€17/CHF17)" data-fr="Vidéo Tutoriel (17€ / 17CHF)"></h2>
    <div style="height:220px;background:#e2e8f0;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#475569;">
      <span data-en="Video Thumbnail" data-fr="Vignette vidéo"></span>
    </div>
    <p class="small" data-en="After purchase, a viewing link will be sent by email." data-fr="Après l'achat, un lien pour visionner la vidéo sera envoyé par email."></p>
    <a href="https://systeme.io/your-tutorial-link" target="_blank" class="btn" data-en="Buy Tutorial" data-fr="Acheter le tutoriel"></a>
  </div>

  <!-- Private Lesson -->
  <div class="card">
    <h2 data-en="Book a Private Lesson (50€ / CHF / $)" data-fr="Réserver un cours privé (50€ / CHF / $)"></h2>
    <p class="small" data-en="Choose your preferred date and pay securely." data-fr="Choisissez la date souhaitée et payez en toute sécurité."></p>
    <a href="https://systeme.io/your-lesson-link" target="_blank" class="btn" data-en="Book Lesson" data-fr="Réserver le cours"></a>
  </div>

  <!-- FAQ -->
  <div class="card">
    <h3 data-en="FAQ" data-fr="FAQ"></h3>
    <p class="small">
      <span data-en="Q: When can I watch the video? A: After payment, a link will be sent by email." data-fr="Q : Quand puis-je regarder la vidéo ? R : Après le paiement, un lien sera envoyé par email."></span><br><br>
      <span data-en="Q: Can I cancel a lesson? A: Cancel at least 24h before the scheduled time." data-fr="Q : Puis-je annuler un cours ? R : Annulez au moins 24h avant l'heure prévue."></span>
    </p>
  </div>
</div>

<script>
  const enBtn = document.getElementById('enBtn');
  const frBtn = document.getElementById('frBtn');
  const elements = document.querySelectorAll('[data-en]');

  function setLanguage(lang) {
    elements.forEach(el => {
      el.textContent = el.getAttribute('data-' + lang);
    });
    if(lang==='en'){ enBtn.classList.add('active'); frBtn.classList.remove('active'); }
    else{ frBtn.classList.add('active'); enBtn.classList.remove('active'); }
  }

  enBtn.addEventListener('click',()=>setLanguage('en'));
  frBtn.addEventListener('click',()=>setLanguage('fr'));

  // 初期設定
  setLanguage('en');
</script>
</body>
</html>
