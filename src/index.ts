import { resolveOptions } from './options';
import type { StarlightProgressOptions } from './types';

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

  return {
    name: 'starlight-progress',
    hooks: {
      'config:setup'({ config, updateConfig }: ConfigSetupParams) {
        updateConfig({
          components: {
            ...(config.components as Record<string, string>),
            Head: resolved.readingProgress
              ? './src/components/ReadingProgress.astro'
              : (config.components as Record<string, string>)?.Head,
            TOC: resolved.collapsibleTOC?.enabled
              ? './src/components/CollapsibleTOC.astro'
              : (config.components as Record<string, string>)?.TOC,
          },
        });
      },
    },
  };
}

export type { StarlightProgressOptions, ReadingProgressConfig, CollapsibleTOCConfig } from './types';
