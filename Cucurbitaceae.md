---
layout: page
title: Studio Cucurbits.
permalink: /cucurbits/
---

<style>
  .cucurbits-page {
    --page-width: 1040px;
    --content-width: 920px;
    --text-width: 620px;
    --border-color: rgba(0, 0, 0, 0.12);
    --soft-bg: rgba(0, 0, 0, 0.028);
    max-width: var(--page-width);
    margin: 0 auto;
    padding: 1.5rem 1.25rem 4.5rem;
    color: inherit;
    font: inherit;
    line-height: 1.85;
  }

  .cucurbits-page .lang-switch {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin: 0 0 2.5rem;
  }

  .cucurbits-page .lang-switch button {
    appearance: none;
    background: transparent;
    color: inherit;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    padding: 0.5rem 0.95rem;
    font: inherit;
    font-size: 0.92rem;
    line-height: 1;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .cucurbits-page .lang-switch button:hover,
  .cucurbits-page .lang-switch button.is-active {
    background: rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.2);
  }

  .cucurbits-page .lang-block {
    display: none;
  }

  .cucurbits-page[data-lang="ja"] .lang-block--ja {
    display: block;
  }

  .cucurbits-page[data-lang="en"] .lang-block--en {
    display: block;
  }

  .cucurbits-page .hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
    gap: 2.5rem;
    align-items: center;
    max-width: var(--content-width);
    margin: 0 auto 4rem;
    padding: 0 0 3.5rem;
    border-bottom: 1px solid var(--border-color);
  }

  .cucurbits-page .hero-text {
    max-width: var(--text-width);
  }

  .cucurbits-page .eyebrow {
    margin: 0 0 0.85rem;
    font-size: 0.92rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.72;
  }

  .cucurbits-page .intro {
    margin: 0 0 1.25rem;
    font-size: 1.5rem;
    line-height: 1.6;
  }

  .cucurbits-page .hero p,
  .cucurbits-page .section p,
  .cucurbits-page .cta-card p {
    margin: 0 0 1.1rem;
  }

  .cucurbits-page .hero-image img,
  .cucurbits-page .section-image img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 12px;
  }

  .cucurbits-page .hero-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin: 1.5rem 0 1.75rem;
  }

  .cucurbits-page .hero-meta span {
    display: inline-flex;
    align-items: center;
    min-height: 2rem;
    padding: 0.35rem 0.8rem;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    font-size: 0.92rem;
    line-height: 1.2;
  }

  .cucurbits-page .email-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.8rem 1rem;
    border: 1px solid rgba(0, 0, 0, 0.18);
    border-radius: 12px;
    background: var(--soft-bg);
    color: inherit;
    text-decoration: none;
    font-weight: 600;
  }

  .cucurbits-page .email-cta:hover {
    background: rgba(0, 0, 0, 0.045);
  }

  .cucurbits-page .section {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
    gap: 2.5rem;
    align-items: start;
    max-width: var(--content-width);
    margin: 0 auto 4rem;
    padding: 0 0 3.5rem;
    border-bottom: 1px solid var(--border-color);
  }

  .cucurbits-page .section.reverse .section-text {
    order: 2;
  }

  .cucurbits-page .section.reverse .section-image {
    order: 1;
  }

  .cucurbits-page .section-text {
    max-width: var(--text-width);
  }

  .cucurbits-page .section h2,
  .cucurbits-page .section h3,
  .cucurbits-page .cta-card h2 {
    margin: 0 0 1rem;
    line-height: 1.35;
  }

  .cucurbits-page .service-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .cucurbits-page .service-card {
    padding: 1.1rem 1rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.012);
  }

  .cucurbits-page .service-card h3 {
    margin-bottom: 0.6rem;
    font-size: 1rem;
  }

  .cucurbits-page .service-card p {
    margin-bottom: 0.75rem;
    font-size: 0.96rem;
  }

  .cucurbits-page .service-card ul,
  .cucurbits-page .section ul {
    margin: 0;
    padding-left: 1.15rem;
  }

  .cucurbits-page .service-card li,
  .cucurbits-page .section li {
    margin-bottom: 0.45rem;
  }

  .cucurbits-page .trust-list,
  .cucurbits-page .client-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.35rem 1rem;
    margin-top: 1rem;
  }

  .cucurbits-page .cta-card {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: 14px;
    background: var(--soft-bg);
  }

  .cucurbits-page .cta-card .email-cta {
    margin-top: 0.5rem;
  }

  @media (max-width: 860px) {
    .cucurbits-page {
      padding: 1rem 1rem 3.5rem;
    }

    .cucurbits-page .lang-switch {
      justify-content: flex-start;
      margin-bottom: 2rem;
    }

    .cucurbits-page .hero,
    .cucurbits-page .section {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-bottom: 3rem;
      padding-bottom: 3rem;
    }

    .cucurbits-page .section.reverse .section-text,
    .cucurbits-page .section.reverse .section-image {
      order: initial;
    }

    .cucurbits-page .intro {
      font-size: 1.28rem;
      line-height: 1.55;
    }

    .cucurbits-page .service-grid,
    .cucurbits-page .trust-list,
    .cucurbits-page .client-list {
      grid-template-columns: 1fr;
    }
  }
