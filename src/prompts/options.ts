import { checkbox, confirm, input, select } from "@inquirer/prompts";
import { FRONTEND_APPS, PRESETS } from "../constants.js";
import type { AppName, CliOptions, StackOptions } from "../types.js";
import { validateGoModule } from "../utils/validation.js";

const choice = (name: string, value: string) => ({ name, value });

export async function collectOptions(
  projectName: string,
  targetDir: string,
  flags: CliOptions
): Promise<StackOptions> {
  const preset =
    flags.preset ??
    ((await select({
      message: "Application preset:",
      choices: [
        choice("Customer + API + Admin + Partner", "full"),
        choice("Customer + API + Partner", "customer-partner"),
        choice("Customer + API + Admin", "customer-admin"),
        choice("Customer + API", "customer-api"),
        choice("Custom", "custom"),
      ],
    })) as StackOptions["preset"]);
  const apps: AppName[] =
    preset === "custom"
      ? ([
          ...(flags.apps ??
            (await checkbox({
              message: "Applications to generate:",
              choices: FRONTEND_APPS.map((app) => ({
                name: app,
                value: app,
                checked: app === "customer",
              })),
              required: true,
            }))),
          "api",
        ] as AppName[])
      : [...PRESETS[preset]];
  const frontend =
    flags.frontend ??
    ((await select({
      message: "Frontend stack:",
      choices: [
        choice("React + TypeScript + Vite", "vite"),
        choice("Next.js + TypeScript + App Router", "next"),
      ],
    })) as StackOptions["frontend"]);
  const backend =
    flags.backend ??
    ((await select({
      message: "Backend stack:",
      choices: [choice("Go + Gin", "go"), choice("Node.js + NestJS", "nest")],
    })) as StackOptions["backend"]);
  const ui =
    flags.ui ??
    ((await select({
      message: "UI library:",
      choices: [
        choice("Material UI", "mui"),
        choice("Tailwind CSS", "tailwind"),
        choice("Plain CSS", "css"),
      ],
    })) as StackOptions["ui"]);
  const database =
    flags.database ??
    ((await select({
      message: "Database:",
      choices: [
        choice("PostgreSQL", "postgres"),
        choice("MySQL", "mysql"),
        choice("SQLite", "sqlite"),
        choice("No database", "none"),
      ],
    })) as StackOptions["database"]);
  const cache =
    flags.cache ??
    ((await select({
      message: "Add cache?",
      choices: [choice("Use Redis cache", "redis"), choice("No cache", "none")],
    })) as StackOptions["cache"]);
  const nonInteractive = Boolean(
    flags.preset ||
    flags.frontend ||
    flags.backend ||
    flags.ui ||
    flags.database ||
    flags.cache ||
    flags.packageManager
  );
  const auth =
    flags.auth ??
    (nonInteractive
      ? "none"
      : ((await select({
          message: "Authentication:",
          choices: [
            choice("No authentication", "none"),
            choice("JWT authentication", "jwt"),
          ],
        })) as StackOptions["auth"]));
  const crud =
    flags.crud ??
    (nonInteractive
      ? true
      : await confirm({ message: "Add a User CRUD example?", default: true }));
  const ci =
    flags.ci ??
    (nonInteractive
      ? true
      : await confirm({
          message: "Generate GitHub Actions CI?",
          default: true,
        }));
  const packageManager =
    flags.packageManager ??
    ((await select({
      message: "Package manager:",
      choices: ["pnpm", "npm", "yarn", "bun"].map((x) => choice(x, x)),
    })) as StackOptions["packageManager"]);
  const docker =
    flags.docker ??
    (await confirm({ message: "Generate Docker support?", default: true }));
  const git =
    flags.git ??
    (await confirm({ message: "Initialize a Git repository?", default: true }));
  const install =
    flags.install ??
    (await confirm({ message: "Install dependencies now?", default: true }));
  const goModule =
    backend === "go"
      ? (flags.goModule ??
        (await input({
          message: "Go module path:",
          default: `github.com/username/${projectName}/apps/api`,
          validate: validateGoModule,
        })))
      : "";
  if (backend === "go" && validateGoModule(goModule) !== true)
    throw new Error(String(validateGoModule(goModule)));
  return {
    projectName,
    targetDir,
    preset,
    apps,
    frontend,
    backend,
    ui,
    database,
    cache,
    auth,
    crud,
    ci,
    packageManager,
    docker,
    git,
    install,
    force: flags.force ?? false,
    debug: flags.debug ?? false,
    goModule,
  };
}
