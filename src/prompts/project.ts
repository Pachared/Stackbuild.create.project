import { input } from '@inquirer/prompts';
import type { CliOptions } from '../types.js';
import { normalizeProjectName, validateProjectName } from '../utils/validation.js';

export async function getProjectName(name?: string): Promise<string> {
  const value = name ?? await input({ message: 'Project name:', validate: validateProjectName });
  const normalized = normalizeProjectName(value);
  const result = validateProjectName(normalized);
  if (result !== true) throw new Error(result);
  return normalized;
}

export function supplied<T>(value: T | undefined, fallback: T): T { return value ?? fallback; }
export type PromptFlags = CliOptions;
