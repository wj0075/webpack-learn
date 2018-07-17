// 动态连接库
/* 即把基础模块的代码打包进入动态连接库里，比如常见的react、vue等，当需要导入的模块再动态链接库里的时候，模块不能再次被打包。而是去动态连接库里去取*/
const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        react: ['vue'] // vue模块打包到一个动态连接库
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].dll.js', // 输出动态链接库的文件名称
        library: '_dll_[name]' // 全局变量名称
    },
    plugins: [
        new webpack.DllPlugin({
            name: '_dll_[name]', // 和output.library中一致也就是输出的manifest.json中的name值
            path: path.join(__dirname,'dist','[name].manifest.json')
        })
    ]
};

// webpack --config webpack.dll.config.js --mode production