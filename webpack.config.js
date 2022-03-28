const path = require('path')
const nodeExternals = require('webpack-node-externals')
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  entry: './bin/index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'my_node_cli.js',
  },
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            sourceMaps: true,
            inputSourceMap: true,
            presets: [['@babel/preset-env']],
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      minSize: 10,
      minChunks: 1,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    emitOnErrors: false,
  },
}
