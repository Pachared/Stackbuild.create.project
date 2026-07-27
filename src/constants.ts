import type { AppName, Preset } from './types.js';

export const NODE_MAJOR_REQUIRED = 20;
export const PRESETS: Record<Exclude<Preset, 'custom'>, AppName[]> = {
  full: ['customer', 'api', 'admin', 'partner'],
  'customer-partner': ['customer', 'api', 'partner'],
  'customer-admin': ['customer', 'api', 'admin'],
  'customer-api': ['customer', 'api'],
};
export const VITE_PORTS = { customer: 5173, admin: 5174, partner: 5175 } as const;
export const NEXT_PORTS = { customer: 3000, admin: 3001, partner: 3002 } as const;
export const FRONTEND_APPS: AppName[] = ['customer', 'admin', 'partner'];
