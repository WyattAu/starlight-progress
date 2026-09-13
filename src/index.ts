import { fileURLToPath } from 'node:url';
import { resolveOptions } from './options';
import type { StarlightProgressOptions } from './types';
import type { AstroIntegration } from 'astro';

function componentUrl(relative: string): string {
  const url = new URL(relative, import.meta.url);
  // Under test runners import.meta.url may not be a file URL; keep the
  // absolute URL form, which Vite resolves the same way.
  return url.protocol === 'file:' ? fileURLToPath(url) : url.href;
}

const readingProgressComponent = componentUrl('./components/ReadingProgress.astro');
const collapsibleTocComponent = componentUrl('./components/CollapsibleTOC.astro');

const TOC_OPTIONS_MODULE_ID = 'virtual:starlight-progress/toc-options';
const TOC_OPTIONS_RESOLVED_ID = '\0' + TOC_OPTIONS_MODULE_ID;

/**
 * Exposes the resolved collapsible-TOC options to the component override via a
 * virtual module, because Starlight renders component overrides without props.
 */
function tocOptionsIntegration(tocOptions: {
  storageKey: string;
  defaultCollapsed: boolean;
}): AstroIntegration {
  return {
    name: 'starlight-progress-toc-options',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'starlight-progress-toc-options',
                resolveId(id: string) {
                  if (id === TOC_OPTIONS_MODULE_ID) return TOC_OPTIONS_RESOLVED_ID;
                },
                load(id: string) {
                  if (id === TOC_OPTIONS_RESOLVED_ID) {
                    return `export default ${JSON.stringify(tocOptions)};`;
                  }
                },
              },
            ],
          },
        });
      },
    },
  };
}

/**
 * Parameters passed to the Starlight `config:setup` hook.
 */
interface ConfigSetupParams {
  config: Record<string, unknown>;
  addTranslations: (translations: Record<string, Record<string, string>>) => void;
  updateConfig: (newConfig: Record<string, unknown>) => void;
  addIntegration: (integration: unknown) => void;
  addRouteMiddleware: (middleware: { entrypoint: string }) => void;
}

/**
 * Creates a Starlight plugin that adds a reading progress bar and collapsible TOC.
 *
 * @param options - Plugin configuration options.
 * @returns A Starlight plugin object.
 */
export function starlightProgress(
  options?: StarlightProgressOptions
) {
  const resolved = resolveOptions(options);
  const tocOptions = tocOptionsIntegration(resolved.collapsibleTOC);

  return {
    name: 'starlight-progress',
    hooks: {
      'config:setup'({
        config,
        updateConfig,
        addIntegration,
      }: ConfigSetupParams) {
        const existing = (config.components as Record<string, string>) ?? {};

        updateConfig({
          components: {
            ...existing,
            Head: resolved.readingProgress
              ? readingProgressComponent
              : existing.Head,
            TableOfContents: resolved.collapsibleTOC?.enabled
              ? collapsibleTocComponent
              : existing.TableOfContents,
          },
        });

        if (resolved.collapsibleTOC.enabled) {
          addIntegration?.(tocOptions);
        }
      },
    },
  };
}

export type { StarlightProgressOptions, ReadingProgressConfig, CollapsibleTOCConfig } from './types';
