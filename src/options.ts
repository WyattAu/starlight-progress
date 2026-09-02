import type { StarlightProgressOptions } from './types';

const DEFAULTS = {
  readingProgress: {
    height: 3,
    color: 'var(--sl-color-accent)',
    zIndex: 9999,
    transitionDuration: 100,
    hideAtStart: true,
  },
  collapsibleTOC: {
    enabled: true,
    storageKey: 'starlight-toc-visible',
    defaultCollapsed: false,
  },
} as const;

/**
 * Normalizes user options by merging with defaults.
 * Removes undefined values so overrides don't clobber defaults.
 */
export function resolveOptions(
  options?: StarlightProgressOptions
): Required<StarlightProgressOptions> {
  const rp = options?.readingProgress;
  const ct = options?.collapsibleTOC;

  return {
    readingProgress: {
      height: rp?.height ?? DEFAULTS.readingProgress.height,
      color: rp?.color ?? DEFAULTS.readingProgress.color,
      zIndex: rp?.zIndex ?? DEFAULTS.readingProgress.zIndex,
      transitionDuration:
        rp?.transitionDuration ?? DEFAULTS.readingProgress.transitionDuration,
      hideAtStart: rp?.hideAtStart ?? DEFAULTS.readingProgress.hideAtStart,
    },
    collapsibleTOC: {
      enabled: ct?.enabled ?? DEFAULTS.collapsibleTOC.enabled,
      storageKey: ct?.storageKey ?? DEFAULTS.collapsibleTOC.storageKey,
      defaultCollapsed:
        ct?.defaultCollapsed ?? DEFAULTS.collapsibleTOC.defaultCollapsed,
    },
  };
}
