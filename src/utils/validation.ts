import path from 'node:path';
import fs from 'fs-extra';

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
