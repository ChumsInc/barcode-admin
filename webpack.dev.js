const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');


const localProxy = {
    target: {
        host: 'localhost',
        protocol: 'http:',
        port: 8081
    },
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        allowedHosts: 'auto',
        historyApiFallback: true,
        static: [
            {directory: path.join(process.cwd(), 'public'), watch: false},
            {directory: process.cwd(), watch: false}
        ],
        hot: true,
        proxy: [
            {
                context: ['/api', '/images', '/node-modules', '/sage', '/version'],
                ...localProxy
            }
        ],
        watchFiles: 'src/**/*',
    },
    devtool: 'eval-source-map',
    plugins: [
        // new BundleAnalyzerPlugin(),
    ]
});
