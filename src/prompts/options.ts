import { checkbox, confirm, input, select } from '@inquirer/prompts';
import { FRONTEND_APPS, PRESETS } from '../constants.js';
import type { AppName, CliOptions, StackOptions } from '../types.js';

const choice = (name: string, value: string) => ({ name, value });

export async function collectOptions(projectName: string, targetDir: string, flags: CliOptions): Promise<StackOptions> {
  const preset = flags.preset ?? await select({ message: 'Application preset:', choices: [
    choice('Customer + API + Admin + Partner', 'full'), choice('Customer + API + Partner', 'customer-partner'),
    choice('Customer + API + Admin', 'customer-admin'), choice('Customer + API', 'customer-api'), choice('Custom', 'custom'),
  ] }) as StackOptions['preset'];
  const apps: AppName[] = preset === 'custom'
    ? [...await checkbox({ message: 'Applications to generate:', choices: FRONTEND_APPS.map(app => ({ name: app, value: app, checked: app === 'customer' })), required: true }), 'api'] as AppName[]
    : [...PRESETS[preset]];
  const frontend = flags.frontend ?? await select({ message: 'Frontend stack:', choices: [choice('React + TypeScript + Vite', 'vite'), choice('Next.js + TypeScript + App Router', 'next')] }) as StackOptions['frontend'];
  const backend = flags.backend ?? await select({ message: 'Backend stack:', choices: [choice('Go + Gin', 'go'), choice('Node.js + NestJS', 'nest')] }) as StackOptions['backend'];
  const ui = flags.ui ?? await select({ message: 'UI library:', choices: [choice('Material UI', 'mui'), choice('Tailwind CSS', 'tailwind'), choice('Plain CSS', 'css')] }) as StackOptions['ui'];
  const database = flags.database ?? await select({ message: 'Database:', choices: [choice('PostgreSQL', 'postgres'), choice('MySQL', 'mysql'), choice('SQLite', 'sqlite'), choice('No database', 'none')] }) as StackOptions['database'];
  const packageManager = flags.packageManager ?? await select({ message: 'Package manager:', choices: ['npm', 'pnpm', 'yarn', 'bun'].map(x => choice(x, x)) }) as StackOptions['packageManager'];
  const docker = flags.docker ?? await confirm({ message: 'Generate Docker support?', default: true });
  const git = flags.git ?? await confirm({ message: 'Initialize a Git repository?', default: true });
  const install = flags.install ?? await confirm({ message: 'Install dependencies now?', default: true });
  const goModule = backend === 'go' ? await input({ message: 'Go module path:', default: `github.com/username/${projectName}/apps/api` }) : '';
  return { projectName, targetDir, preset, apps, frontend, backend, ui, database, packageManager, docker, git, install, force: flags.force ?? false, debug: flags.debug ?? false, goModule };
}
