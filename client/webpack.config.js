var webpack = require('webpack');
var path = require('path');

// variables
var isProduction = process.argv.indexOf('-p') >= 0;
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const reactToolboxVariables = require('./reactToolbox.css');



 const clientConf = {
  mode:"development",
  context: sourcePath,
  entry: {
    main: './index.ts',
  },
  output: {
    path: outPath,
    devtoolModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]',
    filename: '[name]-[hash].js',
    publicPath: '/'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main']
  },
  module: {
    rules: [
      // .ts, .tsx
      {      
        test: /\.tsx?$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: 'awesome-typescript-loader',
      },
      // css
      {
        /* test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ],
 */
        test: /\.css$/,
      
         // use: ExtractTextPlugin.extract({
        //  fallback: 'style-loader',
        use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: !isProduction,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
                
              }
            },
            {
              loader: 'postcss-loader',
             
              options: {
                
                config:{
                    ctx:{
                      'postcss-preset-env': {
                        SourceMap :"inline",
                          stage: 0,        // enables all postcss-preset-env features
                          exec:true,
                         // importFrom:['reactToolbox.css.js'],
                          features: {
                            'color-mod-function': { unresolved: 'warn' },
                            'custom-properties': {
                              preserve: false, // returns calculated values instead of variable names
                              variables: reactToolboxVariables
                            },
                          //'nesting-rules': true
                        
                         }
                      }
                  } 
                }
              }
          }
          ]
      //  }) 
      },
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: []
      },
      // static assets
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.png$/, use: 'url-loader?limit=10000' },
      { test: /\.jpg$/, use: 'file-loader' },
    ],
  },
  plugins: [
    
     new ExtractTextPlugin({
      filename: 'styles.css',
      disable: !isProduction
    }),
    new HtmlWebpackPlugin({
      template: 'assets/index.html'
    }),
    new CopyWebpackPlugin([
      { from: '../static' }
    ])
  ],
  devServer: {
    contentBase: sourcePath,
    hot: true,
    host:"0.0.0.0",
    port:3000,
    stats: {
      warnings: true
    },
  },
 optimization: { 

  runtimeChunk: "single",
  splitChunks: {
   chunks: 'async',
   maxInitialRequests: Infinity,
   minSize: 0,
   cacheGroups: {
     vendor: {
       test: /[\\/]node_modules[\\/]/,
       name: 'vendor',
       enforce: true,
       chunks: 'initial'
     },
   },
 },
}, 
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty',
    
  }
};

const serverConf={
  context: path.join(__dirname, './src/server'),
  mode:"development",
  entry: {
    main: './index.ts',
  },
  output: {
    path: outPath,
    filename: 'server.js',
    publicPath: '/'
  },
  devtool:'eval-source-map',
  target:'async-node',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module','main']
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader?configFileName=server.tsconfig.json',
      },
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [  ]
      }
    ]
  }
}

module.exports = [clientConf]