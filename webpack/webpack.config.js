const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: './lib/index.js',
  
  output: {
    path: 'dist',
    filename: 'eventra.min.js',
    libraryTarget: "var",
    library: 'Eventra',
    path: path.resolve(__dirname, 'webpack'),
  },
};