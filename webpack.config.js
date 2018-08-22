const {join} = require('path');
const merge = require('lodash/merge');
const cloneDeep = require('lodash/cloneDeep');

const base = {
  target: 'web',
  entry: join(__dirname, 'src', 'LazyGetter.ts'),
  devtool: 'none',
  output: {
    path: join(__dirname, 'dist', 'umd'),
    libraryTarget: 'umd',
    library: 'LazyGet'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: './tsconfig.esm5.json',
            useCache: true,
            cacheDirectory: join(__dirname, 'node_modules', '.cache', '.awcache')
          }
        }]
      }
    ]
  }
};

module.exports = [
  merge(cloneDeep(base), {mode: 'development', output: {filename: 'LazyGetter.js'}}),
  merge(cloneDeep(base), {mode: 'production', output: {filename: 'LazyGetter.min.js'}})
];