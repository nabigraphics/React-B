//////////////////////
// Webpack4 Config ///
//////////////////////

const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

// Directory Path
const BUILD_DIR = path.resolve(__dirname, "src/public/js");
const APP_DIR = path.resolve(__dirname, "src/app");
const SCSS_DIR = path.resolve(__dirname, "src/scss");
const LESS_DIR = path.resolve(__dirname, "src/less");
const CSS_DIR = path.resolve(__dirname, "src/public/css");

// Webpack Plugins
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// Extract SASS
const extractSass = new MiniCssExtractPlugin({
  filename: `${CSS_DIR}/[name].css`
});

// Ant Design Config
const lessToJs = require("less-vars-to-js");
const themeVariables = lessToJs(
  fs.readFileSync(`${LESS_DIR}/ant-theme-vars.less`, "utf8")
);
console.log(APP_DIR);
const config = {
  entry: {
    index: [`${APP_DIR}/index.jsx`],
    // style: [`${SCSS_DIR}/index.scss`]
  },

  output: {
    path: BUILD_DIR,
    filename: "[name].js",
    publicPath: "/public/"
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        include: SCSS_DIR,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.less?/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "less-loader",
            options: {
              modifyVars: themeVariables,
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.jsx?/,
        include: APP_DIR,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              [
                "import",
                { libraryName: "antd", libraryDirectory: "es", style: true }
              ]
            ]
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: "babel-loader" }
      }
    ]
  },
  plugins: [extractSass],
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".json", ".jsx", ".css", ".scss"]
  }
};

if (process.env.NODE_ENV === "production") {
  config.entry = {
    ...config.entry,
    vender: [
      "react",
      "react-dom",
      "babel-polyfill",
      "mobx",
      "mobx-react",
      "antd"
    ]
  };
  config.optimization = {
    splitChunks: {
      chunks: "all",
      name: "vender"
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  };
}

module.exports = config;
