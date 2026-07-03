import { spawnSync } from 'child_process';

const managers = [
  { name: 'bun', install: ['install'], build: ['run', 'build'] },
  { name: 'yarn', install: ['install'], build: ['build'] },
  { name: 'npm', install: ['install'], build: ['run', 'build'] },
];

const available = managers.find((m) => spawnSync(m.name, ['--version'], { stdio: 'ignore' }).status === 0);
if (!available) {
  console.error('No package manager found (npm, bun, yarn).');
  process.exit(1);
}

console.log(`Using ${available.name} for one-command setup...`);

const installResult = spawnSync(available.name, available.install, { stdio: 'inherit' });
if (installResult.status !== 0) process.exit(installResult.status || 1);

const buildResult = spawnSync(available.name, available.build, { stdio: 'inherit' });
if (buildResult.status !== 0) process.exit(buildResult.status || 1);

console.log('Setup complete. Launch with: os-oracle (or npm run tui)');
