import { describe, it, expect, vi, beforeEach } from 'vitest';
import { starlightProgress } from '../src/index';
import { resolveOptions } from '../src/options';
import type { StarlightProgressOptions } from '../src/types';

describe('starlightProgress plugin', () => {
  it('returns a valid Starlight plugin object', () => {
    const plugin = starlightProgress();
    expect(plugin).toHaveProperty('name', 'starlight-progress');
    expect(plugin).toHaveProperty('hooks');
    expect(plugin.hooks).toHaveProperty('config:setup');
    expect(typeof plugin.hooks['config:setup']).toBe('function');
  });

  it('has the correct plugin name', () => {
    const plugin = starlightProgress();
    expect(plugin.name).toBe('starlight-progress');
  });

  describe('config:setup hook', () => {
    it('calls updateConfig with component overrides', () => {
      const plugin = starlightProgress();
      const updateConfig = vi.fn();
      const config = { components: {} };

      plugin.hooks['config:setup']({
        config: config as any,
        addTranslations: vi.fn(),
        updateConfig,
      } as any);

      expect(updateConfig).toHaveBeenCalled();
      const call = updateConfig.mock.calls[0][0];
      expect(call).toHaveProperty('components');
      expect(call.components).toHaveProperty('Head');
      expect(call.components).toHaveProperty('TableOfContents');
    });

    it('preserves existing component overrides', () => {
      const plugin = starlightProgress();
      const updateConfig = vi.fn();
      const config = {
        components: {
          Head: './existing/Head.astro',
        },
      };

      plugin.hooks['config:setup']({
        config: config as any,
        addTranslations: vi.fn(),
        updateConfig,
      } as any);

      expect(updateConfig).toHaveBeenCalled();
    });
  });
});

describe('resolveOptions', () => {
  it('returns defaults when no options provided', () => {
    const opts = resolveOptions();
    expect(opts.readingProgress.height).toBe(3);
    expect(opts.readingProgress.color).toBe('var(--sl-color-accent)');
    expect(opts.readingProgress.zIndex).toBe(9999);
    expect(opts.readingProgress.transitionDuration).toBe(100);
    expect(opts.readingProgress.hideAtStart).toBe(true);
    expect(opts.collapsibleTOC.enabled).toBe(true);
    expect(opts.collapsibleTOC.storageKey).toBe('starlight-toc-visible');
    expect(opts.collapsibleTOC.defaultCollapsed).toBe(false);
  });

  it('merges partial reading progress options', () => {
    const opts = resolveOptions({
      readingProgress: { height: 5, color: '#ff0000' },
    });
    expect(opts.readingProgress.height).toBe(5);
    expect(opts.readingProgress.color).toBe('#ff0000');
    expect(opts.readingProgress.zIndex).toBe(9999);
  });

  it('merges partial collapsible TOC options', () => {
    const opts = resolveOptions({
      collapsibleTOC: { storageKey: 'custom-key', defaultCollapsed: true },
    });
    expect(opts.collapsibleTOC.storageKey).toBe('custom-key');
    expect(opts.collapsibleTOC.defaultCollapsed).toBe(true);
    expect(opts.collapsibleTOC.enabled).toBe(true);
  });

  it('handles all options overridden', () => {
    const full: StarlightProgressOptions = {
      readingProgress: {
        height: 10,
        color: 'linear-gradient(to right, red, blue)',
        zIndex: 100,
        transitionDuration: 200,
        hideAtStart: false,
      },
      collapsibleTOC: {
        enabled: false,
        storageKey: 'my-toc',
        defaultCollapsed: true,
      },
    };
    const opts = resolveOptions(full);
    expect(opts.readingProgress.height).toBe(10);
    expect(opts.readingProgress.color).toBe('linear-gradient(to right, red, blue)');
    expect(opts.readingProgress.zIndex).toBe(100);
    expect(opts.readingProgress.transitionDuration).toBe(200);
    expect(opts.readingProgress.hideAtStart).toBe(false);
    expect(opts.collapsibleTOC.enabled).toBe(false);
    expect(opts.collapsibleTOC.storageKey).toBe('my-toc');
    expect(opts.collapsibleTOC.defaultCollapsed).toBe(true);
  });
});
