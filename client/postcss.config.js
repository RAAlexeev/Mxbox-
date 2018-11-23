module.exports = ({ file, options, env }) => ({  
  map: env==='development'?'inline':false,
  parser: file.extname === '.sss' ? 'sugarss' : false,
    plugins: [
      require('postcss-import'),
      require('postcss-url'),
      require('postcss-color-function'),
      require('postcss-preset-env')({
        browsers: 'last 2 versions',
        stage: 0,
      }),
    ],
  
/*   plugins: {
  //  'postcss-color-function':{},//options['postcss-color-function'] ? options['postcss-color-function'] : false,
   // 'postcss-reporter':{},
   'postcss-import': {},
   // 'postcss-preset-env':options['postcss-preset-env'] ? options['postcss-preset-env'] : false,
   'postcss-preset-env': {
          browsers: 'last 2 versions',
      },
     // Convert px to rem almost everywhere, similar to sass's "remy" macro
   // 'postcss-pxtorem':{ propList: ['*', '!border', '!box-shadow'] },
    //'postcss-browser-reporter':{ disabled: false },    
    //'postcss-url':{},
    'cssnano': env === 'production'? options.cssnano : false
  } */
});
