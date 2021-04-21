const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // 告诉 webpack 打包后的代码不使用箭头函数
    environment: {
      arrowFunction: false
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            // 配置 babel
            options: {
              // 设置预定义的环境
              presets: [
                [
                  // 指定环境的插件
                  "@babel/preset-env",
                  // 配置信息
                  {
                    // 要兼容的目标浏览器
                    targets: {
                      chrome: 58,
                      ie: 11
                    },
                    // 指定 corejs 的版本
                    corejs: 3,
                    // 使用 corejs 的方式，usage 表示按需加载
                    useBuiltIns: "usage"
                  }
                ]
              ]
            }
          },
          'ts-loader'
        ],
        exclude: /node-modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      // title: 'typescript-demo'
      template: './src/index.html'
    })
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
};
