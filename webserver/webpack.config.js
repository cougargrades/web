const path = require('path');

module.exports = {
    entry: {
        courses: path.resolve(__dirname, 'front', 'js', 'courses.jsx')
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'front', '_site', 'js')
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            include: path.resolve(__dirname, 'front', 'js'),
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }]
    },
    mode: 'production'
};


/*



*/
