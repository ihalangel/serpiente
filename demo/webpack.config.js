var path = require('path')
// var loadCss = require('webpack-loadcss');
const port = process.env.PORT || 3000

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'index.js'),
	output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
	},
    // plugins: [loadCss],
	module: {
		rules: [
			{
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: "babel-loader"
			},
			{
                test: /\.css/,
                use: ['style-loader', 'css-loader']
			},
        ]
    },
    devServer: {
        static: {
  directory: path.resolve(__dirname, 'public'),
},

        host: 'localhost',
        port: port,
        historyApiFallback: true,
        open: true,
        hot: true,
        historyApiFallback: true,
      },
    devtool: 'inline-source-map'
}