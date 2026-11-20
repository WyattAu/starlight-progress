# PATTERN_ADOPTION

Starlight plugin providing a reading progress bar and a collapsible
TOC sidebar.

| Pattern | Status | Evidence |
|---|---|---|
| T13 | n/a | pure option merge plus a browser widget; no canon-pattern domain (src/options.ts:31) |

The scroll listener is re-registered on astro page swaps and removed
on unmount (src/components/ReadingProgress.astro:82), which is basic
hygiene, not an AbortScope (P23) adoption.
