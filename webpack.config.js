const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './client/src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public', 'assets', 'scripts')
    },
    devServer: {
        publicPath: '/assets/scripts/',
        contentBase: path.join(__dirname, 'server/public'),
        port: 8080
    },
    plugins:
        [
            new UglifyJsPlugin()
        ]

};
