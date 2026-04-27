export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  background: '#FFF8E7',
  text: '#2C3E50',
  textLight: '#7F8C8D',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 } as const;
