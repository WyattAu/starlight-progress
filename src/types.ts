/** Configuration for the reading progress bar. */
export interface ReadingProgressConfig {
  /** Bar height in pixels. @default 3 */
  height?: number;
  /** CSS color or CSS custom property. @default 'var(--sl-color-accent)' */
  color?: string;
  /** Z-index for the progress bar. @default 9999 */
  zIndex?: number;
  /** Transition duration in milliseconds. @default 100 */
  transitionDuration?: number;
  /** Hide the bar when progress is less than 1%. @default true */
  hideAtStart?: boolean;
}

/** Configuration for the collapsible TOC sidebar. */
export interface CollapsibleTOCConfig {
  /** Enable the collapsible TOC feature. @default true */
  enabled?: boolean;
  /** localStorage key for persisting collapsed state. @default 'starlight-toc-visible' */
  storageKey?: string;
  /** Whether the TOC starts collapsed. @default false */
  defaultCollapsed?: boolean;
}

/** Options for the starlight-progress plugin. */
export interface StarlightProgressOptions {
  /** Reading progress bar configuration. */
  readingProgress?: ReadingProgressConfig;
  /** Collapsible TOC configuration. */
  collapsibleTOC?: CollapsibleTOCConfig;
}


