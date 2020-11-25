const path = require('path');

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'public', 'index.js'),
    },
    mode: 'development',
    // resolve: {
    //     modules: ['./node_modules'],
    // },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),

        publicPath: '/',
    },
};
