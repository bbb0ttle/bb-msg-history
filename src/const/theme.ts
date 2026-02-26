import type { Theme } from '../types/index.js';

/**
 * Theme color palette
 * Based on Tailwind-like gray scale and custom pink colors
 */
export const THEME: Theme = {
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
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
  }
};
