#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push
# Build lib declaration files (lib/api-client-react, lib/api-zod, lib/db)
# These are gitignored but needed for typecheck in artifact packages
tsc --build
