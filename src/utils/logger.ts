import pc from 'picocolors';

const logo = `
   _____ _             _    ____        _ _     _
  / ____| |           | |  |  _ \\      (_) |   | |
 | (___ | |_ __ _  ___| | _| |_) |_   _ _| | __| |
  \\___ \\| __/ _\` |/ __| |/ /  _ <| | | | |/ _\` |
  ____) | || (_| | (__|   <| |_) | |_| | | | (_| |
 |_____/ \\__\\__,_|\\___|_|\\_\\____/ \\__,_|_|_|\\__,_|
`;

export const log = {
  logo: () => {
    console.log(pc.cyan(logo));
    console.log(`  ${pc.bold(pc.green('Create production-ready full-stack monorepos'))}`);
    console.log(`  ${pc.dim('Create StackBuild')}`);
  },
  title: (message: string) => console.log(`\n${pc.bold(pc.cyan(message))}`),
  info: (message: string) => console.log(pc.dim(message)),
  success: (message: string) => console.log(pc.green(`✓ ${message}`)),
  warn: (message: string) => console.warn(pc.yellow(`! ${message}`)),
  error: (message: string) => console.error(pc.red(`✖ ${message}`)),
};
