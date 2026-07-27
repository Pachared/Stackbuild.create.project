import path from 'node:path';
import { Command } from 'commander';
import ora from 'ora';
import { collectOptions } from './prompts/options.js';
import { getProjectName } from './prompts/project.js';
import { assertNodeVersion, assertTargetDirectory } from './utils/validation.js';
import { generateProject } from './generate.js';
import { log } from './utils/logger.js';
import type { CliOptions } from './types.js';

const program = new Command();
program.name('create-stackbuild').description('Create a production-ready full-stack monorepo').version('0.1.0').argument('[project-name]').option('--preset <preset>').option('--frontend <frontend>').option('--backend <backend>').option('--ui <ui>').option('--database <database>').option('--cache <cache>').option('--package-manager <manager>').option('--skip-install').option('--no-git').option('--docker').option('--no-docker').option('--force').option('--debug').action(async (name, raw) => {
  try { assertNodeVersion(); const flags: CliOptions = { preset: raw.preset, frontend: raw.frontend, backend: raw.backend, ui: raw.ui, database: raw.database, cache: raw.cache, packageManager: raw.packageManager, docker: raw.docker, git: raw.git, install: !raw.skipInstall, force: raw.force, debug: raw.debug }; const projectName = await getProjectName(name); const targetDir = path.resolve(process.cwd(), projectName); await assertTargetDirectory(targetDir, flags.force ?? false); const options = await collectOptions(projectName, targetDir, flags); const spinner = ora('Generating StackBuild project…').start(); await generateProject(options); spinner.succeed('StackBuild project created successfully.'); log.title('Next steps'); console.log(`  cd ${projectName}\n  ${options.install ? `${options.packageManager === 'npm' ? 'npm run dev' : `${options.packageManager} dev`}` : `${options.packageManager} install\n  ${options.packageManager === 'npm' ? 'npm run dev' : `${options.packageManager} dev`}`}`); log.info(`\nApps: ${options.apps.join(', ')} · API: http://localhost:8080/health`); } catch (error) { log.error(error instanceof Error ? error.message : String(error)); if (raw.debug && error instanceof Error) console.error(error.stack); process.exitCode = 1; }
});
program.parseAsync().catch(error => { log.error(error.message); process.exitCode = 1; });
