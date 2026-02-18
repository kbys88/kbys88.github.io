---
layout: page
title: Studio Cucurbits.
permalink: /cucurbits/
---

<style>
.section {
  max-width: 1000px;
  margin: 6rem auto;
  display: flex;
  gap: 3rem;
  align-items: center;
  line-height: 1.9;
}

.section.left { flex-direction: row; }
.section.right { flex-direction: row-reverse; text-align: right; }

.section .text { flex: 1; }
.section .image { flex: 0 0 40%; }

.section .image img {
  width: 100%;
  height: auto;
  display: block;
}

/* 最初の段落 */
.intro {
  font-size: 1.6rem;
  line-height: 2.1;
}

/* 言語切替 */
.lang-switch {
  text-align: right;
  margin-top: 2rem;
}

.lang-switch button {
  background: none;
  border: 1px solid #000;
  padding: 6px 14px;
  margin-left: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.en { display: none; }

@media (max-width: 768px) {
  .section {
    flex-direction: column !important;
    text-align: left;
  }
  .section .image { width: 100%; }
  .intro { font-size: 1.3rem; }
}
</style>

<div class="lang-switch">
  <button onclick="switchLang('ja')">日本語</button>
  <button onclick="switchLang('en')">English</button>
</div>

<script>
function switchLang(lang) {
  localStorage.setItem('lang', lang);
  document.querySelectorAll('.ja, .en').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.' + lang).forEach(el => el.style.display = 'block');
}

document.addEventListener("DOMContentLoaded", function() {
  const savedLang = localStorage.getItem('lang') || 'ja';
  switchLang(savedLang);
});
</script>

<!-- =================== Section 1 =================== -->

<div class="section left">
  <div class="text">

    <!-- 日本語 -->
    <div class="ja">
      <p class="intro">
        <strong>Studio Cucurbits. by Sachie Kobayashi</strong><br>
        作曲家 Sachie Kobayashi による音楽制作スタジオ
      </p>

      <p>
        音楽作品の作曲・制作を軸に、<br>
        映像、美術、テクノロジー、研究分野とのコラボレーション、<br>
        そしてAI時代の創作に関する実験と問題提起を行っています。
      </p>
    </div>

    <!-- English -->
    <div class="en">
      <p class="intro">
        <strong>Studio Cucurbits. by Sachie Kobayashi</strong><br>
        A music production studio by composer Sachie Kobayashi
      </p>

      <p>
        Centered on the composition and production of musical works,<br>
        the studio engages in collaborations with film, visual art,
        technology, and research fields,<br>
        while conducting experiments and raising questions about
        creative practice in the age of AI.
      </p>
    </div>

  </div>

  <div class="image">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/logo1.png" alt="logo1">
  </div>
</div>

<!-- =================== About =================== -->

<div class="section right">
  <div class="text">

    <div class="ja">
      <h2>About</h2>

      <p>
        <strong>Studio Cucurbits. by Sachie Kobayashi</strong> は、<br>
        音楽制作のためのスタジオであり、思考と実験のためのプラットフォームです。
      </p>

      <p>
        映画、舞台、映像作品、インスタレーションなど、<br>
        形式やジャンルにとらわれない音楽表現を軸に、<br>
        映像、美術、テクノロジー、研究分野とのコラボレーションを展開しています。
      </p>
    </div>

    <div class="en">
      <h2>About</h2>

      <p>
        <strong>Studio Cucurbits. by Sachie Kobayashi</strong> is a studio
        for music production and a platform for thought and experimentation.
      </p>

      <p>
        Through music practices that move beyond fixed genres and formats—
        including film, theatre, moving image, and installation—
        the studio develops collaborations across visual art,
        technology, and research fields.
      </p>
    </div>

  </div>

  <div class="image">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits001.png" alt="cucurbits001">
  </div>
</div>

<!-- =================== Practice =================== -->

<div class="section left">
  <div class="text">

    <div class="ja">
      <h2>Practice</h2>
      <h3>Composition / Music Production</h3>

      <p>
        映画、舞台、ダンス、映像作品、インスタレーション、パフォーマンスなど、<br>
        表現の背景やコンセプトに深く寄り添いながら、<br>
        作品ごとに固有の音楽を作曲します。
      </p>

      <p>
        物語、空間、身体、時間の感覚に耳を澄まし、<br>
        「その作品にしか存在しえない音」を探ります。
      </p>
    </div>

    <div class="en">
      <h2>Practice</h2>
      <h3>Composition / Music Production</h3>

      <p>
        Composing original music for film, theatre, dance,
        moving image, installation, and performance,
        while deeply engaging with each project’s concept and context.
      </p>

      <p>
        By listening carefully to narrative, space, body, and time,
        the studio seeks sounds that could exist only within that specific work.
      </p>
    </div>

  </div>

  <div class="image">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits002.png" alt="cucurbits002">
  </div>
</div>

<!-- =================== AI =================== -->

<div class="section right">
  <div class="text">

    <div class="ja">
      <h3>AI & Technology</h3>

      <p>
        AIやアルゴリズムを単なるツールとしてではなく、<br>
        創作の主体性、作者性、判断の所在を問い直す存在として扱います。
      </p>

      <p>
        新しい技術に対する高揚と違和感の両方を大切にしながら、<br>
        いまこの時代における「作る」という行為を探究します。
      </p>
    </div>

    <div class="en">
      <h3>AI & Technology</h3>

      <p>
        AI and algorithms are approached not merely as tools,
        but as entities that challenge authorship,
        agency, and the locus of decision-making in creation.
      </p>

      <p>
        Holding both excitement and discomfort toward new technologies,
        the studio explores what it means to create in this historical moment.
      </p>
    </div>

  </div>

  <div class="image">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/cucurbits003.png" alt="cucurbits003">
  </div>
</div>

<!-- =================== Commission =================== -->


<div class="section left">
  <div class="text">

    <div class="ja">
      <h2>Commission & Collaboration</h2>

      <p>
        規模やジャンルを問わず、<br>
        強い関心や切実さを持ったプロジェクトからのご相談を歓迎します。
      </p>

      <p>
        音楽を「依頼する／される」関係を超えて、<br>
        共に考え、共にリスクを引き受ける制作を志向しています。
      </p>

      <p>
        映像作品やYouTubeコンテンツ、プロダクト向けのサウンドデザイン、<br>
        サウンドロゴ制作、ブランド音設計なども承ります。
      </p>

      <p>
        実績として、Sonicware「LIVEN Ambient」のサウンドデザイン、<br>
        株式会社アクシーのサウンドロゴ制作などがあります。<br>
        また、AI音楽アノテーション業務や、海外クライアントとの協働実績もあります。
      </p>
    </div>

    <div class="en">
      <h2>Commission & Collaboration</h2>

      <p>
        Inquiries are welcome regardless of scale or genre,
        especially from projects driven by strong intention and urgency.
      </p>

      <p>
        Beyond the conventional relationship of commissioning and being commissioned,
        the studio seeks processes of making that share thought and risk together.
      </p>

      <p>
        Services include sound design for film, YouTube content,
        and products, as well as sonic branding and sound logo production.
      </p>

      <p>
        Selected works include sound design for Sonicware’s
        “LIVEN Ambient” and the creation of a sound logo for AEXEA Co., Ltd.
        The studio also has experience in AI music annotation
        and collaborations with international clients.
      </p>
    </div>

  </div>
</div>
