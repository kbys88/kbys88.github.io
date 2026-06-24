# Archive / Cleanup Manifest

This file records cleanup candidates without deleting or moving media files.

Reason:
- Images, videos, and PDFs may have been shared by direct GitHub URLs.
- Moving or deleting them can break current-path URLs on the latest branch.
- Git history can preserve old files, but the public URL may become harder to find later.

Recommended policy:
- Do not delete media files until their public usage is confirmed.
- If media is moved later, record both the original path and the archive path here.
- Prefer archiving source pages first, and media only after a second review.

## Currently Used Media

- `images/Sachie_Kobayashi_Portofolio_EN_2025_COMP.pdf` - `Bio.md`
- `images/about.jpeg` - `Bio.md`
- `images/cable_play.png` - `sound.md`
- `images/cucurbits001.png` - `cucurbits.md`
- `images/cucurbits002.png` - `cucurbits.md`
- `images/cucurbits003.png` - `cucurbits.md`
- `images/favi.ico` - `_config.yml`
- `images/hero_g.png` - `index.html`, `cucurbits.md`
- `images/logo1.png` - `cucurbits.md`
- `images/sachie_cable.mp4` - `index.html`
- `images/sachie_prof2.png` - `Bio.md`
- `images/web1.jpg` through `images/web16.jpg` - `pic.md`

## Media Not Referenced By Site Source

These files are not referenced by current Markdown, HTML, Sass, YAML, CSS, JS, XML, or TXT source files, excluding `_site`.
They may still be used by external direct links.

- `images/DSC07588.JPEG`
- `images/IMG_2846.JPEG`
- `images/IMG_6357.JPEG`
- `images/SACHIE_PUB.mp4`
- `images/SACHIE_inst.mp4`
- `images/comingsoon.png`
- `images/cucurbit.gif`
- `images/cucurbit.png`
- `images/d1.jpg`
- `images/givemefive.png`
- `images/header.jpg`
- `images/header1.jpg`
- `images/header2.jpg`
- `images/lesson.png`
- `images/lesson01.jpg`
- `images/lesson02.jpg`
- `images/lesson03.jpg`
- `images/lesson04.jpg`
- `images/lesson05.jpg`
- `images/lesson06.jpg`
- `images/lesson07.jpg`
- `images/lesson1.png`
- `images/lesson_wide.mp4`
- `images/logo.png`
- `images/logo_2026.mp4`
- `images/magnific_artistic-minimal-surreali_2915352831.png`
- `images/newsachie.png`
- `images/pages.png`
- `images/photo_lesson.jpg`
- `images/rename.png`
- `images/reverie.jpg`
- `images/sachiebio.png`
- `images/sachieconsole.png`
- `images/sachiehome.png`
- `images/sachiehome1.png`
- `images/small_GIFFxCONTRECHAMPS_TEASER-REVERIE_16-9.mp4`
- `images/trans-web.mp4`
- `images/trans-web2.mp4`
- `images/vjtest.mp4`
- `images/web3.mp4`
- `images/web4.mp4`
- `images/work-img.png`

## Archived Source Pages

These pages were moved out of the public Jekyll source root and into `_archive/`.
Media files referenced by these pages were not moved or deleted.

- `cucurbits.md` -> `_archive/cucurbits.md`
  - Reason: Studio navigation was removed because Studio moved to another domain.
  - Previous public path: `/cucurbits/`
- `lesson_fr_redesigned.html` -> `_archive/lesson_fr_redesigned.html`
  - Reason: not linked from current navigation.
  - Previous public path: `/lesson_fr/`
- `policies.md` -> `_archive/policies.md`
  - Reason: not linked from current navigation.
  - Previous public path: `/policies/`
- `term.md` -> `_archive/term.md`
  - Reason: not linked from current navigation.
  - Previous public path: none declared in front matter.

## Notes

- `_site/` is generated output and should not be edited manually.
- `_posts/2022-3-31-être.md` is currently untracked due to filename normalization behavior on macOS. It has not been archived or committed.
