---
layout: main
title: Studio Cucurbits.
permalink: /cucurbits/
---

<style>
  .studio-cucurbits {
    --bg: #f4f3ef;
    --ink: #0b0b0b;
    --muted: rgba(11, 11, 11, 0.58);
    --line: rgba(11, 11, 11, 0.16);
    --soft: rgba(11, 11, 11, 0.045);
    --max: 1180px;

    width: 100%;
    min-height: 100vh;
    background: var(--bg);
    color: var(--ink);
    font-family: Helvetica, Arial, "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif;
    letter-spacing: -0.018em;
    line-height: 1.65;
    overflow: hidden;
  }

  .studio-cucurbits,
  .studio-cucurbits * {
    box-sizing: border-box;
  }

  .studio-cucurbits a {
    color: inherit;
    text-decoration: none;
  }

  .studio-cucurbits img,
  .studio-cucurbits video {
    display: block;
    width: 100%;
    height: auto;
  }

  .studio-cucurbits .lang-block {
    display: none;
  }

  .studio-cucurbits[data-lang="ja"] .lang-block--ja,
  .studio-cucurbits[data-lang="en"] .lang-block--en {
    display: block;
  }

  .studio-cucurbits .topbar {
    position: sticky;
    top: 0;
    z-index: 30;
    backdrop-filter: blur(18px);
    background: rgba(244, 243, 239, 0.82);
    border-bottom: 1px solid var(--line);
  }

  .studio-cucurbits .topbar-inner {
    max-width: var(--max);
    margin: 0 auto;
    padding: 0.85rem 1rem;
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 1rem;
    align-items: center;
  }

  .studio-cucurbits .brand-small {
    font-size: 0.86rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.04em;
    line-height: 0.95;
  }

  .studio-cucurbits .nav {
    display: flex;
    gap: 1rem;
    color: var(--muted);
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .studio-cucurbits .nav a:hover {
    color: var(--ink);
  }

  .studio-cucurbits .lang {
    display: flex;
    gap: 0.25rem;
  }

  .studio-cucurbits .lang button {
    appearance: none;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--ink);
    padding: 0.35rem 0.58rem;
    font: inherit;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
  }

  .studio-cucurbits .lang button.active {
    background: var(--ink);
    color: var(--bg);
    border-color: var(--ink);
  }

  .studio-cucurbits .hero {
    max-width: var(--max);
    margin: 0 auto;
    padding: clamp(1.6rem, 4vw, 3.5rem) 1rem 3.5rem;
  }

  .studio-cucurbits .hero-image-wrap {
    position: relative;
    min-height: clamp(440px, 72vh, 760px);
    border: 1px solid var(--line);
    background: var(--ink);
    overflow: hidden;
  }

  .studio-cucurbits .hero-image-wrap::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom, rgba(0,0,0,0.16), rgba(0,0,0,0.46)),
      linear-gradient(to right, rgba(0,0,0,0.48), rgba(0,0,0,0.05) 52%, rgba(0,0,0,0.36));
    z-index: 1;
    pointer-events: none;
  }

  .studio-cucurbits .hero-image-wrap img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.05) brightness(0.86);
    transform: scale(1.015);
  }

  .studio-cucurbits .hero-content {
    position: relative;
    z-index: 2;
    min-height: clamp(440px, 72vh, 760px);
    padding: clamp(1.2rem, 4vw, 3.5rem);
    display: grid;
    grid-template-columns: 1fr minmax(260px, 0.42fr);
    gap: clamp(2rem, 6vw, 5rem);
    align-items: end;
    color: #fff;
  }

  .studio-cucurbits .hero-content * {
    color: #fff;
  }

  .studio-cucurbits .kicker {
    margin: 0 0 1.4rem;
    color: rgba(255,255,255,0.68);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .studio-cucurbits .logo-type {
    margin: 0 0 2rem;
    font-weight: 800;
    text-transform: uppercase;
    font-size: clamp(3.45rem, 11vw, 9.4rem);
    letter-spacing: -0.105em;
    line-height: 0.78;
    transform: translateX(-0.08em);
    text-shadow: 0 20px 60px rgba(0,0,0,0.42);
  }

  .studio-cucurbits .logo-type span {
    display: inline-block;
    animation: cucurbits-type-breathe 5.2s ease-in-out infinite;
    transform-origin: center bottom;
  }

  .studio-cucurbits .logo-type span:nth-child(2n) { animation-delay: -0.7s; }
  .studio-cucurbits .logo-type span:nth-child(3n) { animation-delay: -1.4s; }
  .studio-cucurbits .logo-type span:nth-child(5n) { animation-delay: -2.1s; }
  .studio-cucurbits .logo-type span:nth-child(7n) { animation-delay: -2.8s; }

  @keyframes cucurbits-type-breathe {
    0%, 100% { transform: translateY(0) scaleX(1); }
    38% { transform: translateY(-0.035em) scaleX(0.965); }
    72% { transform: translateY(0.025em) scaleX(1.045); }
  }

  .studio-cucurbits .statement {
    max-width: 780px;
    font-size: clamp(1.25rem, 2.35vw, 2.2rem);
    line-height: 1.2;
    letter-spacing: -0.055em;
    margin: 0;
  }

  .studio-cucurbits .hero-side {
    border-left: 1px solid rgba(255,255,255,0.28);
    padding-left: 1.2rem;
  }

  .studio-cucurbits .hero-side p {
    margin: 0 0 1.2rem;
    color: rgba(255,255,255,0.72);
    font-size: 0.98rem;
  }

  .studio-cucurbits .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 1.4rem 0 1.6rem;
  }

  .studio-cucurbits .tags span {
    border: 1px solid rgba(255,255,255,0.32);
    padding: 0.32rem 0.54rem;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.075em;
    background: rgba(255,255,255,0.05);
  }

  .studio-cucurbits .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .studio-cucurbits .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    border: 1px solid currentColor;
    padding: 0.62rem 0.86rem;
    font-size: 0.83rem;
    text-transform: uppercase;
    letter-spacing: 0.065em;
    transition: 0.18s ease;
  }

  .studio-cucurbits .button.primary {
    background: currentColor;
    color: var(--bg);
  }

  .studio-cucurbits .hero-content .button.primary {
    background: #fff;
    color: #0b0b0b;
    border-color: #fff;
  }

  .studio-cucurbits .button:hover {
    transform: translateY(-1px);
  }

  .studio-cucurbits .ticker {
    border-block: 1px solid var(--line);
    overflow: hidden;
    white-space: nowrap;
    background: var(--ink);
    color: var(--bg);
  }

  .studio-cucurbits .ticker-track {
    display: inline-flex;
    gap: 2rem;
    padding: 0.7rem 0;
    animation: cucurbits-ticker 26s linear infinite;
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  @keyframes cucurbits-ticker {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .studio-cucurbits section:not(.hero) {
    max-width: var(--max);
    margin: 0 auto;
    padding: clamp(3.5rem, 7vw, 6.5rem) 1rem;
    border-bottom: 1px solid var(--line);
  }

  .studio-cucurbits .section-grid {
    display: grid;
    grid-template-columns: 0.38fr 1fr;
    gap: clamp(2rem, 6vw, 5rem);
    align-items: start;
  }

  .studio-cucurbits .section-label {
    position: sticky;
    top: 5.2rem;
    font-size: 0.74rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .studio-cucurbits h2 {
    margin: 0 0 1.6rem;
    max-width: 820px;
    font-size: clamp(2rem, 5vw, 5rem);
    line-height: 0.94;
    letter-spacing: -0.09em;
    text-transform: uppercase;
  }

  .studio-cucurbits h3 {
    margin: 0 0 0.8rem;
    font-size: 1.08rem;
    line-height: 1.15;
    letter-spacing: -0.035em;
  }

  .studio-cucurbits .lead {
    max-width: 780px;
    font-size: clamp(1.12rem, 2vw, 1.55rem);
    line-height: 1.35;
    letter-spacing: -0.045em;
    margin: 0 0 2rem;
  }

  .studio-cucurbits p {
    margin: 0 0 1rem;
  }

  .studio-cucurbits .muted {
    color: var(--muted);
  }

  .studio-cucurbits .image-strip {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 1px;
    border: 1px solid var(--line);
    background: var(--line);
    margin-top: 2rem;
  }

  .studio-cucurbits .image-strip img {
    height: 360px;
    object-fit: cover;
    filter: grayscale(1) contrast(1.06);
    background: var(--soft);
  }

  .studio-cucurbits .cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
  }

  .studio-cucurbits .card {
    background: var(--bg);
    padding: clamp(1.1rem, 2.3vw, 1.7rem);
    min-height: 220px;
  }

  .studio-cucurbits .card .num {
    display: block;
    margin-bottom: 2.6rem;
    color: var(--muted);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
  }

  .studio-cucurbits .card ul {
    margin: 1rem 0 0;
    padding: 0;
    list-style: none;
    color: var(--muted);
    font-size: 0.95rem;
  }

  .studio-cucurbits .card li {
    border-top: 1px solid var(--line);
    padding: 0.5rem 0;
  }

  .studio-cucurbits .process {
    display: grid;
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
  }

  .studio-cucurbits .process-row {
    display: grid;
    grid-template-columns: 100px 1fr 1fr;
    gap: 1.2rem;
    padding: 1.1rem;
    background: var(--bg);
    align-items: start;
  }

  .studio-cucurbits .process-row strong {
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .studio-cucurbits .contexts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
    margin-top: 2rem;
  }

  .studio-cucurbits .context-item {
    background: var(--bg);
    padding: 1rem;
    min-height: 88px;
    font-size: 0.95rem;
  }

  .studio-cucurbits .collab {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
    align-items: start;
    padding: 1.2rem;
    border: 1px solid var(--line);
    background: rgba(255,255,255,0.24);
  }

  .studio-cucurbits .portrait {
    aspect-ratio: 1 / 1;
    background: linear-gradient(135deg, var(--soft), rgba(0,0,0,0.12));
    overflow: hidden;
  }

  .studio-cucurbits .portrait img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.05);
  }

  .studio-cucurbits .inquiry {
    padding-bottom: 7rem;
  }

  .studio-cucurbits .inquiry-box {
    background: var(--ink);
    color: var(--bg);
    padding: clamp(1.4rem, 5vw, 3.5rem);
    display: grid;
    grid-template-columns: 1fr 0.6fr;
    gap: 2rem;
  }

  .studio-cucurbits .inquiry-box * {
    color: var(--bg);
  }

  .studio-cucurbits .inquiry-box .button {
    border-color: var(--bg);
  }

  .studio-cucurbits .inquiry-box .button.primary {
    background: var(--bg);
    color: var(--ink);
  }

  .studio-cucurbits .fineprint {
    color: rgba(244,243,239,0.58);
    font-size: 0.9rem;
  }

  @media (max-width: 900px) {
    .studio-cucurbits .topbar-inner {
      grid-template-columns: 1fr auto;
    }

    .studio-cucurbits .nav {
      display: none;
    }

    .studio-cucurbits .hero {
      padding-top: 1rem;
    }

    .studio-cucurbits .hero-image-wrap,
    .studio-cucurbits .hero-content {
      min-height: 620px;
    }

    .studio-cucurbits .hero-content,
    .studio-cucurbits .section-grid,
    .studio-cucurbits .collab,
    .studio-cucurbits .inquiry-box {
      grid-template-columns: 1fr;
    }

    .studio-cucurbits .hero-side {
      border-left: 0;
      border-top: 1px solid rgba(255,255,255,0.32);
      padding-left: 0;
      padding-top: 1.2rem;
    }

    .studio-cucurbits .section-label {
      position: static;
    }

    .studio-cucurbits .cards,
    .studio-cucurbits .contexts,
    .studio-cucurbits .image-strip {
      grid-template-columns: 1fr;
    }

    .studio-cucurbits .process-row {
      grid-template-columns: 1fr;
    }

    .studio-cucurbits .logo-type {
      font-size: clamp(3.05rem, 16vw, 6.2rem);
    }

    .studio-cucurbits .image-strip img {
      height: 260px;
    }
  }
