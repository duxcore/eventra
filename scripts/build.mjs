#!/usr/bin/env zx

console.log("Building...")

await $`yarn install --silent`

const options = process.argv.slice(3);
let parameters = {
  webpack: false,
  typescript: true
}

options.map((opt, index) => {
  if (['--webpack', '-wp'].includes(opt)) parameters.webpack = true;
});

if (parameters.typescript) await $`tsc`;
if (parameters.webpack) await $` webpack --mode development --config webpack.config.js`

console.log('Done!');