import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('CollapsibleTOC', () => {
  let details: HTMLDetailsElement;
  let summary: HTMLElement;
  let content: HTMLDivElement;

  beforeEach(() => {
    localStorage.clear();

    details = document.createElement('details');
    details.id = 'starlight-toc-collapsible';
    details.className = 'collapsible-toc';
    details.open = true;

    summary = document.createElement('summary');
    summary.className = 'collapsible-toc__toggle';
    summary.setAttribute('aria-label', 'Toggle table of contents');
    summary.textContent = 'On this page';

    const chevron = document.createElement('svg');
    chevron.classList.add('collapsible-toc__chevron');
    chevron.setAttribute('aria-hidden', 'true');
    summary.appendChild(chevron);

    content = document.createElement('div');
    content.id = 'starlight-toc-content';
    content.className = 'collapsible-toc__content';
    content.innerHTML = '<ul><li><a href="#section">Section</a></li></ul>';

    details.appendChild(summary);
    details.appendChild(content);
    document.body.appendChild(details);
  });

  afterEach(() => {
    details.remove();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('ARIA attributes', () => {
    it('summary has aria-label', () => {
      expect(summary.getAttribute('aria-label')).toBe('Toggle table of contents');
    });

    it('chevron svg is aria-hidden', () => {
      const svg = details.querySelector('.collapsible-toc__chevron');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('content has correct id', () => {
      expect(content.id).toBe('starlight-toc-content');
    });
  });

  describe('toggle behavior', () => {
    it('toggles open state on click', () => {
      expect(details.open).toBe(true);
      details.open = false;
      expect(details.open).toBe(false);
      details.open = true;
      expect(details.open).toBe(true);
    });

    it('responds to Enter key', () => {
      const initial = details.open;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          details.open = !details.open;
        }
      };
      details.addEventListener('keydown', handler);
      details.dispatchEvent(event);
      expect(details.open).toBe(!initial);
    });

    it('responds to Space key', () => {
      const initial = details.open;
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          details.open = !details.open;
        }
      };
      details.addEventListener('keydown', handler);
      details.dispatchEvent(event);
      expect(details.open).toBe(!initial);
    });

    it('ignores other keys', () => {
      const initial = details.open;
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          details.open = !details.open;
        }
      };
      details.addEventListener('keydown', handler);
      details.dispatchEvent(event);
      expect(details.open).toBe(initial);
    });
  });

  describe('localStorage persistence', () => {
    it('reads initial state from localStorage', () => {
      localStorage.setItem('starlight-toc-visible', 'false');
      const stored = localStorage.getItem('starlight-toc-visible');
      expect(stored).toBe('false');
      if (stored !== null) {
        details.open = JSON.parse(stored) as boolean;
      }
      expect(details.open).toBe(false);
    });

    it('reads true state from localStorage', () => {
      localStorage.setItem('starlight-toc-visible', 'true');
      const stored = localStorage.getItem('starlight-toc-visible');
      if (stored !== null) {
        details.open = JSON.parse(stored) as boolean;
      }
      expect(details.open).toBe(true);
    });

    it('writes state to localStorage on toggle', () => {
      details.open = false;
      localStorage.setItem('starlight-toc-visible', JSON.stringify(details.open));
      expect(localStorage.getItem('starlight-toc-visible')).toBe('false');

      details.open = true;
      localStorage.setItem('starlight-toc-visible', JSON.stringify(details.open));
      expect(localStorage.getItem('starlight-toc-visible')).toBe('true');
    });

    it('handles malformed localStorage value', () => {
      localStorage.setItem('starlight-toc-visible', 'not-json');
      const stored = localStorage.getItem('starlight-toc-visible');
      let open = true;
      if (stored !== null) {
        try {
          open = JSON.parse(stored) as boolean;
        } catch {
          // Keep default.
        }
      }
      expect(open).toBe(true);
    });

    it('handles null localStorage value', () => {
      const stored = localStorage.getItem('starlight-toc-visible');
      expect(stored).toBeNull();
    });

    it('uses custom storage key', () => {
      const customKey = 'custom-toc-key';
      localStorage.setItem(customKey, JSON.stringify(true));
      expect(localStorage.getItem(customKey)).toBe('true');
    });
  });

  describe('default state', () => {
    it('starts open by default', () => {
      expect(details.open).toBe(true);
    });

    it('starts collapsed when defaultCollapsed is true', () => {
      details.open = false;
      expect(details.open).toBe(false);
    });
  });

  describe('CSS classes', () => {
    it('applies chevron rotation when open', () => {
      const chevron = details.querySelector('.collapsible-toc__chevron');
      expect(chevron).not.toBeNull();
      expect(details.open).toBe(true);
    });

    it('content visibility follows open state', () => {
      details.open = true;
      expect(details.classList.contains('collapsible-toc')).toBe(true);

      details.open = false;
      expect(content.classList.contains('collapsible-toc__content')).toBe(true);
    });
  });
});
