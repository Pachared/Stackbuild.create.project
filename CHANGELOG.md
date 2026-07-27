# Changelog

All notable changes to Create StackBuild are documented in this file.

## 0.2.6

- Disable Corepack's interactive download prompt when installing pnpm dependencies.

## 0.2.5

- Record npm trusted-publishing releases in GitHub's `npm` deployment environment.

## 0.2.4

- Show a cyan ASCII StackBuild logo before interactive setup questions.

## 0.2.3

- Add canonical GitHub repository metadata required by npm trusted publishing.
- Align the npm publishing workflow with npm's current trusted-publishing configuration.

## 0.2.2

- Use a current npm CLI with Node 24 in the release workflow so npm trusted publishing can generate provenance through GitHub Actions.

## 0.2.1

- Add `--template` as a clear alias for `--preset`.
- Pin compatibility-sensitive framework versions (including Prisma 6 for the generated client API) and add Dependabot updates.
- Validate generated Nest + PostgreSQL + Redis projects in CI.
- Fix Yarn workspace metadata for generated API and shared configuration packages.

## 0.2.0

- Add interactive stack selection, Redis cache support, dry-run mode, and generated-project CI.
