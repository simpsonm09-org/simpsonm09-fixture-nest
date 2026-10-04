#!/usr/bin/env node
// Regenerate docs/openapi.json by running the OpenAPI generator spec with
// WRITE_OPENAPI=1. The generator lives next to the other tests so the drift
// check and the writer share one source; this script only sets the flag in a
// way that works on Windows and POSIX shells.
import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['--no-install', 'vitest', 'run', 'tests/openapi.spec.ts'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, WRITE_OPENAPI: '1' },
});

process.exit(result.status ?? 1);
