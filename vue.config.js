const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // externals: process.env.NODE_ENV === 'production' ? {
  //   'element-plus':''
  // }: {},
  configureWebpack: config => {
    if( process.env.NODE_ENV === 'production'){
      config.externals = {'element-plus':'ElementPlus'}
    }
  }
})
