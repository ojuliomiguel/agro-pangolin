const { existsSync } = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const srcDataSource = path.join(
  rootDir,
  "src/shared/infrastructure/database/data-source.ts",
);
const distDataSource = path.join(
  rootDir,
  "dist/shared/infrastructure/database/data-source.js",
);

const command = process.argv[2];
const args = process.argv.slice(2);

const commandsThatNeedDataSource = new Set([
  "migration:generate",
  "migration:run",
  "migration:revert",
  "migration:show",
]);

function resolveExecution() {
  if (existsSync(srcDataSource)) {
    return {
      bin: "typeorm-ts-node-commonjs",
      dataSource: "src/shared/infrastructure/database/data-source.ts",
    };
  }

  if (existsSync(distDataSource)) {
    return {
      bin: "typeorm",
      dataSource: "dist/shared/infrastructure/database/data-source.js",
    };
  }

  throw new Error(
    "Nenhum data source encontrado em src/ ou dist/. Rode o build ou verifique a estrutura do projeto.",
  );
}

function toExecutable(bin) {
  const executable = process.platform === "win32" ? `${bin}.cmd` : bin;
  return path.join(rootDir, "node_modules", ".bin", executable);
}

const execution = resolveExecution();
const finalArgs =
  command && commandsThatNeedDataSource.has(command)
    ? [...args, "-d", execution.dataSource]
    : args;

const result = spawnSync(toExecutable(execution.bin), finalArgs, {
  cwd: rootDir,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
