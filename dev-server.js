var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

// Get Host Config Data
var host = require("./host.config");

var compiler = webpack(config);

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    //**** Start the server from specific path of project ****
    contentBase: config.output.path, // "./dist" - see webpack.config.js the output path in dev case
    // Hot Module Reload
    hot: true,
    historyApiFallback: true,
    //The target file using in
    filename: config.output.filename,
    publicPath: config.output.publicPath,
    // display no info to console (only warnings and errors)
    noInfo: true,
    // display nothing to the console
    quiet: false,
    // Make the colors for the terminal logs
    stats: {
        colors: true
    }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('*', function (req, res, next) {
    var filename = path.join(compiler.outputPath,'index.html');
    compiler.outputFileSystem.readFile(filename, function(err, result){
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
