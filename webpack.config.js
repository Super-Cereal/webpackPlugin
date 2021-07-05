const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const MarkUnusedFilesWebpackPlugin = require("./MarkUnusedFilesWebpackPlugin");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  mode: "production",
  output: {
    filename: "[name].[contenthash:8].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MarkUnusedFilesWebpackPlugin({ ignorePatterns: ["/pages"] }),
  ],
};
