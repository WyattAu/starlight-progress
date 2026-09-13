import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import { starlightProgress } from '@wyatt/starlight-progress';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Scratch Site',
      sidebar: [{ label: 'Guide', autogenerate: { directory: 'guide' } }],
      plugins: [starlightProgress()],
    }),
    mdx(),
  ],
});
