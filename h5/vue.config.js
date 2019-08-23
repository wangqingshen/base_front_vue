const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const isProduction = process.env.VUE_APP_MODE === 'production' || process.env.VUE_APP_MODE === 'alpha'
module.exports = {
    // publicPath: process.env.VUE_APP_MODE === 'production'?'/vue/yswap/':process.env.VUE_APP_MODE === 'alpha'?'./':'/',
    publicPath: process.env.VUE_APP_MODE === 'production'?'./':'./',
    outputDir: 'dist',
    lintOnSave: false,
    productionSourceMap: false,
    configureWebpack: config => {
        if (isProduction) {
            config.externals = {
                'vuex' : 'Vuex',
                'axios' : 'axios'
            },
            config.plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }))
        }
    },
    devServer: {
        port: 8081, // 端口号
        host: 'localhost',
        https: false, // https:{type:Boolean}
        open: false, //配置自动启动浏览器
        proxy: {
          '/shop': {
            target: 'https://shop.wsyjcs.cn/api',
            // target: 'http://www.18ycg.com/api',
            // target: 'http://192.168.0.156/api',
            // target: 'http://192.168.0.160/api',
            // target: 'http://192.168.0.165/api,
            // target: 'http://shop.cloudshop.com/api',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
              '^/shop': '/shop'
            }
          }
        }, 
    }
}