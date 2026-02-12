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

/* 言語切替ボタン */
.lang-switch {
  text-align: right;
  margin-top: 2rem;
}

.lang-switch button {
  background: none;
  border: 1px solid #000;
  padding: 6px 12px;
  margin-left: 8px;
  cursor: pointer;
}

/* 英語は初期非表示 */
.en { display: none; }

/* スマホ */
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
  document.querySelectorAll('.ja').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.en').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.' + lang).forEach(el => el.style.display = 'block');
}
</script>

<!-- ===== Section 1 ===== -->

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
        Centered on composition and music production,<br>
        the studio engages in collaborations across film, visual art,
        technology, and research fields,<br>
        while exploring creative practice in the age of AI.
      </p>
    </div>

  </div>

  <div class="image">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/logo1.png" alt="logo1">
  </div>
</div>

<!-- ===== About ===== -->

<div class="section right">
  <div class="text">

    <div class="ja">
      <h2>About</h2>
      <p>
        音楽制作のためのスタジオであり、思考と実験のためのプラットフォームです。
      </p>
      <p>
        形式やジャンルにとらわれない音楽表現を軸に、
        分野横断的なコラボレーションを展開しています。
      </p>
    </div>

    <div class="en">
      <h2>About</h2>
      <p>
        A studio for music production and a platform for thought and experimentation.
      </p>
      <p>
        The practice unfolds through cross-disciplinary collaborations,
        embracing forms beyond conventional genres.
      </p>
    </div>

  </div>
</div>

<!-- ===== Practice ===== -->

<div class="section left">
  <div class="text">

    <div class="ja">
      <h2>Practice</h2>
      <h3>Composition / Music Production</h3>
      <p>
        映画、舞台、ダンス、インスタレーションなど、
        作品ごとに固有の音楽を作曲します。
      </p>
    </div>

    <div class="en">
      <h2>Practice</h2>
      <h3>Composition / Music Production</h3>
      <p>
        Composing original music for film, theatre, dance,
        installations, and performances,
        creating sound unique to each work.
      </p>
    </div>

  </div>
</div>

<!-- ===== Commission ===== -->

<div class="section right">
  <div class="text">

    <div class="ja">
      <h2>Commission & Collaboration</h2>
      <p>
        強い関心や切実さを持ったプロジェクトからのご相談を歓迎します。
      </p>
    </div>

    <div class="en">
      <h2>Commission & Collaboration</h2>
      <p>
        Inquiries are welcome from projects driven by strong intention and necessity.
      </p>
    </div>

  </div>
</div>
