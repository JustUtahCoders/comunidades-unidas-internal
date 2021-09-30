#!/bin/bash
# echo "Installing pnpm"
# npm i -g pnpm
# app="$(/opt/elasticbeanstalk/bin/get-config container -k app_staging_dir)";
# cd "${app}";
echo "cwd"
pwd
echo "Installing dependencies with pnpm"
rm -rf node_modules
npx pnpm install --frozen-lockfile