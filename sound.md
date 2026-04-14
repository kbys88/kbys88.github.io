---
layout: page
title: Sound
permalink: /sound/
---

<style>
  .sound-page {
    max-width: 860px;
    margin: 0 auto;
    padding: 1.5rem 1.25rem 3rem;
    color: inherit;
    font: inherit;
  }

  .sound-container {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    align-items: center;
  }

  .sound-item,
  .youtube-container {
    width: 100%;
    max-width: 760px;
  }

  .sound-page img,
  .sound-page iframe {
    display: block;
    width: 100%;
    border: 0;
    border-radius: 12px;
  }

  .soundcloud-frame {
    height: 420px;
  }

  .youtube-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .youtube-frame {
    aspect-ratio: 16 / 9;
    min-height: 240px;
  }

  @media (max-width: 768px) {
    .sound-page {
      padding: 1rem 1rem 2.5rem;
    }

    .sound-container {
      gap: 2rem;
    }

    .soundcloud-frame {
      height: 360px;
    }

    .youtube-container {
      gap: 1.5rem;
    }
  }
</style>

<div class="sound-page">
  <div class="sound-container">
    <img
      src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/work-img.png"
      alt="About"
      class="sound-item">

    <iframe
      class="sound-item soundcloud-frame"
      scrolling="yes"
      frameborder="no"
      allow="autoplay"
      src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/sachiekbys&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
    </iframe>

    <div class="youtube-container">
      <iframe
        class="youtube-frame"
        src="https://www.youtube.com/embed/atHQ7RAiGXg?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&loop=1&playlist=atHQ7RAiGXg"
        title="YouTube video player 1"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>

      <iframe
        class="youtube-frame"
        src="https://www.youtube.com/embed/fjrhLMT3Ctk"
        title="YouTube video player 2"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>

      <iframe
        class="youtube-frame"
        src="https://www.youtube.com/embed/vXPt26iCe70"
        title="YouTube video player 3"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  </div>
</div>
