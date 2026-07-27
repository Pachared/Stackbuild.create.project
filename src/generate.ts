import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { generateRoot } from './generators/root.js';
import { generatePackages } from './generators/packages.js';
import { generateFrontend } from './generators/frontend.js';
import { generateBackend } from './generators/backend.js';
import { generateDocker } from './generators/docker.js';
import type { StackOptions } from './types.js';
import { FRONTEND_APPS } from './constants.js';
import { command } from './utils/process.js';
import { installCommand } from './utils/package-manager.js';

export async function generateProject(o: StackOptions): Promise<void> {
  try {
  await fs.ensureDir(o.targetDir); await generateRoot(o); await generatePackages(o);
  for (const app of o.apps.filter(x => FRONTEND_APPS.includes(x))) await generateFrontend(o, app as 'customer' | 'admin' | 'partner');
  await generateBackend(o);
  if (o.backend === 'go') {
    await command('go', ['mod', 'tidy'], `${o.targetDir}/apps/api`, { GOCACHE: path.join(os.tmpdir(), 'stackbuild-go-build-cache') });
    const goMod = await fs.readFile(`${o.targetDir}/apps/api/go.mod`, 'utf8');
    const goVersion = goMod.match(/^go\s+(.+)$/m)?.[1] ?? '1.24';
    await fs.outputFile(`${o.targetDir}/go.work`, `go ${goVersion}\nuse ./apps/api\n`);
  }
  if (o.docker) await generateDocker(o);
  if (o.git) { try { await command('git', ['init'], o.targetDir); await command('git', ['add', '.'], o.targetDir); await command('git', ['commit', '-m', 'chore: initialize project with StackBuild'], o.targetDir); } catch { /* Git identity is optional. */ } }
  if (o.install) { const [cmd, args] = installCommand(o.packageManager); const packageManagerEnv = o.packageManager === 'pnpm' ? { COREPACK_ENABLE_DOWNLOAD_PROMPT: '0' } : undefined; await command(cmd, args, o.targetDir, packageManagerEnv); if (o.backend === 'nest' && o.database !== 'none') await command(o.packageManager, o.packageManager === 'npm' ? ['run', 'prisma:generate', '-w', '@stackbuild/api'] : o.packageManager === 'yarn' ? ['workspace', '@stackbuild/api', 'prisma:generate'] : ['--filter', '@stackbuild/api', 'prisma:generate'], o.targetDir, packageManagerEnv); }
  } catch (error) {
    await fs.outputFile(`${o.targetDir}/STACKBUILD_RECOVERY.md`, `# StackBuild recovery\n\nProject files were generated, but setup did not finish.\n\n## Retry\n\n\`\`\`bash\ncd ${o.projectName}\n${o.packageManager} install\n${o.backend === 'go' ? 'cd apps/api && go mod tidy && go build ./cmd/api' : o.database !== 'none' ? `${o.packageManager === 'npm' ? 'npm run prisma:generate -w @stackbuild/api' : `${o.packageManager} --filter @stackbuild/api prisma:generate`}` : ''}\n\`\`\`\n\nOriginal error:\n\n\`\`\`text\n${error instanceof Error ? error.message : String(error)}\n\`\`\`\n`);
    throw new Error(`Project files were created in ${o.targetDir}, but setup did not finish. See STACKBUILD_RECOVERY.md for retry steps.\n${error instanceof Error ? error.message : String(error)}`);
  }
}
