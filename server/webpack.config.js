var webpack = require('webpack');
var path = require('path');

// variables
var isProduction = process.argv.indexOf('-p') >= 0;
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');
// Try the environment variable, otherwise use root
const ASSET_PATH = process.env.ASSET_PATH || '/';
const NodemonPlugin = require( 'nodemon-webpack-plugin' ) // Ding
// plugins
var nodeExternals = require('webpack-node-externals');
const serverConf={
  mode:"development",
  context: path.join(__dirname, './src'),
  entry: {
    main: './app-server.ts',
/*     vendor : [
      'apollo-server-express',
      'graphql',
      'nedb'
    ] */
  },
  output: {
    path: outPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    library:'bundle.js',
    libraryTarget: "commonjs2",
    publicPath: '/'
  },
  target:'async-node',
  resolve: {
    extensions: ['.js', '.ts'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    modules: [
      'node_modules',
      'src',
    ],
    //mainFields: ['main' ]
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
      //  exclude: /\/node_modules\//,
        use: 'awesome-typescript-loader',
      },
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: []
      }
    ]
  },
  plugins: [
    new NodemonPlugin(), // Dong
],
node: { __dirname: false },
 optimization: { 
  namedChunks: true,
 // runtimeChunk: "single",
    splitChunks: {
      
      chunks: 'async',
      maxInitialRequests: Infinity,
      minSize: 0,
   cacheGroups: {
     vendor: {
       test: /[\\/]node_modules[\\/]/,
       name: 'vendor',
       enforce: true,
       //chunks: 'all'
     },
   },
 }, 
},  
//externals: [nodeExternals()]
}


module.exports = [serverConf]