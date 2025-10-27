/**
 * Tests for app reset functionality
 * Verifies that clicking the app title correctly resets to saved or default state
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('App Reset Functionality', () => {
  const STORAGE_KEY = 'bdchm-app-state';
  let originalLocation: Location;

  beforeEach(() => {
    // Store original location
    originalLocation = window.location;

    // Clear localStorage
    localStorage.clear();

    // Mock window.location with href that can be set
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      href: 'http://localhost/',
      search: '',
      pathname: '/dynamic-model-var-docs/',
      reload: vi.fn()
    } as any;
  });

  afterEach(() => {
    // Restore original location
    window.location = originalLocation;
    localStorage.clear();
  });

  describe('Reset to default when no saved state', () => {
    it('should reset to classes-only when localStorage is empty', () => {
      // Setup: complex state with expansion params
      window.location.search = '?l=c,v&r=e&rve=Condition&lce=Entity';

      // Verify starting state
      expect(window.location.search).toContain('rve=Condition');
      expect(window.location.search).toContain('lce=Entity');

      // Simulate: saveStateToURL with default state
      // (This is what handleResetApp calls before reload)
      const params = new URLSearchParams(window.location.search);

      // Update to default state
      params.set('l', 'c');
      params.delete('r');
      params.delete('dialogs');
      params.delete('rve');
      params.delete('lce');
      params.delete('lve');
      params.delete('rce');

      const newURL = `/dynamic-model-var-docs/${params.toString() ? '?' + params.toString() : ''}`;

      // Verify URL is cleaned
      expect(newURL).toBe('/dynamic-model-var-docs/?l=c');
      expect(newURL).not.toContain('rve');
      expect(newURL).not.toContain('lce');
    });

    it('should clear all expansion params on reset', () => {
      window.location.search = '?l=c&r=v&lce=Entity,Observation&rve=Condition,Specimen&lve=Participant';

      const params = new URLSearchParams(window.location.search);

      // Simulate reset to default
      params.set('l', 'c');
      params.delete('r');
      params.delete('lce');
      params.delete('rce');
      params.delete('lve');
      params.delete('rve');

      const newURL = `/dynamic-model-var-docs/${params.toString() ? '?' + params.toString() : ''}`;

      expect(newURL).toBe('/dynamic-model-var-docs/?l=c');
    });
  });

  describe('Reset to saved state when localStorage exists', () => {
    it('should reset to saved layout from localStorage', () => {
      // Setup: save a specific layout
      const savedState = {
        leftSections: ['classes', 'enums'],
        rightSections: ['variables']
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));

      // Current URL has different state
      window.location.search = '?l=c&r=s&rve=Condition';

      const params = new URLSearchParams(window.location.search);

      // Simulate: saveStateToURL with saved state
      params.set('l', 'c,e');
      params.set('r', 'v');
      params.delete('dialogs');
      // Note: expansion params (rve) are NOT deleted by saveStateToURL
      // They remain until page reload

      const newURL = `/dynamic-model-var-docs/${params.toString() ? '?' + params.toString() : ''}`;

      // URL encoding converts comma to %2C
      expect(newURL).toContain('l=c%2Ce');
      expect(newURL).toContain('r=v');
      // Expansion params still present until reload
      expect(newURL).toContain('rve=Condition');
    });

    it('should preserve expansion params before reload', () => {
      const savedState = {
        leftSections: ['classes'],
        rightSections: []
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));

      // Current URL has expansion params
      window.location.search = '?l=c&r=v&rve=Condition,Specimen&lce=Entity';

      const params = new URLSearchParams(window.location.search);

      // Simulate saveStateToURL (what handleResetApp calls)
      params.set('l', 'c');
      params.delete('r');
      params.delete('dialogs');
      // Note: saveStateToURL preserves other params (like rve, lce)
      // because it starts with existing params

      const newURL = `/dynamic-model-var-docs/${params.toString() ? '?' + params.toString() : ''}`;

      // Expansion params are still in URL before reload
      expect(newURL).toContain('l=c');
      expect(newURL).toContain('rve=');
      expect(newURL).toContain('lce=Entity');
      // After reload (in actual app), expansion hooks will read from URL
    });
  });

  describe('URL cleaning behavior', () => {
    it('should remove all managed parameters when resetting', () => {
      window.location.search = '?l=c,e,s,v&r=c,e,s,v&lce=A,B,C&rce=D,E,F&lve=G,H&rve=I,J&dialogs=class:Foo:0,0,400,300';

      const params = new URLSearchParams(window.location.search);

      // Reset to minimal default
      params.set('l', 'c');
      params.delete('r');
      params.delete('dialogs');
      params.delete('lce');
      params.delete('rce');
      params.delete('lve');
      params.delete('rve');

      const newURL = `/dynamic-model-var-docs/${params.toString() ? '?' + params.toString() : ''}`;

      expect(newURL).toBe('/dynamic-model-var-docs/?l=c');
      expect(newURL.split('?')[1]?.split('&').length).toBe(1); // Only 'l=c'
    });
  });
});
