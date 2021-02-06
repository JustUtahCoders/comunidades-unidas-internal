const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => ({
  entry: {
    "comunidades-unidas-internal": "./frontend/comunidades-unidas-internal.tsx",
  },
  output: {
    filename:
      process.env.RUNNING_LOCALLY === "true" ? "[name].js" : "[name].[hash].js",
    path: __dirname + "/static",
    publicPath: process.env.PUBLIC_PATH || "/static/",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx$|\.ts|\.js|\.jsx/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {},
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "kremling-loader",
            options: {},
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 9018,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    // When you need to use the React Profiler, uncomment this
    // alias: {
    //   "react-dom$": env && env.prod ? "react-dom/profiling" : 'react-dom',
    //   "scheduler/tracing": env && env.prod ? "scheduler/tracing-profiling" : 'scheduler/tracing',
    // },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: env && env.analyze ? "server" : "disabled",
    }),
    new WebpackManifestPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(argv.mode || "production"),
    }),
  ],
  optimization: {
    chunkIds: "named",
    minimize: argv.mode === "production",
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          safari10: true,
        },
      }),
    ],
  },
});
