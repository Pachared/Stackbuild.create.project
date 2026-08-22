import type { StackOptions } from "../types.js";
import { json, write } from "../utils/filesystem.js";

async function pkg(
  root: string,
  name: string,
  files: Record<string, string>
): Promise<void> {
  await json(root, `packages/${name}/package.json`, {
    name: `@stackbuild/${name}`,
    version: "0.1.0",
    private: true,
    type: "module",
    exports: "./src/index.ts",
  });
  await Promise.all(
    Object.entries(files).map(([file, content]) =>
      write(root, `packages/${name}/${file}`, content)
    )
  );
}
export async function generatePackages(o: StackOptions): Promise<void> {
  await pkg(o.targetDir, "types", {
    "src/index.ts": `export interface ApiResponse<T> { success: boolean; message: string; data: T; }\nexport interface User { id: string; email: string; name: string; }\nexport interface Pagination { page: number; limit: number; total: number; }\nexport interface ApiError { message: string; code?: string; }\nexport interface HealthResponse { status: 'healthy'; }\n`,
  });
  await pkg(o.targetDir, "config", {
    "src/index.ts": `export const ports = { customer: ${o.frontend === "vite" ? 5173 : 3000}, admin: ${o.frontend === "vite" ? 5174 : 3001}, partner: ${o.frontend === "vite" ? 5175 : 3002}, api: 8080 } as const;\nexport const appNames = ${JSON.stringify(o.apps)} as const;\n`,
  });
  await pkg(o.targetDir, "utils", {
    "src/index.ts": `export const isNonEmpty = (value: string | null | undefined): value is string => Boolean(value?.trim());\nexport const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));\n`,
  });
  await pkg(o.targetDir, "eslint-config", {
    "base.js": `export default [{ ignores: ['dist', '.next', 'node_modules'] }];\n`,
    "package.json": JSON.stringify(
      {
        name: "@stackbuild/eslint-config",
        version: "0.1.0",
        private: true,
        type: "module",
        exports: { "./base": "./base.js" },
      },
      null,
      2
    ),
  });
  if (o.ui !== "css")
    await pkg(o.targetDir, "ui", { "src/index.tsx": uiSource(o) });
}
function uiSource(o: StackOptions): string {
  if (o.ui === "mui")
    return `'use client';\nexport { Button, Container as PageContainer, AppBar as AppHeader, CircularProgress as LoadingState } from '@mui/material';\nexport const EmptyState = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;\n`;
  return `'use client';\nimport type { ButtonHTMLAttributes, ReactNode } from 'react';\nexport const Button = (p: ButtonHTMLAttributes<HTMLButtonElement>) => <button className="rounded bg-slate-900 px-4 py-2 text-white" {...p} />;\nexport const PageContainer = ({ children }: { children: ReactNode }) => <main className="mx-auto max-w-6xl p-6">{children}</main>;\nexport const AppHeader = ({ children }: { children: ReactNode }) => <header className="border-b p-4">{children}</header>;\nexport const LoadingState = () => <p>Loading…</p>; export const EmptyState = ({ children }: { children: ReactNode }) => <p>{children}</p>;\n`;
}
