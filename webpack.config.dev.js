var path = require('path');

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');

var host = require("./host.config");
var hostLocalAccess = "http://" + host.hostName + ":" + host.hostPort;
var hostNetworkAccess = "http://" + host.hostLanIP + ":" + host.hostPort;

process.env.NODE_ENV = 'development';

module.exports = {
  performance: {hints: false},
  devtool: 'source-map',
  externals: {},
  entry: {
    appBundle: [
      'webpack-hot-middleware/client?reload=true',
      './src/js/index.js'
    ],
    vendorBundler: [
      'react','react-dom','react-motion','react-foundation',
      'redux','react-router','react-router-redux','history',
      'styled-components','webfontloader','mobile-detect',
      'trianglify','pixi.js','gsap','snapsvg'
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true)
      }
    }),
    // // If you re not using that, the vendor will be still kept in appBundle
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendorBundler',
    // }),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      favicon: './src/assets/images/favicon.ico',
      template: './src/index.html'
    }),
    new CopyWebpackPlugin([
      { from: './.htaccess', to: './[name].[ext]' },
      { from: './src/assets/documents/*.*', to: './[name].[ext]'}
    ]),
    // new BundleAnalyzerPlugin({
    //   // Can be `server`, `static` or `disabled`.
    //   // In `server` mode analyzer will start HTTP server to show bundle report.
    //   // In `static` mode single HTML file with bundle report will be generated.
    //   // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
    //   analyzerMode: 'server',
    //   // Host that will be used in `server` mode to start HTTP server.
    //   analyzerHost: host.hostLanIP,
    //   // Port that will be used in `server` mode to start HTTP server.
    //   analyzerPort: 8888,
    //   // Path to bundle report file that will be generated in `static` mode.
    //   // Relative to bundles output directory.
    //   reportFilename: 'report.html',
    //   // Automatically open report in default browser
    //   openAnalyzer: false,
    //   // If `true`, Webpack Stats JSON file will be generated in bundles output directory
    //   generateStatsFile: false,
    //   // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
    //   // Relative to bundles output directory.
    //   statsFilename: 'stats.json',
    //   // Options for `stats.toJson()` method.
    //   // For example you can exclude sources of your modules from stats file with `source: false` option.
    //   // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
    //   statsOptions: null,
    //   // Log level. Can be 'info', 'warn', 'error' or 'silent'.
    //   logLevel: 'info'
    // })
  ],
  resolve: {
    modules: [
      path.resolve(__dirname + '/bower_components'),
      path.resolve(__dirname + '/node_modules'),
      path.resolve(__dirname + '/src/js/vendor')
    ],
    alias: {
      Images: path.resolve(__dirname+'/src/assets/images/'),
      Documents: path.resolve(__dirname+'/src/assets/documents/')
    }
  },
  module: {
    rules: [
      // Fix SnapSVG Import Issue
      {
        test: require.resolve('snapsvg'),
        use: 'imports-loader?this=>window,fix=>module.exports=0'
      },
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        use: ['react-hot-loader', 'babel-loader'],
        exclude: [/node_modules/]
      },
      {
        // We dont need extract text plugin here since
        // it wont work well with hot loader module
        // otherwise it only has meaning when using extractTextPlugin in production
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader?sourceMap&importLoaders=1','postcss-loader', "sass-loader?sourceMap"],
        exclude: [/node_modules/]
      },
      {
        test: /(\.eot(\?v=\d+\.\d+\.\d+)?$|\.pdf$)/,
        use: 'file-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.(woff|woff2)$/,
        use: 'url-loader?prefix=font/&limit=5000',
        exclude: [/node_modules/]
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/octet-stream',
        exclude: [/node_modules/]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&mimetype=image/svg+xml',
        exclude: [/node_modules/]
      },
      {
        // Any string contain ToURL
        // For All File start with ToURL
        test: /^.*(ToURL).*\.png$|^.*(ToURL).*\.jpe?g$|^.*(ToURL).*\.gif$/,
        use: 'url-loader',
        exclude: [/node_modules/]
      },
      {
        // Any string not contain ToURL
        // ^((?!xxx).)*$ is Match string that doesnt contain xxx
        // Explain ^ is begin string
        // ^()*$ Match character in group ()
        // ^(.)*$ Match any character
        // ^((.).)*$ Match any two characters
        // ^((A).)*$ Match any group 2 characters start with A exp: AB A8 ... is matched
        // ^((?!A).)*$ Match any group 2 character that not start with A
        // (?!ABC) mean negative look ahead, mean if any matched ABC with consider no-matched
        // ^((?!ABC).)* mean any group start with ABC will be no matched
        // For All File start without ToURL
        test: /^((?!ToURL).)*\.png$|^((?!ToURL).)*\.jpe?g$|^((?!ToURL).)*\.gif$/,
        use: 'url-loader?limit=10000',
        exclude: [/node_modules/]
        // In Regex
        // Multipying + or * is only not for 1 character like . a b c
        // We can use Multiplying for a group of character like ab abc ab. a.b
        // (a.b)* is search for any group of 3 character
        // that has a first and then any character and then b last
        // so a8b aOb a_b matched but not x_b or a_I

        // Meaning of quantity: '(ta)*' mean nothing or 'ta' or 'tata' or 'tatata' ... 0 - infinite
        // Meaning of quantity: 'xe+' mean 'xe' or 'xee' or 'xeeeeeeee' ... 1 - infinite
        // Meaning of quantity:  '(ta)?xe?' mean 'x' or 'tax' or 'xe' or 'taxe' 0 or 1
        // Meaning of quantity: '(ta){2}xxO{2,3} mean 'tataxxOO' or 'tataxxOOO'
        // test --> ^((t).)* return infinite because the no end for that match
        // test --> ^((t).)*$ return 0 match
        // 1: it found te from the beginning match with (t).
        // 2: but the quantity is * mean ^(t).(t). ...$ the string should ^tetytbtc$ will be matched
        // 3: so test doesnt match with ^t.t.$
        // test --> ^((t).)*st will return 1 match that is 'test'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: hostNetworkAccess + '/',
    filename: '[name].js'
  }
};
