import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from './webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';


// Get Host Config Data
const host = require("./host.config");
const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  //**** Start the server from specific path of project ****
  contentBase: config.output.path, // "./dist" - see webpack.config.js the output path in dev case
  // Hot Module Reload
  hot: true,
  historyApiFallback: true,
  //The target file using in
  publicPath: config.output.publicPath,
  // display no info to console (only warnings and errors)
  noInfo: false,
  // display nothing to the console
  quiet: true,
  // Make the colors for the terminal logs
  stats: {
    colors: true
  }
}));

app.use(webpackHotMiddleware(compiler));

// If we meet the readFileSystem error, that because of html webpack plugin
// failed to make index.html file, it cannot run the parse since some webpack compiling error
// by your code in src, so check some require function in your src code to see whether
// webpack is failed to require any file path
app.use(function (req, res, next) {
  let filename = path.join(compiler.outputPath,'index.html');
  compiler.outputFileSystem.readFile(filename, 'utf-8', function(err, result){
    if (err) {
      return next(err);
    }
    res.set('content-type','text/html');
    res.send(result);
    res.end();
  });
});

app.listen(host.hostPort, host.hostIP, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("----------------------------------------------------------");
  console.log();
  console.log('\x1b[32m',"Server Started at PublicPath: " + config.output.publicPath);
  console.log('\x1b[37m','');
  console.log("----------------------------------------------------------");
  console.log("Please, use the PublicPath above to work with browser for stability!");
  console.log();
});
