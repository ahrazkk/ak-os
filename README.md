# AK-OS — Ahraz Kibria's portfolio

A mission-control style portfolio for **Ahraz Kibria**, software and AI engineer in Toronto.

- A liquid-metal intro and magnetic name (WebGL metaballs + text field).
- Every project is a live instrument:
  - a point-cloud Toronto with streaming transit;
  - a five-view drug-interaction platform;
  - an assistive perception view with 3D audio;
  - an agent trace.
- An experience timeline with flowing ink.
- A 3D evidence graph of skills, with job-description matching.

## Structure

```
site/            The website: static HTML, CSS and vanilla JS (no build step yet)
  index.html
  css/app.css
  js/core.js     utilities, design-lab settings, frame loop
  js/data.js     ALL content: projects, experience, skills, résumés
  js/liquid.js   liquid-metal engine, hero, intro
  js/viz.js      project visualizations
  js/ui.js       project pages, experience, skills graph, job match, palette, design lab
  js/main.js     start-up
docs/projects/   design docs for concept projects (4Sight v2, Augmented Analyst 2.0)
```

## Run locally

The site loads several script files, so it needs a local web server rather than opening the file directly:

```bash
python -m http.server 8765 --directory site
```

Then open http://localhost:8765.

## Editing content

Text, projects, experience entries, skills and résumé versions all live in `site/js/data.js`.

## Status

Pre-launch: final content and deployment are in progress.
