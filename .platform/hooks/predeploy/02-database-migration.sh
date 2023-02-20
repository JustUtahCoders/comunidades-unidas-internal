#!/bin/bash
pnpm exec db-migrate up --env prod --verbose
echo "Database migrations finished"