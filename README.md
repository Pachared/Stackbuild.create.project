# Create StackForge

`create-stackforge` is an interactive, production-minded CLI that creates a full-stack monorepo with one or more frontend apps, an API, shared workspace packages, optional database wiring, and Docker support.

## Requirements

- Node.js 20+
- Go installed when selecting Go + Gin

## Usage

```bash
npm create stackforge@latest
npm create stackforge@latest my-project
npx create-stackforge@latest my-project
```

Forward flags through `npm create` after `--` because npm otherwise consumes them itself:

```bash
npm create stackforge@latest my-project -- \
  --preset customer-admin --frontend vite --backend go --ui mui \
  --database postgres --package-manager npm --docker
```

## Options

`--preset`, `--frontend`, `--backend`, `--ui`, `--database`, `--package-manager`, `--skip-install`, `--no-git`, `--docker`, `--no-docker`, `--force`, and `--debug` are supported. Provided flags override interactive answers.

Presets: `full`, `customer-partner`, `customer-admin`, `customer-api`, and `custom`.

Supported frontend stacks are React + Vite and Next.js App Router. Supported APIs are Go + Gin and NestJS. UI choices are Material UI, Tailwind CSS, or plain CSS; database choices are PostgreSQL, MySQL, SQLite, or none.

## Generated project

```text
apps/       customer, admin, partner, api (only selected apps)
packages/   config, eslint-config, types, ui, utils
tooling/    project automation scripts
```

Run `npm run dev`, `npm run build`, `npm run lint`, or `npm run format` from a generated npm workspace. When Docker is enabled, use `docker compose up --build`.

## Development

```bash
npm install
npm run build
npm test
```

## Publishing

Update the version, build the package, inspect it with `npm pack --dry-run`, then publish with `npm publish`. The published package includes only the compiled CLI and documentation required by npm.

## Troubleshooting and contributing

Use `--debug` to see the source error. Ensure Node.js 20+ is active, and install Go before generating a Go API. Contributions are welcome: create a branch, add focused tests for generator changes, run build and tests, and submit a pull request.
