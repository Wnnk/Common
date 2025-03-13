const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  /* 模式 */
  mode: "development",
  /* 入口文件 */
  entry: "./main.js",
  /*  */
  devtool: "eval-cheap-module-source-map",
  output: {
    /* 输出文件名 */
    filename: "bundle.js",
    /* 输出路径 */
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    /* 静态资源目录 */
    static: path.join(__dirname, "dist"),
    /* gzip压缩 */
    compress: true,
    /* 端口 */
    port: 9000,
    /* 热更新 */
    hot: true,
  },
  module: {
    rules: [
      {
        /* 匹配文件 */
        test: /\.css$/,
        /* 使用loader, loader的顺序是从右到左 */
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.json$/,
        type: "json",
      },
      /* webpakc5内置图像处理 */
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    /* 热更新插件 */
    new webpack.HotModuleReplacementPlugin(),
    /* vue插件 */
    new VueLoaderPlugin(),
    /* html插件 */
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
