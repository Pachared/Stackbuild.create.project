import pc from 'picocolors';

export const log = {
  title: (message: string) => console.log(`\n${pc.bold(pc.cyan(message))}`),
  info: (message: string) => console.log(pc.dim(message)),
  success: (message: string) => console.log(pc.green(`✓ ${message}`)),
  warn: (message: string) => console.warn(pc.yellow(`! ${message}`)),
  error: (message: string) => console.error(pc.red(`✖ ${message}`)),
};
