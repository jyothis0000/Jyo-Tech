# jyo tech

The site for StackPicker, WebHarvest and Jo. React + Vite + Tailwind, deployed on Vercel.

```bash
npm install
npm run dev
npm run build
```

## Where things live

- `src/products.tsx`: every product fact the pages show (specs, features, steps, store links). Change copy here, not in the pages.
- `src/constants.ts`: site name, site URL and store links. Change `SITE_NAME`/`SITE_URL` (and the name in `index.html`) when the site moves to the lab subdomain.
- `src/figures/<product>/`: one interactive isometric figure per product, drawn with the [Anatomy](https://skills.wheresryan.sh/anatomy) kit in `src/components/iso/` (MIT, see its `LICENSE`).

## Working on a figure

With `npm run dev` running, open one figure on its own:

```
http://localhost:5173/src/figures/preview.html?fig=stackpicker&w=620
```

`w` is the container width in px (the home page column is about 620, product pages about 1000). The preview page is dev-only and not part of the build.
