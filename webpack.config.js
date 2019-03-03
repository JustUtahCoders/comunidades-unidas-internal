const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/comunidades-unidas-internal.tsx',
  output: {
    filename: 'comunidades-unidas-internal.js',
    path: __dirname + '/dist',
  },
  devtool: 'sourcemap',
  module: {
    rules: [
      {test: /\.tsx$|\.ts|\.js|\.jsx/, use: 'babel-loader', exclude: /node_modules/},
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    index: 'index.html',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
}