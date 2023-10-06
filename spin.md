
---
layout: page
permalink: /ovni
overflow-wrap: break-word;
---


<style>
  table {
    border: none;
    background-color: transparent;
  }

  td {
    border: none;
    background-color: transparent;
    text-align: center;
  }

  img {
    max-width: 100%; /* Ensure images don't exceed the container width */
    height: auto; /* Maintain aspect ratio */
  }

  /* Media query for smartphones */
  @media (max-width: 768px) {
    table {
      width: 100%; /* Make the table full-width on small screens */
    }

    td {
      display: block; /* Stack table cells vertically on small screens */
      margin-bottom: 20px; /* Add some space between cells */
    }

    img {
      width: 100%; /* Make images full-width within table cells */
    }
  }
  .video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio for video */
    height: 0;
    overflow: hidden;
  }

  .video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>

{: align="center"}
<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/dEyQLsmWPXc?si=doEePH0YXlVukU36" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
