#!/bin/bash
target_dir=$(dirname "$0")
base_dir=$(pwd)
npm install --silent --prefix "$base_dir/$target_dir"
npm run --silent --prefix "$base_dir/$target_dir" format
npm run --silent --prefix "$base_dir/$target_dir" build
node "$base_dir/$target_dir/server.cjs"