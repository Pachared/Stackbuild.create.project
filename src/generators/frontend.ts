import type { AppName, StackOptions } from '../types.js';
import { NEXT_PORTS, VITE_PORTS } from '../constants.js';
import { json, write } from '../utils/filesystem.js';

export async function generateFrontend(o: StackOptions, app: Exclude<AppName, 'api'>): Promise<void> {
  return o.frontend === 'vite' ? vite(o, app) : next(o, app);
}
async function vite(o: StackOptions, app: Exclude<AppName, 'api'>): Promise<void> {
  const root = o.targetDir, base = `apps/${app}`;
  await json(root, `${base}/package.json`, { name: `@stackbuild/${app}`, private: true, version: '0.1.0', type: 'module', scripts: { dev: `vite --port ${VITE_PORTS[app]}`, build: 'tsc -b && vite build', lint: 'eslint .', typecheck: 'tsc -b --noEmit' }, dependencies: viteDeps(o), devDependencies: { '@types/node': 'latest', '@vitejs/plugin-react': 'latest', typescript: 'latest', vite: 'latest', eslint: 'latest' } });
  await write(root, `${base}/.env.example`, 'VITE_API_URL=http://localhost:8080\n');
  await write(root, `${base}/index.html`, `<div id="root"></div><script type="module" src="/src/main.tsx"></script>\n`);
  await write(root, `${base}/vite.config.ts`, `import { fileURLToPath } from 'node:url';\nimport path from 'node:path';\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nconst dirname = path.dirname(fileURLToPath(import.meta.url));\nexport default defineConfig({ plugins: [react()], resolve: { alias: { '@': path.resolve(dirname, 'src') } } });\n`);
  await write(root, `${base}/tsconfig.json`, '{ "files": [], "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }] }\n');
  await write(root, `${base}/tsconfig.app.json`, '{ "compilerOptions": { "target": "ESNext", "useDefineForClassFields": true, "lib": ["ESNext", "DOM", "DOM.Iterable"], "allowJs": false, "skipLibCheck": true, "esModuleInterop": true, "allowSyntheticDefaultImports": true, "strict": true, "module": "ESNext", "moduleResolution": "bundler", "jsx": "react-jsx", "paths": { "@/*": ["./src/*"] } }, "include": ["src"] }\n');
  await write(root, `${base}/tsconfig.node.json`, '{ "compilerOptions": { "composite": true, "target": "ESNext", "lib": ["ESNext"], "module": "ESNext", "moduleResolution": "bundler", "allowSyntheticDefaultImports": true, "types": ["node"] }, "include": ["vite.config.ts"] }\n');
  await write(root, `${base}/eslint.config.js`, "export default [{ ignores: ['dist'] }];\n");
  await frontendFiles(root, base, app, o, false);
}
async function next(o: StackOptions, app: Exclude<AppName, 'api'>): Promise<void> {
  const root = o.targetDir, base = `apps/${app}`;
  await json(root, `${base}/package.json`, { name: `@stackbuild/${app}`, private: true, version: '0.1.0', scripts: { dev: `next dev --port ${NEXT_PORTS[app]}`, build: 'next build', start: `next start --port ${NEXT_PORTS[app]}`, lint: 'eslint .', typecheck: 'tsc --noEmit' }, dependencies: nextDeps(o), devDependencies: { '@types/node': 'latest', '@types/react': 'latest', typescript: 'latest', eslint: 'latest' } });
  await write(root, `${base}/.env.example`, 'NEXT_PUBLIC_API_URL=http://localhost:8080\n');
  await write(root, `${base}/next.config.ts`, "import type { NextConfig } from 'next';\nconst nextConfig: NextConfig = {}; export default nextConfig;\n");
  await write(root, `${base}/postcss.config.mjs`, o.ui === 'tailwind' ? "export default { plugins: { '@tailwindcss/postcss': {} } };\n" : 'export default {};\n');
  await write(root, `${base}/tsconfig.json`, '{ "compilerOptions": { "target": "ES2022", "lib": ["dom", "dom.iterable", "esnext"], "strict": true, "noEmit": true, "module": "esnext", "moduleResolution": "bundler", "jsx": "preserve", "plugins": [{ "name": "next" }] }, "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"] }\n');
  await write(root, `${base}/eslint.config.mjs`, "export default [{ ignores: ['.next'] }];\n");
  await frontendFiles(root, base, app, o, true);
}
function viteDeps(o: StackOptions) { return { react: 'latest', 'react-dom': 'latest', 'react-router-dom': 'latest', axios: 'latest', '@tanstack/react-query': 'latest', zustand: 'latest', ...(o.ui === 'mui' ? { '@mui/material': 'latest', '@mui/icons-material': 'latest', '@emotion/react': 'latest', '@emotion/styled': 'latest' } : o.ui === 'tailwind' ? { tailwindcss: 'latest' } : {}) }; }
function nextDeps(o: StackOptions) { return { next: 'latest', react: 'latest', 'react-dom': 'latest', axios: 'latest', '@tanstack/react-query': 'latest', zustand: 'latest', ...(o.ui === 'mui' ? { '@mui/material': 'latest', '@mui/icons-material': 'latest', '@emotion/react': 'latest', '@emotion/styled': 'latest' } : o.ui === 'tailwind' ? { tailwindcss: 'latest', '@tailwindcss/postcss': 'latest' } : {}) }; }
async function frontendFiles(root: string, base: string, app: string, o: StackOptions, isNext: boolean) {
  for (const folder of ['components', 'features', 'hooks', 'layouts', 'services', 'stores', 'styles', 'types', 'utils', ...(isNext ? ['app'] : ['api', 'assets', 'pages', 'routes'])]) await write(root, `${base}/src/${folder}/.gitkeep`, '');
  const css = o.ui === 'tailwind' ? '@import "tailwindcss";\n' : '*,*::before,*::after{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;color:#172033;background:#f8fafc}main{max-width:960px;margin:0 auto;padding:4rem 1.5rem}button{padding:.75rem 1rem;border:0;border-radius:.5rem;background:#0f172a;color:#fff}\n';
  await write(root, `${base}/src/styles/globals.css`, css);
  if (isNext) { await write(root, `${base}/src/app/layout.tsx`, `import '../styles/globals.css';\nexport default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }\n`); await write(root, `${base}/src/app/page.tsx`, `export default function Home() { return <main><p>StackBuild</p><h1>${app} application</h1><p>Next.js App Router starter.</p></main>; }\n`); }
  else { await write(root, `${base}/src/main.tsx`, "import { StrictMode } from 'react'; import { createRoot } from 'react-dom/client'; import './styles/globals.css'; import App from './App'; createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);\n"); await write(root, `${base}/src/App.tsx`, `export default function App() { return <main><p>StackBuild</p><h1>${app} application</h1><p>React + Vite starter.</p></main>; }\n`); await write(root, `${base}/src/vite-env.d.ts`, '/// <reference types="vite/client" />\n'); }
}
