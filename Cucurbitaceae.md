---
layout: main
title: Studio Cucurbits.
permalink: /cucurbits/
---

<style>
  .cucurbits-page {
    width: 100%;
    max-width: 1040px;
    margin: 0;
    padding: 2rem 1.25rem 4rem 0;
    color: #111;
    line-height: 1.85;
    text-align: left;
  }

  .cucurbits-page,
  .cucurbits-page * {
    color: #111 !important;
    box-sizing: border-box;
  }

  .cucurbits-page .lang-switch {
    display: flex;
    justify-content: flex-start;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .cucurbits-page .lang-switch button {
    appearance: none;
    border: 1px solid rgba(0, 0, 0, 0.18);
    background: #fff;
    border-radius: 999px;
    padding: 0.5rem 0.95rem;
    font: inherit;
    cursor: pointer;
  }

  .cucurbits-page .lang-switch button.is-active {
    background: rgba(0, 0, 0, 0.05);
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

  .cucurbits-page .moving-logo video {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    background: transparent;
  }

  .cucurbits-page .hero,
  .cucurbits-page .section {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 2rem;
    align-items: start;
    padding-bottom: 3rem;
    margin-bottom: 3rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .cucurbits-page .section.reverse .text {
    order: 2;
  }

  .cucurbits-page .section.reverse .image {
    order: 1;
  }

  .cucurbits-page .intro {
    font-size: 1.45rem;
    line-height: 1.6;
    margin: 0 0 1.25rem;
  }

  .cucurbits-page .eyebrow {
    font-size: 0.92rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.72;
    margin: 0 0 0.75rem;
  }

  .cucurbits-page p {
    margin: 0 0 1.1rem;
    text-align: left;
  }

  .cucurbits-page h2,
  .cucurbits-page h3 {
    margin: 0 0 1rem;
    line-height: 1.35;
    text-align: left;
  }

  .cucurbits-page img {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: 12px;
  }

  .cucurbits-page .hero-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin: 1.4rem 0 1.6rem;
  }

  .cucurbits-page .hero-meta span {
    border: 1px solid rgba(0, 0, 0, 0.14);
    border-radius: 999px;
    padding: 0.35rem 0.8rem;
    font-size: 0.92rem;
  }

  .cucurbits-page .email-cta {
    display: inline-block;
    padding: 0.8rem 1rem;
    border: 1px solid rgba(0, 0, 0, 0.18);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.03);
    text-decoration: none;
    font-weight: 600;
  }

  .cucurbits-page .service-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .cucurbits-page .service-card,
  .cucurbits-page .collaborator-card {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.015);
  }

  .cucurbits-page .service-card h3,
  .cucurbits-page .collaborator-card h3 {
    font-size: 1rem;
    margin-bottom: 0.65rem;
  }

  .cucurbits-page .service-card p {
    font-size: 0.96rem;
    margin-bottom: 0.75rem;
  }

  .cucurbits-page ul {
    margin: 0;
    padding-left: 1.15rem;
  }

  .cucurbits-page li {
    margin-bottom: 0.45rem;
    text-align: left;
  }

  .cucurbits-page .trust-list,
  .cucurbits-page .client-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.35rem 1rem;
    margin-top: 1rem;
  }

  .cucurbits-page .collaborator-role {
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.72;
    margin-bottom: 1rem;
  }

  .cucurbits-page .cta-card {
    border: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.03);
    padding: 1.5rem;
  }

  @media (max-width: 860px) {
    .cucurbits-page {
      padding: 1.5rem 1rem 3rem 0;
    }

    .cucurbits-page .hero,
    .cucurbits-page .section {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .cucurbits-page .section.reverse .text,
    .cucurbits-page .section.reverse .image {
      order: initial;
    }

    .cucurbits-page .service-grid,
    .cucurbits-page .trust-list,
    .cucurbits-page .client-list {
      grid-template-columns: 1fr;
    }

    .cucurbits-page .intro {
      font-size: 1.25rem;
    }

    .cucurbits-page .moving-logo video {
      max-width: 100%;
    }
  }
</style>

<div class="cucurbits-page" id="cucurbits-page" data-lang="ja">
  <div class="moving-logo">
    <video autoplay muted loop playsinline preload="metadata" controls>
      <source src="/images/logo_2026.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>

  <div class="lang-switch">
    <button type="button" data-lang-button="ja">日本語</button>
    <button type="button" data-lang-button="en">English</button>
  </div>

  <section class="hero">
    <div class="text">
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

    <div class="image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/logo1.png" alt="Studio Cucurbits logo">
    </div>
  </section>

  <section class="section">
    <div class="text">
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

    <div class="image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits001.png" alt="Studio image 1">
    </div>
  </section>

  <section class="section reverse">
    <div class="text">
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

    <div class="image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits002.png" alt="Studio image 2">
    </div>
  </section>

  <section class="section">
    <div class="text">
      <div class="lang-block lang-block--ja">
        <h2>Selected Contexts</h2>
        <p>ヨーロッパと日本を中心に活動し、現代音楽、映像、舞台、美術、テクノロジーを横断する文脈で作品を発表・制作しています。</p>
        <div class="trust-list">
          <div>Klangforum Wien</div>
          <div>Ensemble Modern</div>
          <div>Ensemble Proton Bern</div>
          <div>IRCAM</div>
          <div>Le Fresnoy</div>
          <div>Orchestre de la HEM</div>
        </div>
        <p style="margin-top: 1.25rem;">商業・応用的な仕事として、Sonicware「LIVEN Ambient」のサウンドデザインや、サウンドロゴ制作などにも取り組んでいます。</p>
      </div>

      <div class="lang-block lang-block--en">
        <h2>Selected Contexts</h2>
        <p>My work has developed internationally across Europe and Japan, in contexts spanning contemporary music, film, performance, visual art, and technology.</p>
        <div class="trust-list">
          <div>Klangforum Wien</div>
          <div>Ensemble Modern</div>
          <div>Ensemble Proton Bern</div>
          <div>IRCAM</div>
          <div>Le Fresnoy</div>
          <div>Orchestre de la HEM</div>
        </div>
        <p style="margin-top: 1.25rem;">Applied and commissioned work includes sound design for Sonicware’s LIVEN Ambient and sonic identity work for commercial clients.</p>
      </div>
    </div>

    <div class="image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits003.png" alt="Studio image 3">
    </div>
  </section>

  <section class="section reverse">
    <div class="text">
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
        <p style="margin-top: 1.25rem;">強いコンセプトや切実なテーマを持つプロジェクト、また独自の音の言語を必要とする案件に特に関心があります。</p>
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
        <p style="margin-top: 1.25rem;">I am especially drawn to projects that need an original sonic language, conceptual depth, and close collaboration.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="text">
      <div class="lang-block lang-block--ja">
        <h2>AI &amp; Technology</h2>
        <p>AIやアルゴリズムは単なるツールとしてではなく、創作、判断、作者性を問い直す契機として扱っています。</p>
        <p>この視点は、アーティスティックな作品制作だけでなく、新しい技術や研究文脈を含む受託案件や共同開発にも生きています。</p>
      </div>

      <div class="lang-block lang-block--en">
        <h2>AI &amp; Technology</h2>
        <p>AI and computational processes are part of my practice not only as tools, but as ways of rethinking authorship, listening, and creative decision-making.</p>
        <p>This perspective informs both artistic commissions and applied collaborations involving emerging technology, research, and sound-led experimentation.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="text">
      <div class="lang-block lang-block--ja">
        <h2>Collaborator</h2>
        <div class="collaborator-card">
          <h3>Frederik Bous</h3>
          <p class="collaborator-role">AI Researcher and Creative Technology Collaborator</p>
          <p>
            Website:
            <a href="https://frederik.bous.cc/" target="_blank" rel="noopener noreferrer">frederik.bous.cc</a>
          </p>
          <p>
            Frederik Bous は、音声およびボイステクノロジーのための人工知能を専門とする研究者・開発者です。
            音声合成、歌声合成、ボイス・トランスフォーメーション、表現制御に関する深層学習手法を軸に、
            次世代のニューラルオーディオシステムの開発に取り組んでいます。
          </p>
          <p>
            彼の研究は、ニューラルボコーダーや機械学習モデルを含む高度な音声生成・操作技術を扱い、
            異なる言語、声質、表現スタイルにまたがる高品質な音声や歌声の生成を探究しています。
          </p>
          <p>
            また、アーティストやクリエイティブ・プラクティショナーとの協働を通じて、
            生成音響システム、声の変換、インタラクティブ・メディアを含む制作プロセスにAIを統合する実験的なワークフロー設計にも携わっています。
            Studio Cucurbits では、AIとクリエイティブ・コンピュテーションの領域におけるテクノロジー・コラボレーターとして、
            音楽、デジタルメディア、先端技術を横断するハイブリッドな実践を支えています。
          </p>
        </div>
      </div>

      <div class="lang-block lang-block--en">
        <h2>Collaborator</h2>
        <div class="collaborator-card">
          <h3>Frederik Bous</h3>
          <p class="collaborator-role">AI Researcher and Creative Technology Collaborator</p>
          <p>
            Website:
            <a href="https://frederik.bous.cc/" target="_blank" rel="noopener noreferrer">frederik.bous.cc</a>
          </p>
          <p>
            Frederik Bous is a researcher and developer specializing in artificial intelligence for audio and voice technologies. His work focuses on deep learning methods for speech and singing voice synthesis, transformation, and expressive control, contributing to the development of next-generation neural audio systems.
          </p>
          <p>
            His research explores advanced neural architectures for voice generation and manipulation, including neural vocoders and machine learning models capable of producing high-quality speech and singing voices across different languages, timbres, and expressive styles.
          </p>
          <p>
            In addition to his scientific research, he collaborates with artists and creative practitioners to integrate artificial intelligence into artistic production processes. Within Studio Cucurbits, he contributes as a technology collaborator in AI and creative computation, supporting hybrid artistic practices that combine contemporary music, digital media, and emerging technologies.
          </p>
        </div>
      </div>
    </div>

    <div class="image">
      <a href="https://frederik.bous.cc/" target="_blank" rel="noopener noreferrer">
        <img src="https://frederik.bous.cc/assets/bous_square.jpg" alt="Portrait of Frederik Bous">
      </a>
    </div>
  </section>

  <section class="cta-card">
    <div class="lang-block lang-block--ja">
      <h2>Inquiry</h2>
      <p>音楽制作、サウンドデザイン、受託制作、共同制作に関するご相談を歓迎しています。</p>
      <p>映画、展示、舞台、プロダクト、研究プロジェクトなどで音や音楽を必要としている方は、企画概要、スケジュール、媒体や規模感を添えてお気軽にご連絡ください。</p>
      <a class="email-cta" href="mailto:info@sachiekobayashi">info@sachiekobayashi</a>
    </div>

    <div class="lang-block lang-block--en">
      <h2>Inquiry</h2>
      <p>I welcome inquiries for commissions, collaborations, sound design projects, and selected commercial work.</p>
      <p>If you are developing a film, exhibition, performance, product, or research project and are looking for an original approach to music or sound, please feel free to get in touch with a short outline, timeline, and format.</p>
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
      for (var i = 0; i < buttons.length; i++) {
        var isActive = buttons[i].getAttribute('data-lang-button') === lang;
        if (isActive) {
          buttons[i].classList.add('is-active');
        } else {
          buttons[i].classList.remove('is-active');
        }
      }
    }

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function() {
        setLang(this.getAttribute('data-lang-button'));
      });
    }

    var savedLang = 'ja';
    try {
      savedLang = localStorage.getItem('cucurbits-lang') || 'ja';
    } catch (e) {}

    setLang(savedLang);
  })();
</script>
