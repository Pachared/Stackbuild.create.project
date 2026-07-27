import path from 'node:path';
import fs from 'fs-extra';

export async function write(root: string, file: string, content: string): Promise<void> {
  await fs.outputFile(path.join(root, file), content.trimStart());
}
export async function json(root: string, file: string, value: unknown): Promise<void> {
  await fs.outputJson(path.join(root, file), value, { spaces: 2 });
}
