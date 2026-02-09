#!/bin/bash
set -e

echo "=== Installing pnpm ==="
npm install -g pnpm

echo "=== Installing dependencies ==="
cd apps/api
pnpm install

echo "=== Building API ==="
pnpm build

echo "=== Build complete ==="
ls -la dist/
