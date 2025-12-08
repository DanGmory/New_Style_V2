const path = require('path');

module.exports = {
  mode: 'development',
  entry: './public/dashboard-react/main.jsx',
  output: {
    path: path.resolve(__dirname, 'public/dashboard-react'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'source-map',
};