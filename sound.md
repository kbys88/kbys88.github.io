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
    justify-content: space-evenly; /* 均等に配置 */
    gap: 2rem;                     /* 要素間の間隔 */
    padding: 2rem;
  }

  .sound-item {
    width: 70%;
    max-width: 700px;
    border-radius: 8px;
  }

  iframe, img {
    width: 100%;
    border-radius: 8px;
  }

  .youtube-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    width: 70%;
    max-width: 700px;
  }

  @media (max-width: 768px) {
    .sound-item, .youtube-container {
      width: 90%;
    }
  }
</style>

<div class="sound-container">

  <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/work-img.png" 
       alt="About" class="sound-item"/>

  <!-- SoundCloud Player -->
  <iframe 
    class="sound-item"
    height="450"
    scrolling="yes"
    frameborder="no"
    allow="autoplay"
    src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/sachiekbys&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
  </iframe>

  <!-- YouTube videos -->
  <div class="youtube-container">
  
    <iframe 
      height="360"
      src="https://www.youtube.com/embed/atHQ7RAiGXg?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&loop=1&playlist=atHQ7RAiGXg" 
      title="YouTube video player 1" 
      frameborder="0" 
      allow="autoplay; encrypted-media" 
      allowfullscreen>
    </iframe>
  
    <iframe 
      height="360"
      src="https://www.youtube.com/embed/fjrhLMT3Ctk" 
      title="YouTube video player 2" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>

    <iframe 
      height="360"
      src="https://www.youtube.com/embed/vXPt26iCe70" 
      title="YouTube video player 3" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  
  </div>

</div>

