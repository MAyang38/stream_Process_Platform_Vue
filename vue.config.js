module.exports = {
 configureWebpack: { externals: {
   'BMap': 'BMap',
   // 'BMap_Symbol_SHAPE_POINT':'BMap_Symbol_SHAPE_POINT'
   BMapLib: "BMapLib"
  } },

 publicPath: '/',
 // resolve: {
 //  extensions: ['.js', '.vue', '.json'],
 //   alias: {
 //    'vue$': 'vue/dist/vue.esm.js',
 //    '/src': resolve('src'),
 //    '/libs': path.resolve(__dirname, '../src/libs'),
 //    '/static': resolve('static'),
 //   }
 // }
}