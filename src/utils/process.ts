import { execa } from 'execa';

export async function command(command: string, args: string[], cwd: string): Promise<void> {
  try { await execa(command, args, { cwd, stdio: 'inherit' }); }
  catch (error) { throw new Error(`Command failed: ${command} ${args.join(' ')}\n${error instanceof Error ? error.message : String(error)}`); }
}
