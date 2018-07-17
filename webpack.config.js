const path = require('path');
const webpack = require('webpack');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const lessExtract = new ExtractTextPlugin('css/less.css');
const sassExtract = new ExtractTextPlugin('css/sass.css');
const os = require('os');
const interfaces = os.networkInterfaces();
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
let IPv4,hostname;
for(let devName in interfaces ) {
    let iface = interfaces[devName];
    for(let i=0;i<iface.length;i++) {
        let alias = iface[i];
        if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
            hostname = alias.address;
            // return false;
        }
    }
}

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),//开发服务运行时的文件根目录
        host: hostname,//主机地址
        port: 9090,//端口号
        compress: true//开发服务器是否启动gzip等压缩
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                use:{
                    loader:'babel-loader',
                    query:{
                        presets:["env","stage-0"]
                    }
                }
            },
            {
                test: /\.css$/,
                // loader: ['style-loader', 'css-loader']
                use: ExtractTextPlugin.extract({
                    use:'css-loader'
                })
            },
            {
                test: /\.scss$/,
                use: sassExtract.extract({
                    use: ['css-loader','sass-loader']
                })
            },
            {
                test:/\.(jpg|png|gif|svg)$/,
                use:'url-loader',
                include:path.join(__dirname,'./src'),
                exclude: /node_module/
            }
        ],
    },
    plugins: [
        new UglifyjsWebpackPlugin(),
        new ExtractTextPlugin('css/index.css'),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'src','index.html'),
            filename:'index.html',
            hash:true,
            minify:{
                removeAttributeQuotes: true // 压缩 去掉引号
            }
        }),
        new OpenBrowserPlugin({ url: `http://${hostname}:9090` }),
        new webpack.DllReferencePlugin({ // 这样就会从dll中获取vue,而且不用再次打包vue
            manifest: require(path.join(__dirname,'dist','vue.manifest.json'))
        })
    ]
};