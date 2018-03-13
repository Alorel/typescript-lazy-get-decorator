const {join} = require('path');

module.exports = {
  target: 'web',
  entry: join(__dirname, 'src', 'LazyGetter.ts'),
  output: {
    path: join(__dirname, 'dist', 'umd'),
    filename: 'LazyGetter.js',
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
  },
  mode: 'production'
};