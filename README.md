# TMPS

Thermal Management and Process Safety Research Expertise Group

The Thermal Management and Process Safety (TMPS) group aims to improve global safety and sustainability by deepening our understanding of catastrophic events and pioneering innovations in thermal management. The REG combines a unique two-headed expertise, specializing in thermal management in aeronautics, as well as process safety, mainly dispersion and explosion research. The REG also specializes in the adaptation of advanced experimental techniques such as liquid crystals, Mie scattering, droplet sizing, and Particle Image Velocimetry to achieve detailed and high-resolution experimental characterization. The group is also active in numerical simulations of single and multiphase heat transfer, in strong collaboration with the Liquid Metal and Industrial Flow REG.

## About this site

This site is built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com), based on the [lab-website-template](https://github.com/bchcohenlab/lab-website-template). Content (people, publications, research areas) lives under `src/content/` and `src/data/site.ts`.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build to ./dist
```

Deployment is handled by `.github/workflows/deploy.yml` on every push to `main` (GitHub Pages must be set to **Source: GitHub Actions** in the repo settings). See `SETUP.md` for details.
