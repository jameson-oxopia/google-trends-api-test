var path = require('path');

module.exports = {
    entry: "./src/app.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        inline:true,
        port: 8008
    }
}