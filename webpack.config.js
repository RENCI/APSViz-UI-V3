const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')
const { HotModuleReplacementPlugin } = require('webpack')
//const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

let mode = 'development'
let target = 'web'
const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    favicon: './src/images/favicon.png',
  }),

  //new BundleAnalyzerPlugin(),

  new ESLintPlugin({
    extensions: ['src', 'js', 'js*'], eslintPath: "eslint/use-at-your-own-risk", configType: "flat"
  }),

  new DotenvPlugin(),
  new HotModuleReplacementPlugin(),
]

if (process.env.NODE_ENV === 'production') {
  mode = 'production'
}

module.exports = {
  mode: mode,

  target: target,

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
  },

  module: {
      rules: [
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        // type:
        //   "asset/inline": base-64 inline images in js bundle
        //   "asset/resource": images will be imported as separate resources
        //   "asset": webpack will determine, based on file size, whether it
        //            should base-64 inline the images or import them as assets.
        //            8kb is the default cutoff, which can be changed.
        type: 'asset',
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [ // these load the rtl
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: "raw-loader",
            options: {
              // Pass options to be marked
              // See https://marked.js.org/using_advanced#options
            },
          },
        ],
      },
      {
        test: /\.geojson$/,
        type: 'json',
      },
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        }
      },
      {
        test: /\.less$/,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
    ],
  },

  plugins: plugins,

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@content': path.resolve(__dirname, 'src/content/'),
      '@context': path.resolve(__dirname, 'src/context/'),
      '@dialog': path.resolve(__dirname, 'src/components/dialog/'),
      '@help-about': path.resolve(__dirname, 'src/components/trays/help-about/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@images': path.resolve(__dirname, 'src/images/'),
      '@model-selection': path.resolve(__dirname, 'src/components/trays/model-selection/'),
      '@compare-layers': path.resolve(__dirname, 'src/components/trays/compare-layers/'),
      '@share': path.resolve(__dirname, 'src/components/trays/share/'),
      '@utils': path.resolve(__dirname, 'src/utils/')
    }
  },

  devtool: 'source-map',

  devServer: {
    client: {
      overlay: false,
    },
    historyApiFallback: true,
    static: path.resolve(__dirname, 'dist'),
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }
      console.log()
      console.log(` _|_|_|    _|_|_|_|  _|      _|    _|_|_|  _|_|_| `)
      console.log(` _|    _|  _|        _|_|    _|  _|          _|   `)
      console.log(` _|_|_|    _|_|_|    _|  _|  _|  _|          _|   `)
      console.log(` _|    _|  _|        _|    _|_|  _|          _|   `)
      console.log(` _|    _|  _|_|_|_|  _|      _|    _|_|_|  _|_|_| `)
      console.log(`\n`)

      return middlewares
    },
  },

  performance: {
    hints: false
  }
}
