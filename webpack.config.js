var webpack = require('webpack');

module.exports = {
  entry: {
    app: ["./app/app.jsx"]

  },
  output: {
    path: "./public",
    filename: "bundle.js",
    publicPath:"/"
  },
  devServer: {
    inline: true,
    contentBase: "./public"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.less$/,
        loader: 'style!css!postcss?{browsers: ["last 3 versions", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"]}!less'
      }
    ]
  }
};
