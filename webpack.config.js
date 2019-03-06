module.exports = {
  mode: 'development',
  entry: './frontend/comunidades-unidas-internal.tsx',
  output: {
    filename: 'comunidades-unidas-internal.js',
    path: __dirname + '/static',
    publicPath: process.env.PUBLIC_PATH || '/static/',
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
    port: 9018,
    publicPath: 'http://localhost:9018/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
}