</style>

<div class="cucurbits-page" id="cucurbits-page" data-lang="ja">
  <div class="lang-switch">
    <button type="button" data-lang-button="ja">日本語</button>
    <button type="button" data-lang-button="en">English</button>
  </div>

  <section class="hero">
    <div class="hero-text">
      <div class="lang-block lang-block--ja">
        <p class="eyebrow">Studio Cucurbits.</p>
        <p class="intro">
          <strong>Studio Cucurbits. by Sachie Kobayashi</strong><br>
          作曲家・サウンドアーティスト Sachie Kobayashi による、国際的な音楽制作とサウンドデザインのためのスタジオ。
        </p>
        <p>
          映画、映像、舞台、インスタレーション、プロダクト、リサーチベースのプロジェクトに向けて、
          オリジナル音楽、サウンドデザイン、共同制作を行っています。
        </p>
        <p>
          国内外のアーティスト、映像作家、文化機関、クリエイティブチーム、企業からの受託制作・コラボレーションに対応しています。
        </p>
        <div class="hero-meta">
          <span>Composition</span>
          <span>Sound Design</span>
          <span>Installation / Performance</span>
          <span>AI &amp; Technology</span>
        </div>
        <a class="email-cta" href="mailto:info@sachiekobayashi">info@sachiekobayashi</a>
      </div>

      <div class="lang-block lang-block--en">
        <p class="eyebrow">Studio Cucurbits.</p>
        <p class="intro">
          <strong>Studio Cucurbits. by Sachie Kobayashi</strong><br>
          An international studio for composition, sound design, and interdisciplinary sonic work.
        </p>
        <p>
          I create original music and sound for film, moving image, performance, installation, products, and research-driven projects.
        </p>
        <p>
          Available for commissions and collaborations with artists, filmmakers, cultural institutions, creative teams, and companies internationally.
        </p>
        <div class="hero-meta">
          <span>Composition</span>
          <span>Sound Design</span>
          <span>Installation / Performance</span>
          <span>AI &amp; Technology</span>
        </div>
        <a class="email-cta" href="mailto:info@sachiekobayashi">info@sachiekobayashi</a>
      </div>
    </div>

    <div class="hero-image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/logo1.png" alt="Studio Cucurbits logo">
    </div>
  </section>

  <section class="section">
    <div class="section-text">
      <div class="lang-block lang-block--ja">
        <h2>What I Do</h2>
        <p>
          現代音楽、電気音響、サウンドアート、映像音楽、そしてAIや計算的プロセスを含む創作実践を横断しながら、
          作品ごとに固有の音と言語を設計します。
        </p>
        <p>
          芸術性と実用性のどちらか一方ではなく、コンセプト、空間、身体感覚、時間感覚、メディア特性に寄り添う形で、
          実制作へ接続するサウンドを提案します。
        </p>
      </div>

      <div class="lang-block lang-block--en">
        <h2>What I Do</h2>
        <p>
          My practice moves across contemporary composition, electroacoustic music, sound art, music for image, and creative work involving AI and computational processes.
        </p>
        <p>
          I develop sound that is specific to each project, balancing artistic depth with practical production needs, and responding to concept, space, body, time, and medium.
        </p>
      </div>
    </div>

    <div class="section-image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits001.png" alt="Studio image 1">
    </div>
  </section>

  <section class="section reverse">
    <div class="section-text">
      <div class="lang-block lang-block--ja">
        <h2>Services</h2>
        <div class="service-grid">
          <div class="service-card">
            <h3>Original Music for Film / Moving Image</h3>
            <p>映画、ドキュメンタリー、アーティスト映像、短編映像などのためのオリジナル作曲。</p>
            <ul>
              <li>劇伴、キュー制作、テーマ音楽</li>
              <li>ステム、編集用素材、最終納品データ</li>
            </ul>
          </div>

          <div class="service-card">
            <h3>Sound Design / Sonic Branding</h3>
            <p>プロダクト、ブランド、デジタルコンテンツ、映像のための音設計とサウンドアイデンティティ制作。</p>
            <ul>
              <li>サウンドロゴ、UI音、ブランド音設計</li>
              <li>短編映像・広告向けサウンドデザイン</li>
            </ul>
          </div>

          <div class="service-card">
            <h3>Installation / Performance / Immersive Work</h3>
            <p>展示、舞台、ダンス、インスタレーション、マルチメディア作品のための音楽・音響制作。</p>
            <ul>
              <li>空間音響、マルチチャンネル音源</li>
              <li>上演・展示に応じた再生設計</li>
            </ul>
          </div>

          <div class="service-card">
            <h3>Creative Consultation / Mentoring</h3>
            <p>作曲、音の方向性、AIを含む創作プロセスに関する相談、リサーチ開発、メンタリング。</p>
            <ul>
              <li>コンセプト設計とフィードバック</li>
              <li>プロジェクト初期段階の伴走</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="lang-block lang-block--en">
        <h2>Services</h2>
        <div class="service-grid">
          <div class="service-card">
            <h3>Original Music for Film / Moving Image</h3>
            <p>Bespoke composition for film, documentary, artist film, and visual media.</p>
            <ul>
              <li>score, cues, thematic material</li>
              <li>stems and final delivery files</li>
            </ul>
          </div>

          <div class="service-card">
            <h3>Sound Design / Sonic Branding</h3>
            <p>Sound design and sonic identity for products, brands, digital content, and short-form media.</p>
            <ul>
              <li>sound logos, UI sounds, sonic systems</li>
              <li>refined sound design for media and campaigns</li>
            </ul>
          </div>

          <div class="service-card">
            <h3>Installation / Performance / Immersive Work</h3>
            <p>Music and sound development for exhibitions, stage works, dance, installations, and multimedia environments.</p>
            <ul>
              <li>multichannel or spatial sound materials</li>
              <li>playback structure for site or performance</li>
            </ul>
          </div>

          <div class="service-card">
            <h3>Creative Consultation / Mentoring</h3>
            <p>Consultation for composition, sonic direction, research-based development, and AI-related creative practice.</p>
            <ul>
              <li>concept feedback and sound direction</li>
              <li>mentoring and early-stage project support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="section-image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits002.png" alt="Studio image 2">
    </div>
  </section>

  <section class="section">
    <div class="section-text">
      <div class="lang-block lang-block--ja">
        <h2>Selected Contexts</h2>
        <p>
          ヨーロッパと日本を中心に活動し、現代音楽、映像、舞台、美術、テクノロジーを横断する文脈で作品を発表・制作しています。
        </p>
        <div class="trust-list">
          <div>Klangforum Wien</div>
          <div>Ensemble Modern</div>
          <div>Ensemble Proton Bern</div>
          <div>IRCAM</div>
          <div>Le Fresnoy</div>
          <div>Orchestre de la HEM</div>
        </div>
        <p style="margin-top: 1.25rem;">
          商業・応用的な仕事として、Sonicware「LIVEN Ambient」のサウンドデザインや、サウンドロゴ制作などにも取り組んでいます。
        </p>
      </div>

      <div class="lang-block lang-block--en">
        <h2>Selected Contexts</h2>
        <p>
          My work has developed internationally across Europe and Japan, in contexts spanning contemporary music, film, performance, visual art, and technology.
        </p>
        <div class="trust-list">
          <div>Klangforum Wien</div>
          <div>Ensemble Modern</div>
          <div>Ensemble Proton Bern</div>
          <div>IRCAM</div>
          <div>Le Fresnoy</div>
          <div>Orchestre de la HEM</div>
        </div>
        <p style="margin-top: 1.25rem;">
          Applied and commissioned work includes sound design for Sonicware’s LIVEN Ambient and sonic identity work for commercial clients.
        </p>
      </div>
    </div>

    <div class="section-image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits003.png" alt="Studio image 3">
    </div>
  </section>

  <section class="section reverse">
    <div class="section-text">
      <div class="lang-block lang-block--ja">
        <h2>Who I Work With</h2>
        <p>以下のような方々・組織からのご相談を歓迎しています。</p>
        <ul class="client-list">
          <li>映画監督・映像作家</li>
          <li>アーティスト・キュレーター</li>
          <li>舞台・ダンス・パフォーマンス制作者</li>
          <li>美術館・文化機関・フェスティバル</li>
          <li>ブランド・企業・デザインスタジオ</li>
          <li>研究者・テクノロジーチーム</li>
        </ul>
        <p style="margin-top: 1.25rem;">
          強いコンセプトや切実なテーマを持つプロジェクト、また独自の音の言語を必要とする案件に特に関心があります。
        </p>
      </div>

      <div class="lang-block lang-block--en">
        <h2>Who I Work With</h2>
        <p>I welcome inquiries from clients and collaborators such as:</p>
        <ul class="client-list">
          <li>filmmakers and documentary directors</li>
          <li>artists and curators</li>
          <li>performance makers and choreographers</li>
          <li>museums, festivals, and cultural institutions</li>
          <li>brands, companies, and design studios</li>
          <li>researchers and technology teams</li>
        </ul>
        <p style="margin-top: 1.25rem;">
          I am especially drawn to projects that need an original sonic language, conceptual depth, and close collaboration.
        </p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="section-text">
      <div class="lang-block lang-block--ja">
        <h2>AI &amp; Technology</h2>
        <p>
          AIやアルゴリズムは単なるツールとしてではなく、創作、判断、作者性を問い直す契機として扱っています。
        </p>
        <p>
          この視点は、アーティスティックな作品制作だけでなく、新しい技術や研究文脈を含む受託案件や共同開発にも生きています。
        </p>
      </div>

      <div class="lang-block lang-block--en">
        <h2>AI &amp; Technology</h2>
        <p>
          AI and computational processes are part of my practice not only as tools, but as ways of rethinking authorship, listening, and creative decision-making.
        </p>
        <p>
          This perspective informs both artistic commissions and applied collaborations involving emerging technology, research, and sound-led experimentation.
        </p>
      </div>
    </div>
  </section>

  <section class="cta-card">
    <div class="lang-block lang-block--ja">
      <h2>Inquiry</h2>
      <p>
        音楽制作、サウンドデザイン、受託制作、共同制作に関するご相談を歓迎しています。
      </p>
      <p>
        映画、展示、舞台、プロダクト、研究プロジェクトなどで音や音楽を必要としている方は、
        企画概要、スケジュール、媒体や規模感を添えてお気軽にご連絡ください。
      </p>
      <a class="email-cta" href="mailto:info@sachiekobayashi">info@sachiekobayashi</a>
    </div>

    <div class="lang-block lang-block--en">
      <h2>Inquiry</h2>
      <p>
        I welcome inquiries for commissions, collaborations, sound design projects, and selected commercial work.
      </p>
      <p>
        If you are developing a film, exhibition, performance, product, or research project and are looking for an original approach to music or sound, please feel free to get in touch with a short outline, timeline, and format.
      </p>
      <a class="email-cta" href="mailto:info@sachiekobayashi">info@sachiekobayashi</a>
    </div>
  </section>
</div>

<script>
  (function() {
    var root = document.getElementById('cucurbits-page');
    if (!root) return;

    var buttons = root.querySelectorAll('[data-lang-button]');

    function setLang(lang) {
      root.setAttribute('data-lang', lang);
      try {
        localStorage.setItem('cucurbits-lang', lang);
      } catch (e) {}
      buttons.forEach(function(button) {
        button.classList.toggle('is-active', button.getAttribute('data-lang-button') === lang);
      });
    }

    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        setLang(button.getAttribute('data-lang-button'));
      });
    });

    var savedLang = 'ja';
    try {
      savedLang = localStorage.getItem('cucurbits-lang') || 'ja';
    } catch (e) {}

    setLang(savedLang);
  })();
</script>