</style>

<div class="studio-cucurbits" id="studio-cucurbits" data-lang="ja">
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand-small" href="#top">Studio<br>Cucurbits.</a>
      <nav class="nav" aria-label="Main navigation">
        <a href="#practice">Practice</a>
        <a href="#services">Services</a>
        <a href="#process">Process</a>
        <a href="#contexts">Contexts</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="lang">
        <button type="button" data-set-lang="ja" class="active">JP</button>
        <button type="button" data-set-lang="en">EN</button>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="hero-image-wrap">
        <img src="/images/hero_g.png" alt="Interdisciplinary performance with dancers, musicians, projection, and interaction">
        <div class="hero-content">
          <div>
            <p class="kicker">Composition / Sound Design / Sonic Systems</p>
            <h1 class="logo-type" aria-label="Studio Cucurbits">
              <span>S</span><span>T</span><span>U</span><span>D</span><span>I</span><span>O</span><br>
              <span>C</span><span>U</span><span>C</span><span>U</span><span>R</span><span>B</span><span>I</span><span>T</span><span>S</span><span>.</span>
            </h1>
            <div class="lang-block lang-block--ja">
              <p class="statement">作曲、サウンドデザイン、AI、空間、身体性を横断する、国際的な音楽制作スタジオ。</p>
            </div>
            <div class="lang-block lang-block--en">
              <p class="statement">An international studio for composition, sound design, AI, space, and embodied sonic practice.</p>
            </div>
          </div>

          <aside class="hero-side">
            <div class="lang-block lang-block--ja">
              <p>Studio Cucurbits. は、作曲家・サウンドアーティスト Sachie Kobayashi による制作スタジオです。映画、映像、舞台、展示、プロダクト、研究開発に向けて、プロジェクト固有の音の言語を設計します。</p>
            </div>
            <div class="lang-block lang-block--en">
              <p>Studio Cucurbits. is the studio of composer and sound artist Sachie Kobayashi. It develops project-specific sonic languages for film, moving image, performance, installation, products, and research-driven work.</p>
            </div>
            <div class="tags">
              <span>Original Music</span>
              <span>Sound Design</span>
              <span>Installation</span>
              <span>AI Audio</span>
              <span>Consultation</span>
            </div>
            <div class="cta-row">
              <a class="button primary" href="mailto:info@sachiekobayashi.com">Inquiry</a>
              <a class="button" href="#services">View Services</a>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <div class="ticker" aria-hidden="true">
      <div class="ticker-track">
        <span>sound / image / systems / composition / voice / algorithm / space / performance / </span>
        <span>sound / image / systems / composition / voice / algorithm / space / performance / </span>
        <span>sound / image / systems / composition / voice / algorithm / space / performance / </span>
      </div>
    </div>

    <section id="practice">
      <div class="section-grid">
        <div class="section-label">01 / Practice</div>
        <div>
          <div class="lang-block lang-block--ja">
            <h2>音を、媒体の後景ではなく、構造として扱う。</h2>
            <p class="lead">Studio Cucurbits. は、単に「映像に音楽を付ける」場所ではありません。コンセプト、編集、空間、身体、声、テクノロジーの関係から、プロジェクト全体を支える音響的な構造を設計します。</p>
            <p class="muted">現代音楽、電気音響、サウンドアート、映像音楽、AI・計算的プロセスを横断し、芸術的な深度と実制作の精度を両立させます。</p>
          </div>
          <div class="lang-block lang-block--en">
            <h2>Sound is treated as structure, not background.</h2>
            <p class="lead">Studio Cucurbits. does not simply add music to an image. It designs sonic structures that support the entire project through concept, editing, space, body, voice, and technology.</p>
            <p class="muted">The practice moves across contemporary composition, electroacoustic music, sound art, music for image, and AI-based creative processes, combining artistic depth with production clarity.</p>
          </div>
          <div class="image-strip">
            <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits001.png" alt="Studio Cucurbits image 1">
            <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits002.png" alt="Studio Cucurbits image 2">
          </div>
        </div>
      </div>
    </section>

    <section id="services">
      <div class="section-grid">
        <div class="section-label">02 / Services</div>
        <div>
          <div class="lang-block lang-block--ja">
            <h2>Services</h2>
            <p class="lead">依頼内容に応じて、作曲、音響設計、技術的プロトタイピング、クリエイティブ・コンサルテーションを組み合わせます。</p>
          </div>
          <div class="lang-block lang-block--en">
            <h2>Services</h2>
            <p class="lead">Depending on the project, composition, sound design, technical prototyping, and creative consultation can be combined.</p>
          </div>
          <div class="cards">
            <article class="card">
              <span class="num">01</span>
              <h3>Original Music for Film / Moving Image</h3>
              <div class="lang-block lang-block--ja"><p>映画、ドキュメンタリー、アーティスト映像、短編映像、広告・ブランド映像のためのオリジナル音楽。</p></div>
              <div class="lang-block lang-block--en"><p>Bespoke composition for film, documentary, artist film, short-form video, campaigns, and visual media.</p></div>
              <ul>
                <li>Score / cues / themes</li>
                <li>Stems / edits / final files</li>
                <li>Minimal, experimental, dramatic, or hybrid sound</li>
              </ul>
            </article>
            <article class="card">
              <span class="num">02</span>
              <h3>Sound Design / Sonic Identity</h3>
              <div class="lang-block lang-block--ja"><p>プロダクト、ブランド、UI、映像、展示のためのサウンドデザインと音のアイデンティティ設計。</p></div>
              <div class="lang-block lang-block--en"><p>Sound design and sonic identity for products, brands, UI, moving image, and exhibitions.</p></div>
              <ul>
                <li>Sound logo / UI sound</li>
                <li>Texture / transition / impact design</li>
                <li>Brand-oriented sonic systems</li>
              </ul>
            </article>
            <article class="card">
              <span class="num">03</span>
              <h3>Installation / Performance / Immersive Work</h3>
              <div class="lang-block lang-block--ja"><p>インスタレーション、舞台、ダンス、パフォーマンス、マルチメディア作品のための音楽・音響制作。</p></div>
              <div class="lang-block lang-block--en"><p>Music and sound for installation, stage, dance, performance, and multimedia environments.</p></div>
              <ul>
                <li>Spatial / multichannel sound</li>
                <li>Playback structure</li>
                <li>Site-specific sonic dramaturgy</li>
              </ul>
            </article>
            <article class="card">
              <span class="num">04</span>
              <h3>AI Audio / Creative Technology</h3>
              <div class="lang-block lang-block--ja"><p>AI、音声、生成システム、アルゴリズムを含む創作プロセスの設計とプロトタイプ制作。</p></div>
              <div class="lang-block lang-block--en"><p>Creative process design and prototyping involving AI, voice, generative systems, and algorithms.</p></div>
              <ul>
                <li>AI-assisted composition</li>
                <li>Voice / synthesis workflows</li>
                <li>Prototype for research-based projects</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="process">
      <div class="section-grid">
        <div class="section-label">03 / Process</div>
        <div>
          <div class="lang-block lang-block--ja">
            <h2>Process</h2>
            <p class="lead">依頼側が安心して進められるよう、初期段階で方向性・納品物・スケジュールを明確にします。</p>
          </div>
          <div class="lang-block lang-block--en">
            <h2>Process</h2>
            <p class="lead">Direction, deliverables, and schedule are clarified early so that collaborators can move forward with confidence.</p>
          </div>
          <div class="process">
            <div class="process-row">
              <strong>Phase 01</strong>
              <div>Brief / Listening</div>
              <div class="muted">Project context, references, constraints, timeline, and intended audience.</div>
            </div>
            <div class="process-row">
              <strong>Phase 02</strong>
              <div>Direction / Prototype</div>
              <div class="muted">Sonic direction, palette, demo material, cue structure, or technical sketch.</div>
            </div>
            <div class="process-row">
              <strong>Phase 03</strong>
              <div>Production / Revision</div>
              <div class="muted">Composition, sound design, implementation support, revisions, and final delivery.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="contexts">
      <div class="section-grid">
        <div class="section-label">04 / Contexts</div>
        <div>
          <div class="lang-block lang-block--ja">
            <h2>Selected Contexts</h2>
            <p class="lead">ヨーロッパと日本を中心に、現代音楽、映像、舞台、美術、テクノロジーを横断する文脈で活動しています。</p>
          </div>
          <div class="lang-block lang-block--en">
            <h2>Selected Contexts</h2>
            <p class="lead">The work has developed internationally across Europe and Japan, spanning contemporary music, moving image, performance, visual art, and technology.</p>
          </div>
          <div class="contexts">
            <div class="context-item">Klangforum Wien</div>
            <div class="context-item">Ensemble Modern</div>
            <div class="context-item">Ensemble Proton Bern</div>
            <div class="context-item">IRCAM</div>
            <div class="context-item">Le Fresnoy</div>
            <div class="context-item">Orchestre de la HEM</div>
            <div class="context-item">Sonicware LIVEN Ambient</div>
            <div class="context-item">Sound Logo / Sonic Branding</div>
            <div class="context-item">AI / Creative Research</div>
          </div>
          <div class="image-strip">
            <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits003.png" alt="Studio Cucurbits image 3">
            <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/logo1.png" alt="Studio Cucurbits logo image">
          </div>
        </div>
      </div>
    </section>

    <section id="collaborator">
      <div class="section-grid">
        <div class="section-label">05 / Collaborator</div>
        <div>
          <div class="lang-block lang-block--ja">
            <h2>Creative Technology</h2>
            <p class="lead">必要に応じて、AI・音声技術・クリエイティブコンピュテーション領域の専門家と協働します。</p>
          </div>
          <div class="lang-block lang-block--en">
            <h2>Creative Technology</h2>
            <p class="lead">When needed, the studio collaborates with specialists in AI, voice technology, and creative computation.</p>
          </div>
          <div class="collab">
            <div>
              <h3>Frederik Bous</h3>
              <p class="muted">AI Researcher and Creative Technology Collaborator</p>
              <div class="lang-block lang-block--ja">
                <p>音声合成、歌声合成、ボイス・トランスフォーメーション、表現制御に関する深層学習手法を専門とする研究者・開発者。Studio Cucurbits. では、AIとクリエイティブ・コンピュテーションを含むプロジェクトで技術面の協働を行います。</p>
              </div>
              <div class="lang-block lang-block--en">
                <p>A researcher and developer specializing in deep learning methods for speech and singing voice synthesis, transformation, and expressive control. Within Studio Cucurbits., he contributes to projects involving AI and creative computation.</p>
              </div>
              <a class="button" href="https://frederik.bous.cc/" target="_blank" rel="noopener noreferrer">Website</a>
            </div>
            <div class="portrait">
              <img src="https://frederik.bous.cc/assets/bous_square.jpg" alt="Portrait of Frederik Bous">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="inquiry">
      <div class="inquiry-box">
        <div>
          <div class="lang-block lang-block--ja">
            <h2>Inquiry</h2>
            <p class="lead">映画、展示、舞台、プロダクト、研究開発、ブランドプロジェクトなどで、独自の音や音楽を必要としている方はご相談ください。</p>
            <p class="fineprint">企画概要、希望納期、媒体、予算感、参考資料があると初回の判断がスムーズです。</p>
          </div>
          <div class="lang-block lang-block--en">
            <h2>Inquiry</h2>
            <p class="lead">For film, exhibition, performance, product, research, and brand projects requiring an original approach to sound or music, please get in touch.</p>
            <p class="fineprint">A short outline, timeline, format, budget range, and references are helpful for the first response.</p>
          </div>
        </div>
        <div class="cta-row">
          <a class="button primary" href="mailto:info@sachiekobayashi.com">info@sachiekobayashi.com</a>
          <a class="button" href="https://www.sachiekobayashi.com/" target="_blank" rel="noopener noreferrer">Sachie Kobayashi</a>
        </div>
      </div>
    </section>
  </main>
</div>

<script>
  (function () {
    var root = document.getElementById('studio-cucurbits');
    if (!root) return;

    var buttons = root.querySelectorAll('[data-set-lang]');

    function setLang(lang) {
      root.setAttribute('data-lang', lang);
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('active', buttons[i].getAttribute('data-set-lang') === lang);
      }
      try {
        localStorage.setItem('studio-cucurbits-lang', lang);
      } catch (e) {}
    }

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        setLang(this.getAttribute('data-set-lang'));
      });
    }

    var saved = 'ja';
    try {
      saved = localStorage.getItem('studio-cucurbits-lang') || 'ja';
    } catch (e) {}

    setLang(saved);
  })();
</script>
