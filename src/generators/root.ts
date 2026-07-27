import type { StackOptions } from '../types.js';
import { FRONTEND_APPS } from '../constants.js';
import { json, write } from '../utils/filesystem.js';

export async function generateRoot(options: StackOptions): Promise<void> {
  const { targetDir: root, packageManager: pm, apps } = options;
  const scripts: Record<string, string> = { lint: 'npm run -ws lint --if-present', format: 'prettier --write .', clean: 'rimraf apps/*/dist apps/*/.next' };
  for (const app of apps) {
    if (app === 'api' && options.backend === 'go') { scripts['dev:api'] = 'cd apps/api && go run ./cmd/api'; scripts['build:api'] = 'cd apps/api && go build ./cmd/api'; continue; }
    scripts[`dev:${app}`] = pm === 'npm' ? `npm run dev -w @stackbuild/${app}` : `${pm} --filter @stackbuild/${app} dev`;
    scripts[`build:${app}`] = pm === 'npm' ? `npm run build -w @stackbuild/${app}` : `${pm} --filter @stackbuild/${app} build`;
  }
  scripts.dev = 'concurrently ' + apps.map(app => `"${app === 'api' && options.backend === 'go' ? 'cd apps/api && go run ./cmd/api' : `${pm === 'npm' ? 'npm run' : pm} dev:${app}`}"`).join(' ');
  scripts.build = apps.map(app => app === 'api' && options.backend === 'go' ? 'cd apps/api && go build ./cmd/api' : `${pm === 'npm' ? 'npm run' : pm} build:${app}`).join(' && ');
  await json(root, 'package.json', { name: options.projectName, private: true, version: '0.1.0', workspaces: pm === 'npm' || pm === 'yarn' ? ['apps/*', 'packages/*'] : undefined, scripts, devDependencies: { concurrently: '^9.1.0', prettier: '^3.6.0', rimraf: '^6.0.0', typescript: '^5.8.0' } });
  if (pm === 'pnpm') await write(root, 'pnpm-workspace.yaml', "packages:\n  - 'apps/*'\n  - 'packages/*'\nallowBuilds:\n  esbuild: true\n");
  await write(root, '.gitignore', 'node_modules/\ndist/\n.next/\n.env\ncoverage/\n*.db\n');
  await write(root, '.editorconfig', 'root = true\n[*]\ncharset = utf-8\nend_of_line = lf\nindent_style = space\nindent_size = 2\n');
  await write(root, '.prettierrc', '{ "singleQuote": true, "semi": true }\n');
  await write(root, '.prettierignore', 'node_modules\ndist\n.next\n');
  const env = ['NODE_ENV=development', 'API_PORT=8080', 'APP_URL=http://localhost:3000'];
  if (options.database !== 'none') env.push(`DATABASE_URL=${databaseUrl(options)}`, 'JWT_SECRET=change-me-in-production');
  if (options.cache === 'redis') env.push('REDIS_URL=redis://localhost:6379');
  if (apps.some(x => FRONTEND_APPS.includes(x))) env.push(options.frontend === 'vite' ? 'VITE_API_URL=http://localhost:8080' : 'NEXT_PUBLIC_API_URL=http://localhost:8080');
  await write(root, '.env.example', env.join('\n') + '\n');
  await write(root, 'README.md', `# ${options.projectName}\n\nGenerated with Create StackBuild.\n\n## Start\n\n\`\`\`bash\n${pm} install\n${pm === 'npm' ? 'npm run dev' : `${pm} dev`}\n\`\`\`\n`);
}
function databaseUrl(o: StackOptions): string { return o.database === 'postgres' ? 'postgresql://postgres:postgres@localhost:5432/app' : o.database === 'mysql' ? 'mysql://root:root@localhost:3306/app' : 'file:./dev.db'; }
