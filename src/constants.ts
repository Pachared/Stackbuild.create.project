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

// Major framework upgrades are deliberate: Dependabot opens reviewable updates
// and the generated-project CI matrix validates them before they reach users.
export const STACK_VERSIONS = {
  next: '16.2.12',
  nest: '11.1.28',
  nestConfig: '4.0.4',
  nestSwagger: '11.4.6',
  nestCli: '11.0.24',
  nestSchematics: '11.1.0',
  react: '19.2.8',
  typescript: '6.0.3',
  vite: '8.1.5',
  viteReact: '6.0.4',
  prisma: '6.19.3',
  ioredis: '5.11.1',
} as const;
