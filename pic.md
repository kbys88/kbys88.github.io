---
layout: main
title: Pic
permalink: /pic/
---

<style>
  .pic-page {
    max-width: 1180px;
    margin: 0 auto;
    padding: 5.5rem 1.25rem 3rem;
    color: inherit;
    font: inherit;
  }

  .pic-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .pic-grid img {
    display: block;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 10px;
    transition: opacity 0.2s ease;
  }

  .pic-grid img:hover {
    opacity: 0.94;
  }

  @media (max-width: 980px) {
    .pic-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 680px) {
    .pic-page {
      padding: 4.5rem 1rem 2.5rem;
    }

    .pic-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
  }
</style>

<div class="pic-page">
  <div class="pic-grid">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web1.jpg" alt="Gallery image 1">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web2.jpg" alt="Gallery image 2">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web3.jpg" alt="Gallery image 3">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web4.jpg" alt="Gallery image 4">

    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web5.jpg" alt="Gallery image 5">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web6.jpg" alt="Gallery image 6">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web7.jpg" alt="Gallery image 7">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web8.jpg" alt="Gallery image 8">

    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web9.jpg" alt="Gallery image 9">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web10.jpg" alt="Gallery image 10">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web11.jpg" alt="Gallery image 11">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web12.jpg" alt="Gallery image 12">

    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web13.jpg" alt="Gallery image 13">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web14.jpg" alt="Gallery image 14">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web15.jpg" alt="Gallery image 15">
    <img src="https://raw.githubusercontent.com/kbys88/kbys88.github.io/main/images/web16.jpg" alt="Gallery image 16">
  </div>
</div>
