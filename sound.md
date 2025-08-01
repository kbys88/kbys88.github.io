---
layout: page
title: Sound
permalink: /sound/
---
<img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/work-img.png" alt="About" width="70%">

<!-- Native audio player (replace src with your direct audio file URL) -->
<audio controls style="width: 100%; max-width: 640px; margin-top: 2rem;">
  <source src="https://example.com/path-to-your-audio-file.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

<!-- Container for multiple videos (replace src with direct video file URLs) -->
<div style="display: flex; flex-direction: column; align-items: center; gap: 3rem; margin-top: 2rem;">
  <video width="640" height="360" controls style="border-radius:8px;" muted loop>
    <source src="https://example.com/path-to-your-video1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>

  <video width="640" height="360" controls style="border-radius:8px;">
    <source src="https://example.com/path-to-your-video2.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  
  <!-- Add more videos similarly if needed -->
</div>
