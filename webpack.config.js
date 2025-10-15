// var nodeExternals = require('webpack-node-externals');
// var loadCss = require('webpack-loadcss');
// var path = require('path');

// module.exports = {
//     mode: 'production',
//     target: 'node',
//     externals: [nodeExternals()],
//     entry: path.join(__dirname, 'src', 'SnakeGame.jsx'),
//   output: {
//         path: path.resolve('lib'),
//         filename: 'snake.js',
//         libraryTarget: 'commonjs2',
//     },
//     plugins: [loadCss],
//   module: {
//     rules: [
//       {
//                 test: /\.(js|jsx)?$/,
//                 exclude: /(node_modules)/,
//                 use: "babel-loader"
//       },
//       {
//                 test: /\.css/,
//                 use: ['style-loader', 'css-loader']
//       },
//     ]
//     },
// }




const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/SnakeGame.jsx'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    clean: true, // limpia build vieja
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
};
