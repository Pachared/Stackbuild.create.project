import type { StackOptions } from '../types.js';
import { write } from '../utils/filesystem.js';

export async function generateFeatures(o: StackOptions): Promise<void> {
  if (o.ci) await write(o.targetDir, '.github/workflows/ci.yml', `name: CI\non: [push, pull_request]\njobs:\n  quality:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 22 }\n      - run: corepack enable\n      - run: ${o.packageManager} install\n      - run: ${o.packageManager} run lint\n      - run: ${o.packageManager} run build\n`);
  if (o.auth === 'jwt') await write(o.targetDir, 'AUTH.md', '# JWT authentication\n\nJWT authentication is enabled. Set `JWT_SECRET` to a strong production secret before deploying.\n');
  if (o.crud) await write(o.targetDir, 'CRUD_EXAMPLE.md', '# User CRUD example\n\nUse this as the first vertical slice: list users, create a user, update a user, and delete a user through the API.\n');
}
