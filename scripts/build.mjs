#!/usr/bin/env zx

console.log("Building...")

await $`yarn install --silent`

const options = process.argv.slice(3);
let parameters = {
  webpack: false,
  typescript: true,
  mode: "production"
}

options.map((opt, index) => {
  if (['--webpack', '-wp'].includes(opt)) parameters.webpack = true;
  if (['--dev', '-d'].includes(opt)) parameters.mode = 'development'
});

if (parameters.typescript) await $`tsc`;
if (parameters.webpack) {
  await $` webpack --mode development -o dist --output-filename eventra.js --config webpack/webpack.config.js --no-stats`
  await $` webpack --mode production -o dist --output-filename eventra.min.js --config webpack/webpack.config.js --no-stats`
}

console.log('Done!');