#!/usr/bin/env zx

const options = process.argv.slice(3);
let startParameters = {
  build: false,
  dev: false,
  token: null,
}

options.map((opt, index) => {
  if (['--build', '-b'].includes(opt)) startParameters.build = true;
  if (['--dev'].includes(opt)) startParameters.dev = true;
  if (['--token', '-t'].includes(opt)) {
    const token = options[index+1];

    if (!token) throw new Error("Token must be defined to use token option.")
    else startParameters.token = token;
  }
});