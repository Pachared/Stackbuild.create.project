import path from 'node:path';
import fs from 'fs-extra';
import type { AppName, Backend, Cache, Database, Frontend, PackageManager, Preset, Ui } from '../types.js';

const NAME = /^[a-z0-9][a-z0-9_-]*$/;
export function normalizeProjectName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}
export function validateProjectName(value: string): string | true {
  if (!value.trim()) return 'Project name is required.';
  if (!NAME.test(value)) return 'Use lowercase letters, numbers, hyphens, or underscores only.';
  if (value.startsWith('.') || value.length > 214) return 'This is not a valid npm package name.';
  return true;
}
export async function assertTargetDirectory(targetDir: string, force: boolean): Promise<void> {
  if (await fs.pathExists(targetDir) && (await fs.readdir(targetDir)).length > 0 && !force) {
    throw new Error(`Directory ${path.basename(targetDir)} already exists and is not empty. Use --force to continue.`);
  }
}
export function assertNodeVersion(): void {
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 20) throw new Error('Create StackBuild requires Node.js 20 or newer.');
}

const values = {
  preset: ['full', 'customer-partner', 'customer-admin', 'customer-api', 'custom'],
  frontend: ['vite', 'next'], backend: ['go', 'nest'], ui: ['mui', 'tailwind', 'css'],
  database: ['postgres', 'mysql', 'sqlite', 'none'], cache: ['redis', 'none'],
  packageManager: ['npm', 'pnpm', 'yarn', 'bun'], apps: ['customer', 'admin', 'partner'],
} as const;

export function assertOptionValues(options: { preset?: Preset; frontend?: Frontend; backend?: Backend; ui?: Ui; database?: Database; cache?: Cache; packageManager?: PackageManager; apps?: Exclude<AppName, 'api'>[] }): void {
  for (const key of Object.keys(values) as (keyof typeof values)[]) {
    const value = options[key];
    if (value === undefined) continue;
    const allowed = values[key as keyof typeof values] as readonly string[];
    const supplied = Array.isArray(value) ? value : [value];
    for (const item of supplied) if (!allowed.includes(item)) throw new Error(`Invalid --${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)} value "${item}". Allowed values: ${allowed.join(', ')}.`);
  }
  if (options.preset === 'custom' && options.apps && options.apps.length === 0) throw new Error('--apps must include at least one frontend app when --preset custom is used.');
  if (options.apps && options.preset !== 'custom') throw new Error('--apps can only be used with --preset custom.');
}

export function validateGoModule(value: string): string | true {
  return value.trim() && /^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(value) ? true : 'Use a valid Go module path, for example github.com/acme/my-app/apps/api.';
}
