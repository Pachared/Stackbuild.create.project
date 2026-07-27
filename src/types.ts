export type Frontend = 'vite' | 'next';
export type Backend = 'go' | 'nest';
export type Ui = 'mui' | 'tailwind' | 'css';
export type Database = 'postgres' | 'mysql' | 'sqlite' | 'none';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
export type AppName = 'customer' | 'admin' | 'partner' | 'api';
export type Preset = 'full' | 'customer-partner' | 'customer-admin' | 'customer-api' | 'custom';

export interface StackOptions {
  projectName: string;
  targetDir: string;
  preset: Preset;
  apps: AppName[];
  frontend: Frontend;
  backend: Backend;
  ui: Ui;
  database: Database;
  packageManager: PackageManager;
  docker: boolean;
  git: boolean;
  install: boolean;
  force: boolean;
  debug: boolean;
  goModule: string;
}

export interface CliOptions {
  preset?: Preset; frontend?: Frontend; backend?: Backend; ui?: Ui;
  database?: Database; packageManager?: PackageManager; docker?: boolean;
  git?: boolean; install?: boolean; force?: boolean; debug?: boolean;
}
