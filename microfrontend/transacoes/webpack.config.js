const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { container: { ModuleFederationPlugin } } = require('webpack');

module.exports = {
  entry: './src/bootstrap.js',
  mode: 'development',
  devServer: {
    port: 8082,
    historyApiFallback: true
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'transacoes',
      filename: 'remoteEntry.js',
      exposes: {
        './TransacoesApp': './src/TransacoesApp.jsx'
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false }
      }
    }),
    new HtmlWebpackPlugin({ template: './src/public/index.html' })
  ]
};