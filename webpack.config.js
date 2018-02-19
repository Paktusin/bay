const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

function config(env) {
    var conf = {
        entry: './client/src/index.js',
        output: {
            filename: 'bundle.js',
            path: path.join(__dirname, 'public', 'assets', 'scripts')
        },
        devServer: {
            publicPath: '/assets/scripts',
            contentBase: path.join(__dirname, '/public'),
            port: 3000
        },
        plugins:
            [
                new UglifyJsPlugin(),
                new webpack.DefinePlugin({
                    'process.env': {
                        production: (env === 'prod')
                    }
                })
            ]
    };
    if (env === 'prod') {
        conf.plugins.push(new UglifyJsPlugin())
    }
    return conf;
};


module.exports = config;