module.export=({ file, options, env }) => ({
  parser: file.extname === '.sss' ? 'sugarss' : false,
  plugins: {
    'postcss-reporter':{},
   //'postcss-import': { root: file.dirname },
    'postcss-preset-env': options['postcss-preset-env'] ? options['postcss-preset-env'] : false,
    
     // Convert px to rem almost everywhere, similar to sass's "remy" macro
   // 'postcss-pxtorem':{ propList: ['*', '!border', '!box-shadow'] },
    'postcss-browser-reporter':{ disabled: false },    
    'postcss-url':{},
    'cssnano': env === 'production' ? options.cssnano : false
  }
})