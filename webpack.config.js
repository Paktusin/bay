const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


function config(env, argv) {
    const config = {
        entry: {
            app: './client/src/index.js'
        },
        output: {
            path: path.resolve(__dirname, 'public/dist'),
            filename: "[name].[chunkhash].js",
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'client/src/index.html'),
                filename: path.resolve(__dirname,  'public/index.html'),
            }),
            new CleanWebpackPlugin(path.join(__dirname, 'public', 'dist'))
        ],

        devServer: {
            contentBase: path.join(__dirname, 'public'),
            port: 3000
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: '/node_modules/',
                    use: {
                        loader: 'babel-loader'
                    }
                },
            ]
        }
    };
    if (argv.mode === 'production') {
        config.plugins.push(new UglifyJsPlugin())
    }
    return config;
}

module.exports = config;