const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',      // Nos permite decir el punto de entrada de nuestra aplicación
    output: {                     // Nos permite decir hacia dónde va enviar lo que va a preparar webpacks (por defecto carpetea /dist)
        path: path.resolve(__dirname, 'dist'),  // Pathes donde estará la carpeta donde se guardará los archivos
              // Con path.resolve podemos decir dónde va estar la carpeta y la ubicación del mismo
        filename: '[name].[contenthash].js',   // filename le pone el nombre al archivo final
        assetModuleFilename: 'assets/images/[hash][ext][query]'                                   
    },
    resolve: {          // Aqui ponemos las extensiones que tendremos en nuestro proyecto para webpack los lea
        extensions: ['.js'],
        alias: {
          '@utils': path.resolve(__dirname, 'src/utils/'),
          '@templates': path.resolve(__dirname, 'src/templates/'),
          '@styles': path.resolve(__dirname, 'src/styles/'),
          '@images': path.resolve(__dirname, 'src/assets/images/'),
        }
    },
    module: {
        rules: [
          {
            // Test declara que extensión de archivos aplicara el loader
            test: /\.js$/,
            // Exclude permite omitir archivos o carpetas especificas
            exclude: /node_modules/,
            // Use es un arreglo u objeto donde dices que loader aplicaras
            use: {
              loader: "babel-loader"
            },
          },
          {
            test: /\.(css|styl)$/i,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              'stylus-loader'
            ],
          },
          {
            test: /\.png/,
            type: 'asset/resource'
          },
          {
            test: /\.(woff|woff2)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 10000,
                mimetype: "application/font-woff",
                name: "[name].[contenthash].[ext]",
                outputPath: "./assets/fonts/",
                pubicPath: "../assets/fonts/",
                esModule: false,
              }
            }
          }
        ]
      },
      plugins: [     // Aqui es donde agregamos las librerias que nos ayuda a transpilar el codigo de nuestro proyecto
          new HtmlWebpackPlugin({ 
              inject: true,     // Inyecta el bundle a nuestro template html
              template: './public/index.html',  // Va a tomar nuestro template
              filename: './index.html'    // Lo va a poner dentro de nuestra carpeta dist con el nombre de index.html
          }),
          new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
          }),
          new CopyPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, "src", "assets/images"),
                to: "assets/images"
              }
            ]
          }),
          new Dotenv(),
          new CleanWebpackPlugin(),
      ],
      optimization: {
        minimize: true,
        minimizer: [
          new CssMinimizerPlugin(),
          new TerserPlugin(),
        ]
      }
    }
