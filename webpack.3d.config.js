const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackAssetsManifest = require('webpack-assets-manifest');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


function config(env) {
    var conf = {
        externals: {
            jquery: 'jQuery'
        },
        entry: {
            app: './client3D/app.js'
        },
        output: {
            path: path.resolve(__dirname, 'public/3d'),
            filename: '[name].[chunkhash].js'
        },
        devServer: {
            publicPath: '/',
            contentBase: path.resolve(__dirname, 'public/3d'),
            port: 3000
        },
        plugins:
            [
                new CopyWebpackPlugin([
                    {
                        from: path.resolve(__dirname, 'client3D/assets'),
                        to: path.resolve(__dirname, 'public/3d/assets')
                    }
                ]),
                new CleanWebpackPlugin(['public/3d/*']),
                new HtmlWebpackPlugin({
                    template: './client3D/index.html'
                }),
                new WebpackAssetsManifest({}),
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