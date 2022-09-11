// 항상 변환할 entry와 변환후 output(파일, 절대경로)를 설정해야함

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    commentSection: BASE_JS + "commentSection.js",
  },
  plugins: [
        new MiniCssExtractPlugin({
          filename: "css/styles.css", //output CSS
        }),
      ],
  output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"), //알아서 "/"로 경로지정해줌
        clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      { //확장자, loader를 여러개를 리스트로(뒤부터실행됨)
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};