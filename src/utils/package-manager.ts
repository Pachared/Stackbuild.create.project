import type { PackageManager } from '../types.js';

export const pmCommand = (pm: PackageManager, script: string) => pm === 'npm' ? ['run', script] : [script];
export const installCommand = (pm: PackageManager): [string, string[]] => {
  if (pm === 'pnpm') return ['pnpm', ['install']];
  if (pm === 'yarn') return ['yarn', ['install']];
  if (pm === 'bun') return ['bun', ['install']];
  return ['npm', ['install']];
};
