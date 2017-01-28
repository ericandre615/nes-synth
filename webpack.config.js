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
      },
      {test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff&name=./fonts/[name].[ext]" },
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream&name=./fonts/[name].[ext]" },
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml&name=./fonts/[name].[ext]" },
      {test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=100000' }
    ]
  }
};
