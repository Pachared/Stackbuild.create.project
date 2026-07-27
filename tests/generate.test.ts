import { afterEach, describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { generateProject } from '../src/generate.js';
import type { StackOptions } from '../src/types.js';

const dirs: string[] = [];
function options(overrides: Partial<StackOptions> = {}): StackOptions { const targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stackbuild-')); dirs.push(targetDir); return { projectName: 'demo', targetDir, preset: 'customer-api', apps: ['customer', 'api'], frontend: 'vite', backend: 'go', ui: 'mui', database: 'postgres', packageManager: 'npm', docker: true, git: false, install: false, force: false, debug: false, goModule: 'github.com/example/demo/apps/api', ...overrides }; }
afterEach(async () => Promise.all(dirs.splice(0).map(dir => fs.remove(dir))));
describe('project generation', () => {
  it('generates Vite, Go, MUI, Postgres and npm workspaces', async () => { const o = options(); await generateProject(o); expect(await fs.pathExists(path.join(o.targetDir, 'apps/customer/src/App.tsx'))).toBe(true); expect(await fs.pathExists(path.join(o.targetDir, 'apps/admin'))).toBe(false); expect(await fs.readJson(path.join(o.targetDir, 'package.json'))).toMatchObject({ workspaces: ['apps/*', 'packages/*'] }); expect(await fs.readFile(path.join(o.targetDir, '.env.example'), 'utf8')).toContain('DATABASE_URL='); expect(await fs.pathExists(path.join(o.targetDir, 'docker-compose.yml'))).toBe(true); });
  it('generates Next, Nest, Tailwind, Postgres and pnpm workspaces', async () => { const o = options({ preset: 'customer-admin', apps: ['customer', 'api', 'admin'], frontend: 'next', backend: 'nest', ui: 'tailwind', packageManager: 'pnpm' }); await generateProject(o); expect(await fs.pathExists(path.join(o.targetDir, 'apps/admin/src/app/page.tsx'))).toBe(true); expect(await fs.pathExists(path.join(o.targetDir, 'pnpm-workspace.yaml'))).toBe(true); expect(await fs.pathExists(path.join(o.targetDir, 'apps/api/prisma/schema.prisma'))).toBe(true); expect(await fs.pathExists(path.join(o.targetDir, 'apps/partner'))).toBe(false); });
  it('omits optional Docker and database artifacts', async () => { const o = options({ preset: 'customer-partner', apps: ['customer', 'api', 'partner'], ui: 'css', database: 'none', docker: false }); await generateProject(o); expect(await fs.pathExists(path.join(o.targetDir, 'apps/partner/src/App.tsx'))).toBe(true); expect(await fs.pathExists(path.join(o.targetDir, 'docker-compose.yml'))).toBe(false); expect(await fs.readFile(path.join(o.targetDir, '.env.example'), 'utf8')).not.toContain('DATABASE_URL='); });
});
