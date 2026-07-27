import type { StackOptions } from '../types.js';
import fs from 'fs-extra';
import { FRONTEND_APPS } from '../constants.js';
import { write } from '../utils/filesystem.js';

export async function generateDocker(o: StackOptions): Promise<void> {
  const services: string[] = [];
  for (const app of o.apps.filter(x => FRONTEND_APPS.includes(x))) { const port = o.frontend === 'vite' ? ({ customer: 5173, admin: 5174, partner: 5175 } as Record<string, number>)[app] : ({ customer: 3000, admin: 3001, partner: 3002 } as Record<string, number>)[app]; services.push(`  ${app}:\n    build: ./apps/${app}\n    ports: ["${port}:${port}"]\n    environment:\n      ${o.frontend === 'vite' ? 'VITE_API_URL' : 'NEXT_PUBLIC_API_URL'}: http://localhost:8080\n    restart: unless-stopped`); await write(o.targetDir, `apps/${app}/Dockerfile`, frontendDocker(o, port)); await write(o.targetDir, `apps/${app}/.dockerignore`, 'node_modules\ndist\n.next\n'); }
  const apiEnvironment = dockerApiEnvironment(o);
  const apiVolumes = o.database === 'sqlite' ? '    volumes: ["sqlite_data:/app/data"]\n' : '';
  services.push(`  api:\n    build: ./apps/api\n    ports: ["8080:8080"]\n    env_file: .env\n${apiEnvironment}${apiVolumes}${o.cache === 'redis' ? '    depends_on:\n      redis:\n        condition: service_healthy\n' : ''}    healthcheck:\n      test: ["CMD", "wget", "-qO-", "http://localhost:8080/health"]\n      interval: 10s\n      timeout: 3s\n      retries: 5\n    restart: unless-stopped`);
  if (o.cache === 'redis') services.push(`  redis:\n    image: redis:7-alpine\n    ports: ["6379:6379"]\n    command: redis-server --appendonly yes\n    volumes: ["redis_data:/data"]\n    healthcheck:\n      test: ["CMD", "redis-cli", "ping"]\n      interval: 10s\n      timeout: 3s\n      retries: 5\n    restart: unless-stopped`);
  const goMod = o.backend === 'go' ? await fs.readFile(`${o.targetDir}/apps/api/go.mod`, 'utf8') : '';
  const goImageVersion = goMod.match(/^go\s+(\d+\.\d+)/m)?.[1] ?? '1.24';
  await write(o.targetDir, 'apps/api/Dockerfile', o.backend === 'go' ? `FROM golang:${goImageVersion}-alpine AS build\nWORKDIR /app\nCOPY . .\nRUN go build -o api ./cmd/api\nFROM alpine:3.21\nWORKDIR /app\nCOPY --from=build /app/api .\nEXPOSE 8080\nCMD ["./api"]\n` : 'FROM node:22-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\nFROM node:22-alpine\nWORKDIR /app\nCOPY --from=build /app .\nEXPOSE 8080\nCMD ["npm", "run", "start"]\n');
  if (o.database === 'postgres' || o.database === 'mysql') { const image = o.database === 'postgres' ? 'postgres:17-alpine' : 'mysql:8'; const mount = o.database === 'postgres' ? '/var/lib/postgresql/data' : '/var/lib/mysql'; services.push(`  database:\n    image: ${image}\n    ${o.database === 'postgres' ? 'environment:\n      POSTGRES_DB: app\n      POSTGRES_USER: postgres\n      POSTGRES_PASSWORD: postgres\n' : 'environment:\n      MYSQL_DATABASE: app\n      MYSQL_ROOT_PASSWORD: root\n'}    volumes: ["database_data:${mount}"]\n    restart: unless-stopped`); }
  const volumes = [o.database === 'postgres' || o.database === 'mysql' ? '  database_data:' : '', o.database === 'sqlite' ? '  sqlite_data:' : '', o.cache === 'redis' ? '  redis_data:' : ''].filter(Boolean);
  await write(o.targetDir, 'docker-compose.yml', `services:\n${services.join('\n')}\n${volumes.length ? `\nvolumes:\n${volumes.join('\n')}\n` : ''}`); await write(o.targetDir, '.dockerignore', 'node_modules\ndist\n.next\n.git\n.env\n');
}
function dockerApiEnvironment(o: StackOptions): string {
  if (o.database === 'postgres') return '    environment:\n      DATABASE_URL: postgresql://postgres:postgres@database:5432/app\n';
  if (o.database === 'mysql') return '    environment:\n      DATABASE_URL: mysql://root:root@database:3306/app\n';
  if (o.database === 'sqlite') return '    environment:\n      DATABASE_URL: file:/app/data/dev.db\n';
  return '';
}
function frontendDocker(o: StackOptions, port: number): string { return o.frontend === 'next' ? `FROM node:22-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\nFROM node:22-alpine\nWORKDIR /app\nCOPY --from=build /app .\nEXPOSE ${port}\nCMD ["npm", "run", "start"]\n` : `FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE ${port}\nCMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]\n`; }
