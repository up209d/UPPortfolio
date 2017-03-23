var path = require('path');
var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');

var host = require("./host.config");
var hostLocalAccess = "http://" + host.hostName+":"+host.hostPort;
var hostNetworkAccess = "http://" + host.hostLanIP+":"+host.hostPort;

process.env.NODE_ENV =  'development';

module.exports = {
    performance: { hints: false },
    devtool: 'source-map',
    externals: {

    },
    entry: [
        './src/js/index.js',
        'webpack-hot-middleware/client?reaload=true'
    ],
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        loaders: [
            {test: /\.jsx?$/, include: path.join(__dirname, 'src'), loaders: ['react-hot-loader','babel-loader'], exclude: [/node_modules/]},
            {test: /(\.css)$/, loaders: ['style-loader', 'css-loader'], exclude: [/node_modules/]},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file', exclude: [/node_modules/]},
            {test: /\.(woff|woff2)$/, loader: 'url-loader?prefix=font/&limit=5000', exclude: [/node_modules/]},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream', exclude: [/node_modules/]},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml', exclude: [/node_modules/]}
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: hostNetworkAccess + '/',
        filename: '[name].js'
    }

};