import type { Theme } from '../types/index.js';

/**
 * Theme color palette
 * Based on Tailwind-like gray scale and custom pink colors
 */
export const THEME: Theme = {
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#f5f5f5',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
  },
  yyPink: {
    50: '#fdf4f4',
    100: '#fbd1d2',
    150: '#f8babc',
  },
};
