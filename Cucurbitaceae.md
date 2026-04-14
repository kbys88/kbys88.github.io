---
layout: page
title: Studio Cucurbits.
permalink: /cucurbits/
---


<style>
  .cucurbits-page {
    --content-width: 1040px;
    --text-width: 560px;
    --page-width: 1040px;
    --content-width: 920px;
    --text-width: 620px;
    --border-color: rgba(0, 0, 0, 0.12);
    max-width: var(--content-width);
    --soft-bg: rgba(0, 0, 0, 0.028);
    max-width: var(--page-width);
    margin: 0 auto;
    padding: 1.5rem 1.25rem 4rem;
    padding: 1.5rem 1.25rem 4.5rem;
    color: inherit;
    font: inherit;
    line-height: 1.9;
    line-height: 1.85;
  }

  .lang-switch {
    font-size: 0.92rem;
    line-height: 1;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .lang-switch button:hover,
    border-color: rgba(0, 0, 0, 0.2);
  }

  .section {
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
    grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
    gap: 2.5rem;
    align-items: center;
    margin: 0 0 5rem;
    padding: 0 0 5rem;
    max-width: var(--content-width);
    margin: 0 auto 4rem;
    padding: 0 0 3.5rem;
    border-bottom: 1px solid var(--border-color);
  }

  .section.right {
    grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  .hero-text {
    max-width: var(--text-width);
  }

  .eyebrow {
    margin: 0 0 0.85rem;
    font-size: 0.92rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.72;
  }

  .intro {
    margin: 0 0 1.25rem;
    font-size: 1.5rem;
    line-height: 1.6;
  }

  .hero p,
  .section p,
  .cta-card p {
    margin: 0 0 1.1rem;
  }

  .hero-image img,
  .section-image img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 12px;
  }

  .hero-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin: 1.5rem 0 1.75rem;
  }

  .hero-meta span {
    display: inline-flex;
    align-items: center;
    min-height: 2rem;
    padding: 0.35rem 0.8rem;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    font-size: 0.92rem;
    line-height: 1.2;
  }

  .email-cta {
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

  .section.right .text {
  .email-cta:hover {
    background: rgba(0, 0, 0, 0.045);
  }

  .section {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
    gap: 2.5rem;
    align-items: start;
    max-width: var(--content-width);
    margin: 0 auto 4rem;
    padding: 0 0 3.5rem;
    border-bottom: 1px solid var(--border-color);
  }

  .section.reverse .section-text {
    order: 2;
  }

  .section.right .image {
  .section.reverse .section-image {
    order: 1;
  }

  .text {
  .section-text {
    max-width: var(--text-width);
  }

  .text h2,
  .text h3 {
  .section h2,
  .section h3,
  .cta-card h2 {
    margin: 0 0 1rem;
    line-height: 1.35;
  }

  .text p {
    margin: 0 0 1.15rem;
  .service-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .intro {
    font-size: 1.35rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  .service-card {
    padding: 1.1rem 1rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.012);
  }

  .image img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 12px;
  .service-card h3 {
    margin-bottom: 0.6rem;
    font-size: 1rem;
  }

  .service-card p {
    margin-bottom: 0.75rem;
    font-size: 0.96rem;
  }

  .service-card ul,
  .section ul {
    margin: 0;
    padding-left: 1.15rem;
  }

  .service-card li,
  .section li {
    margin-bottom: 0.45rem;
  }

  .trust-list,
  .client-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.35rem 1rem;
    margin-top: 1rem;
  }

  .cta-card {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: 14px;
    background: var(--soft-bg);
  }

  .cta-card .email-cta {
    margin-top: 0.5rem;
  }

  .en {
    display: none;
  }

  @media (max-width: 820px) {
  @media (max-width: 860px) {
    .cucurbits-page {
      padding: 1rem 1rem 3rem;
      padding: 1rem 1rem 3.5rem;
    }

    .lang-switch {
      margin-bottom: 2rem;
    }

    .section,
    .section.right {
    .hero,
    .section {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-bottom: 3.5rem;
      padding-bottom: 3.5rem;
      margin-bottom: 3rem;
      padding-bottom: 3rem;
    }

    .section.right .text,
    .section.right .image {
    .section.reverse .section-text,
    .section.reverse .section-image {
      order: initial;
    }

    .intro {
      font-size: 1.2rem;
      line-height: 1.7;
      font-size: 1.28rem;
      line-height: 1.55;
    }

    .service-grid,
    .trust-list,
    .client-list {
      grid-template-columns: 1fr;
    }
  }
</style>


  <script>
    function switchLang(lang) {
      localStorage.setItem('lang', lang);
      localStorage.setItem('cucurbits-lang', lang);
      document.querySelectorAll('.ja, .en').forEach(function(el) {
        el.style.display = 'none';
      });
    }

    document.addEventListener('DOMContentLoaded', function() {
      const savedLang = localStorage.getItem('lang') || 'ja';
      const savedLang = localStorage.getItem('cucurbits-lang') || 'ja';
      switchLang(savedLang);
    });
  </script>

  <div class="section left">
    <div class="text">
  <section class="hero">
    <div class="hero-text">
      <div class="ja">
        <p class="eyebrow">Studio Cucurbits.</p>
        <p class="intro">
          <strong>Studio Cucurbits. by Sachie Kobayashi</strong><br>
          作曲家 Sachie Kobayashi による音楽制作スタジオ
          作曲家・サウンドアーティスト Sachie Kobayashi による、国際的な音楽制作とサウンドデザインのためのスタジオ。
        </p>

        <p>
          音楽作品の作曲・制作を軸に、<br>
          映像、美術、テクノロジー、研究分野とのコラボレーション、<br>
          そしてAI時代の創作に関する実験と問題提起を行っています。
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

      <div class="en">
        <p class="eyebrow">Studio Cucurbits.</p>
        <p class="intro">
          <strong>Studio Cucurbits. by Sachie Kobayashi</strong><br>
          A music production studio by composer Sachie Kobayashi
          An international studio for composition, sound design, and interdisciplinary sonic work.
        </p>

        <p>
          Centered on the composition and production of musical works,<br>
          the studio engages in collaborations with film, visual art,
          technology, and research fields,<br>
          while conducting experiments and raising questions about
          creative practice in the age of AI.
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
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/logo1.png" alt="logo1">
    <div class="hero-image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/logo1.png" alt="Studio Cucurbits logo">
    </div>
  </div>
  </section>

  <div class="section right">
    <div class="text">
  <section class="section">
    <div class="section-text">
      <div class="ja">
        <h2>About</h2>

        <h2>What I Do</h2>
        <p>
          <strong>Studio Cucurbits. by Sachie Kobayashi</strong> は、<br>
          音楽制作のためのスタジオであり、思考と実験のためのプラットフォームです。
          現代音楽、電気音響、サウンドアート、映像音楽、そしてAIや計算的プロセスを含む創作実践を横断しながら、
          作品ごとに固有の音と言語を設計します。
        </p>

        <p>
          映画、舞台、映像作品、インスタレーションなど、<br>
          形式やジャンルにとらわれない音楽表現を軸に、<br>
          映像、美術、テクノロジー、研究分野とのコラボレーションを展開しています。
          芸術性と実用性のどちらか一方ではなく、コンセプト、空間、身体感覚、時間感覚、メディア特性に寄り添う形で、
          実制作へ接続するサウンドを提案します。
        </p>
      </div>

      <div class="en">
        <h2>About</h2>

        <h2>What I Do</h2>
        <p>
          <strong>Studio Cucurbits. by Sachie Kobayashi</strong> is a studio
          for music production and a platform for thought and experimentation.
          My practice moves across contemporary composition, electroacoustic music, sound art, music for image, and creative work involving AI and computational processes.
        </p>

        <p>
          Through music practices that move beyond fixed genres and formats—
          including film, theatre, moving image, and installation—
          the studio develops collaborations across visual art,
          technology, and research fields.
          I develop sound that is specific to each project, balancing artistic depth with practical production needs, and responding to concept, space, body, time, and medium.
        </p>
      </div>
    </div>

    <div class="image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits001.png" alt="cucurbits001">
    <div class="section-image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits001.png" alt="Studio image 1">
    </div>
  </div>
  </section>

  <div class="section left">
    <div class="text">
  <section class="section reverse">
    <div class="section-text">
      <div class="ja">
        <h2>Practice</h2>
        <h3>Composition / Music Production</h3>
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

        <p>
          映画、舞台、ダンス、映像作品、インスタレーション、パフォーマンスなど、<br>
          表現の背景やコンセプトに深く寄り添いながら、<br>
          作品ごとに固有の音楽を作曲します。
        </p>
          <div class="service-card">
            <h3>Installation / Performance / Immersive Work</h3>
            <p>展示、舞台、ダンス、インスタレーション、マルチメディア作品のための音楽・音響制作。</p>
            <ul>
              <li>空間音響、マルチチャンネル音源</li>
              <li>上演・展示に応じた再生設計</li>
            </ul>
          </div>

        <p>
          物語、空間、身体、時間の感覚に耳を澄まし、<br>
          「その作品にしか存在しえない音」を探ります。
        </p>
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

      <div class="en">
        <h2>Practice</h2>
        <h3>Composition / Music Production</h3>
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

        <p>
          Composing original music for film, theatre, dance,
          moving image, installation, and performance,
          while deeply engaging with each project’s concept and context.
        </p>
          <div class="service-card">
            <h3>Sound Design / Sonic Branding</h3>
            <p>Sound design and sonic identity for products, brands, digital content, and short-form media.</p>
            <ul>
              <li>sound logos, UI sounds, sonic systems</li>
              <li>refined sound design for media and campaigns</li>
            </ul>
          </div>

        <p>
          By listening carefully to narrative, space, body, and time,
          the studio seeks sounds that could exist only within that specific work.
        </p>
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
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits002.png" alt="cucurbits002">
    <div class="section-image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits002.png" alt="Studio image 2">
    </div>
  </div>
  </section>

  <div class="section right">
    <div class="text">
  <section class="section">
    <div class="section-text">
      <div class="ja">
        <h3>AI &amp; Technology</h3>

        <h2>Selected Contexts</h2>
        <p>
          AIやアルゴリズムを単なるツールとしてではなく、<br>
          創作の主体性、作者性、判断の所在を問い直す存在として扱います。
          ヨーロッパと日本を中心に活動し、現代音楽、映像、舞台、美術、テクノロジーを横断する文脈で作品を発表・制作しています。
        </p>

        <p>
          新しい技術に対する高揚と違和感の両方を大切にしながら、<br>
          いまこの時代における「作る」という行為を探究します。
        <div class="trust-list">
          <div>Klangforum Wien</div>
          <div>Ensemble Modern</div>
          <div>Ensemble Proton Bern</div>
          <div>IRCAM</div>
          <div>Le Fresnoy</div>
          <div>Orchestre de la HEM</div>
        </div>
        <p style="margin-top: 1.25rem;">
          商業・応用的な仕事として、Sonicware「LIVEN Ambient」のサウンドデザインや、
          サウンドロゴ制作などにも取り組んでいます。
        </p>
      </div>

      <div class="en">
        <h3>AI &amp; Technology</h3>

        <h2>Selected Contexts</h2>
        <p>
          AI and algorithms are approached not merely as tools,
          but as entities that challenge authorship,
          agency, and the locus of decision-making in creation.
          My work has developed internationally across Europe and Japan, in contexts spanning contemporary music, film, performance, visual art, and technology.
        </p>

        <p>
          Holding both excitement and discomfort toward new technologies,
          the studio explores what it means to create in this historical moment.
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

    <div class="image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits003.png" alt="cucurbits003">
    <div class="section-image">
      <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits003.png" alt="Studio image 3">
    </div>
  </div>
  </section>

  <div class="section left">
    <div class="text">
  <section class="section reverse">
    <div class="section-text">
      <div class="ja">
        <h2>Commission &amp; Collaboration</h2>

        <p>
          規模やジャンルを問わず、<br>
          強い関心や切実さを持ったプロジェクトからのご相談を歓迎します。
        </p>

        <p>
          音楽を「依頼する／される」関係を超えて、<br>
          共に考え、共にリスクを引き受ける制作を志向しています。
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

        <p>
          映像作品やYouTubeコンテンツ、プロダクト向けのサウンドデザイン、<br>
          サウンドロゴ制作、ブランド音設計なども承ります。
      <div class="en">
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
      <div class="ja">
        <h2>AI &amp; Technology</h2>
        <p>
          実績として、Sonicware「LIVEN Ambient」のサウンドデザイン、<br>
          株式会社アクシーのサウンドロゴ制作などがあります。<br>
          また、AI音楽アノテーション業務や、海外クライアントとの協働実績もあります。
          AIやアルゴリズムは単なるツールとしてではなく、創作、判断、作者性を問い直す契機として扱っています。
        </p>

        <p>
          音源制作やコラボレーション、納期等に関するお問い合わせは<br>
          <strong>info@sachiekobayashi</strong> までご連絡ください。
          この視点は、アーティスティックな作品制作だけでなく、新しい技術や研究文脈を含む受託案件や共同開発にも生きています。
        </p>
      </div>

      <div class="en">
        <h2>Commission &amp; Collaboration</h2>

        <h2>AI &amp; Technology</h2>
        <p>
          Inquiries are welcome regardless of scale or genre,
          especially from projects driven by strong intention and urgency.
          AI and computational processes are part of my practice not only as tools, but as ways of rethinking authorship, listening, and creative decision-making.
        </p>

        <p>
          Beyond the conventional relationship of commissioning and being commissioned,
          the studio seeks processes of making that share thought and risk together.
        </p>

        <p>
          Services include sound design for film, YouTube content,
          and products, as well as sonic branding and sound logo production.
          This perspective informs both artistic commissions and applied collaborations involving emerging technology, research, and sound-led experimentation.
        </p>
      </div>
    </div>
  </section>

        <p>
          Selected works include sound design for Sonicware’s
          “LIVEN Ambient” and the creation of a sound logo for AEXEA Co., Ltd.
          The studio also has experience in AI music annotation
          and collaborations with international clients.
        </p>
  <section class="cta-card">
    <div class="ja">
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

        <p>
          For inquiries regarding music production, collaboration,
          scheduling, or delivery timelines, please contact<br>
          <strong>info@sachiekobayashi</strong>.
        </p>
      </div>
    <div class="en">
      <h2>Inquiry</h2>
      <p>
        I welcome inquiries for commissions, collaborations, sound design projects, and selected commercial work.
      </p>
      <p>
        If you are developing a film, exhibition, performance, product, or research project and are looking for an original approach to music or sound, please feel free to get in touch with a short outline, timeline, and format.
      </p>
      <a class="email-cta" href="mailto:info@sachiekobayashi">info@sachiekobayashi</a>
    </div>
  </div>
  </section>
</div>
