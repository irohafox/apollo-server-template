const path = require('path')
const nodeExternals = require('webpack-node-externals')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.ts$/,
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.json'
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src')
    },
    extensions: ['.ts', '.js', 'json']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'src/graphql/typedefs', to: 'typedefs' }]
    })
  ]
}
