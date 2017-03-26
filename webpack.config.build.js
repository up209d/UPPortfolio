const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'production';

module.exports = {
  performance: {hints: false},
  devtool: 'source-map',
  externals: {},
  entry: {
    appBundle: [
      './src/js/index.js'
    ],
    vendorBundler: [
      'trianglify',
      'pixi.js',
      'gsap',
      'snapsvg'
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
      test: /\.jsx?$/,
      comment: false,
      compress: true,
      mangle: true,
      sourceMap: false,
      // exclude: [/node_modules/,/bower_components/]
    }),
  ],
  module: {
    loaders: [
      // Fix SnapSVG Import Issue
      {
        test: require.resolve('snapsvg'),
        loader: 'imports-loader?this=>window,fix=>module.exports=0'
      },
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loaders: ['react-hot-loader', 'babel-loader'],
        exclude: [/node_modules/]
      },
      {
        test: /\.(css|scss)$/,
        loaders: ['style-loader', 'css-loader?sourceMap', "sass-loader?sourceMap"],
        exclude: [/node_modules/]
      },
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader', exclude: [/node_modules/]},
      {test: /\.(woff|woff2)$/, loader: 'url-loader?prefix=font/&limit=5000', exclude: [/node_modules/]},
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
        exclude: [/node_modules/]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
        exclude: [/node_modules/]
      },
      {test: /\.png$|\.jpe?g$|\.gif$/, loader: 'file-loader', exclude: [/node_modules/]},
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '',
    filename: '[name].js'
  }

};
