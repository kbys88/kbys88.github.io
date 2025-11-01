---
layout: page
title: Sound
permalink: /sound/
---

<style>
  .sound-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    gap: 3rem; /* 要素間の余白を少し広げる */
    padding: 3rem 2rem;
  }

  .sound-item {
    width: 70%;
    max-width: 800px; /* 少し広く */
    border-radius: 8px;
  }

  iframe, img {
    width: 100%;
    border-radius: 12px;
  }

  /* 高さを調整 */
  .soundcloud-frame {
    height: 500px; /* 少し高めに */
  }

  .youtube-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rem; /* 各動画間も少し広め */
    width: 70%;
    max-width: 800px;
  }

  .youtube-frame {
    height: 420px; /* 高さを拡大 */
  }

  @media (max-width: 768px) {
    .sound-item, .youtube-container {
      width: 90%;
    }
    .soundcloud-frame {
      height: 380px;
    }
    .youtube-frame {
      height: 300px;
    }
  }
</style>

<div class="sound-container">

  <img 
    src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/work-img.png" 
    alt="About" 
    class="sound-item"/>

  <!-- SoundCloud Player -->
  <iframe 
    class="sound-item soundcloud-frame"
    scrolling="yes"
    frameborder="no"
    allow="autoplay"
    src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/sachiekbys&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
  </iframe>

  <!-- YouTube videos -->
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
