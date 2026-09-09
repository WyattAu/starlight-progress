# @wyatt/starlight-progress

Starlight plugin providing a reading progress bar and collapsible TOC sidebar.

Overrides Starlight's `Head` and `TOC` components to add:

- **Reading progress bar** — a thin accent-colored bar fixed to the top of the page that fills as the reader scrolls
- **Collapsible TOC** — the "On this page" sidebar becomes collapsible, with the collapsed state persisted in `localStorage`

## Installation

```bash
npm install @wyatt/starlight-progress
```

## Usage

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { starlightProgress } from '@wyatt/starlight-progress';

export default defineConfig({
  integrations: [
    starlight({
      plugins: [starlightProgress()],
    }),
  ],
});
```

Both features are enabled by default; pass options to tune or disable either.

## Configuration options

```ts
starlightProgress({
  readingProgress: {
    height: 3,                          // bar thickness in px
    color: 'var(--sl-color-accent)',    // fill color
    zIndex: 9999,
    transitionDuration: 100,            // ms
    hideAtStart: true,                  // hide until scrolled
  },
  collapsibleTOC: {
    enabled: true,
    storageKey: 'starlight-toc-visible',// localStorage key for collapsed state
    defaultCollapsed: false,
  },
});
```

| Option | Type | Default | Description |
|---|---|---|---|
| `readingProgress.height` | `number` | `3` | Progress bar height in pixels |
| `readingProgress.color` | `string` | `var(--sl-color-accent)` | Bar fill color |
| `readingProgress.zIndex` | `number` | `9999` | Bar z-index |
| `readingProgress.transitionDuration` | `number` | `100` | Width transition in ms |
| `readingProgress.hideAtStart` | `boolean` | `true` | Hide bar until the user scrolls |
| `collapsibleTOC.enabled` | `boolean` | `true` | Enable the collapsible TOC override |
| `collapsibleTOC.storageKey` | `string` | `starlight-toc-visible` | `localStorage` key persisting the state |
| `collapsibleTOC.defaultCollapsed` | `boolean` | `false` | Initial collapsed state |

Set `collapsibleTOC.enabled: false` to keep the standard Starlight TOC; the progress bar itself has no disable flag (remove the plugin or customize via `readingProgress` options).

## License

MIT
