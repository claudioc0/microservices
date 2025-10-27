const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { container: { ModuleFederationPlugin } } = require('webpack');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    port: 8080,
    historyApiFallback: true
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        "contas": "contas@http://localhost:8081/remoteEntry.js",      
        "transacoes": "transacoes@http://localhost:8082/remoteEntry.js"
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ]
};