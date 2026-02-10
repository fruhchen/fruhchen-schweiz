import { describe, it, expect } from 'vitest';
import {
  ROLES,
  ROLE_LABELS,
  REGIONS,
  LANGUAGES,
  MOOD_OPTIONS,
  GRANT_STAGES,
  NAV_ITEMS,
} from '@/lib/constants';

describe('ROLES', () => {
  it('defines all 5 user roles', () => {
    const values = Object.values(ROLES);
    expect(values).toContain('parent');
    expect(values).toContain('peer');
    expect(values).toContain('fachperson');
    expect(values).toContain('admin');
    expect(values).toContain('donor');
    expect(values).toHaveLength(5);
  });
});

describe('ROLE_LABELS', () => {
  it('has German labels for all roles', () => {
    Object.values(ROLES).forEach((role) => {
      expect(ROLE_LABELS[role]).toBeTruthy();
      expect(typeof ROLE_LABELS[role]).toBe('string');
    });
  });
});

describe('REGIONS', () => {
  it('contains Swiss regions', () => {
    expect(REGIONS.length).toBeGreaterThanOrEqual(5);
    const labels = REGIONS.map((r) => r.label);
    expect(labels).toContain('Bern');
    expect(labels).toContain('Zürich');
  });

  it('each region has id, label, and emoji', () => {
    REGIONS.forEach((region) => {
      expect(region.id).toBeTruthy();
      expect(region.label).toBeTruthy();
      expect(region.emoji).toBeTruthy();
    });
  });
});

describe('LANGUAGES', () => {
  it('supports German, French, and Italian', () => {
    const codes = LANGUAGES.map((l) => l.code);
    expect(codes).toContain('de');
    expect(codes).toContain('fr');
    expect(codes).toContain('it');
  });
});

describe('MOOD_OPTIONS', () => {
  it('has 5 mood levels', () => {
    expect(MOOD_OPTIONS).toHaveLength(5);
  });

  it('each has emoji, label, and color', () => {
    MOOD_OPTIONS.forEach((mood) => {
      expect(mood.emoji).toBeTruthy();
      expect(mood.label).toBeTruthy();
      expect(mood.color).toBeTruthy();
    });
  });
});

describe('GRANT_STAGES', () => {
  it('has multiple grant pipeline stages', () => {
    expect(GRANT_STAGES.length).toBeGreaterThanOrEqual(3);
  });

  it('each stage has id and label', () => {
    GRANT_STAGES.forEach((stage) => {
      expect(stage.id).toBeTruthy();
      expect(stage.label).toBeTruthy();
    });
  });
});

describe('NAV_ITEMS', () => {
  it('has parent navigation items', () => {
    expect(NAV_ITEMS.parent.length).toBeGreaterThan(0);
  });

  it('has admin navigation items', () => {
    expect(NAV_ITEMS.admin.length).toBeGreaterThan(0);
  });

  it('parent nav items have required fields', () => {
    NAV_ITEMS.parent.forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.href).toBeTruthy();
      expect(item.icon).toBeTruthy();
    });
  });

  it('admin nav items have required fields', () => {
    NAV_ITEMS.admin.forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.href).toBeTruthy();
      expect(item.icon).toBeTruthy();
    });
  });
});
