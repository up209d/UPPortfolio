import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import store from './src/js/store';
import storeHistory from './src/js/store';
import App from './src/js/components/app';

import express from 'express';
import webpack from 'webpack';
import config from './webpack.config.build';
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
  filename: config.output.filename,
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

app.use(function(req, res, next){
  const filename = path.join(compiler.outputPath,'index.html');
  const content = ReactDOMServer.renderToString(
    <Provider store={store}>
      <App appHistory={storeHistory}/>
    </Provider>
  );

  console.log(content);

  // compiler.outputFileSystem.readFile(filename, function(err, result){
  //   if (err) {
  //     return next(err);
  //   }
  //   res.set('content-type','text/html');
  //   res.send(result);
  //   res.end();
  // });
  next();
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
