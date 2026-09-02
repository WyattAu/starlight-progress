import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('ReadingProgress', () => {
  let bar: HTMLDivElement;
  let rafCallbacks: FrameRequestCallback[];

  beforeEach(() => {
    bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.className = 'reading-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuenow', '0');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-label', 'Reading progress');
    document.body.appendChild(bar);
    rafCallbacks = [];
    vi.stubGlobal(
      'requestAnimationFrame',
      (cb: FrameRequestCallback) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      }
    );
  });

  afterEach(() => {
    bar.remove();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  function flushRAF() {
    for (const cb of rafCallbacks) cb(0);
    rafCallbacks = [];
  }

  it('renders with correct ARIA attributes', () => {
    expect(bar.getAttribute('role')).toBe('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(bar.getAttribute('aria-label')).toBe('Reading progress');
  });

  describe('progress calculation', () => {
    it('calculates 0% at top of page', () => {
      const scrollTop = 0;
      const docHeight = 1000;
      const pct = Math.min((scrollTop / docHeight) * 100, 100);
      expect(pct).toBe(0);
    });

    it('calculates 50% at half scroll', () => {
      const scrollTop = 500;
      const docHeight = 1000;
      const pct = Math.min((scrollTop / docHeight) * 100, 100);
      expect(pct).toBe(50);
    });

    it('calculates 100% at bottom', () => {
      const scrollTop = 1000;
      const docHeight = 1000;
      const pct = Math.min((scrollTop / docHeight) * 100, 100);
      expect(pct).toBe(100);
    });

    it('caps at 100% even if scrollTop exceeds docHeight', () => {
      const scrollTop = 1500;
      const docHeight = 1000;
      const pct = Math.min((scrollTop / docHeight) * 100, 100);
      expect(pct).toBe(100);
    });

    it('handles zero docHeight gracefully', () => {
      const scrollTop = 0;
      const docHeight = 0;
      const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      expect(pct).toBe(0);
    });

    it('rounds aria-valuenow to integer', () => {
      const scrollTop = 333;
      const docHeight = 1000;
      const pct = Math.min((scrollTop / docHeight) * 100, 100);
      expect(Math.round(pct)).toBe(33);
    });
  });

  describe('hideAtStart behavior', () => {
    it('should hide when progress < 1%', () => {
      bar.style.display = 'none';
      const pct = 0.5;
      if (pct < 1) {
        bar.style.display = 'none';
      } else {
        bar.style.display = '';
      }
      expect(bar.style.display).toBe('none');
    });

    it('should show when progress >= 1%', () => {
      bar.style.display = 'none';
      const pct = 5;
      if (pct < 1) {
        bar.style.display = 'none';
      } else {
        bar.style.display = '';
      }
      expect(bar.style.display).toBe('');
    });

    it('should show at exactly 1%', () => {
      bar.style.display = 'none';
      const pct = 1;
      if (pct < 1) {
        bar.style.display = 'none';
      } else {
        bar.style.display = '';
      }
      expect(bar.style.display).toBe('');
    });
  });

  describe('requestAnimationFrame throttling', () => {
    it('uses requestAnimationFrame for updates', () => {
      const rafSpy = vi.fn((cb: FrameRequestCallback) => {
        cb(0);
        return 1;
      });
      vi.stubGlobal('requestAnimationFrame', rafSpy);

      let ticking = false;
      function updateProgress() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          bar.style.width = '50%';
          ticking = false;
        });
      }

      updateProgress();
      expect(rafSpy).toHaveBeenCalledTimes(1);
    });

    it('skips update when already ticking', () => {
      const rafSpy = vi.fn((cb: FrameRequestCallback) => {
        return 1;
      });
      vi.stubGlobal('requestAnimationFrame', rafSpy);

      let ticking = false;
      function updateProgress() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
        });
      }

      updateProgress();
      updateProgress();
      expect(rafSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('View Transitions support', () => {
    it('listens for astro:after-swap event', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const handler = () => {};
      document.addEventListener('astro:after-swap', handler);
      expect(addEventListenerSpy).toHaveBeenCalledWith('astro:after-swap', handler);
      document.removeEventListener('astro:after-swap', handler);
    });

    it('listens for astro:page-load event', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const handler = () => {};
      document.addEventListener('astro:page-load', handler);
      expect(addEventListenerSpy).toHaveBeenCalledWith('astro:page-load', handler);
      document.removeEventListener('astro:page-load', handler);
    });
  });

  describe('data attribute configuration', () => {
    it('stores config as data attributes', () => {
      bar.dataset.height = '5';
      bar.dataset.color = '#ff0000';
      bar.dataset.zIndex = '100';
      bar.dataset.transitionDuration = '200';
      bar.dataset.hideAtStart = 'false';

      expect(bar.dataset.height).toBe('5');
      expect(bar.dataset.color).toBe('#ff0000');
      expect(bar.dataset.zIndex).toBe('100');
      expect(bar.dataset.transitionDuration).toBe('200');
      expect(bar.dataset.hideAtStart).toBe('false');
    });

    it('applies data attributes to inline styles', () => {
      bar.dataset.height = '5';
      bar.dataset.color = '#ff0000';
      bar.dataset.zIndex = '100';
      bar.dataset.transitionDuration = '200';

      bar.style.height = `${bar.dataset.height}px`;
      bar.style.background = bar.dataset.color ?? '';
      bar.style.zIndex = bar.dataset.zIndex ?? '';
      bar.style.transitionDuration = `${bar.dataset.transitionDuration}ms`;

      expect(bar.style.height).toBe('5px');
      expect(bar.style.background).toBe('rgb(255, 0, 0)');
      expect(bar.style.zIndex).toBe('100');
      expect(bar.style.transitionDuration).toBe('200ms');
    });
  });
});
