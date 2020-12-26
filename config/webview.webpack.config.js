/* eslint-disable @typescript-eslint/naming-convention */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
	entry: './src/webview/index.tsx',
	output: {
		path: path.resolve(__dirname, '..', 'dist', 'webview'),
		filename: 'index.js',
		// libraryTarget: 'commonjs2'
	},
	devtool: 'eval-source-map',
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: 'tsconfig.webview.json',
						},
					},
				],
			},
			{
				test: /\.s?css$/,
				oneOf: [
					{
						test: /\.module\.s?css$/,
						use: [
							MiniCssExtractPlugin.loader,
							{
								loader: 'css-loader',
								options: {
									modules: {
										localIdentName: '[name]__[local]--[hash:base64:5]',
									},
								},
							},
							'sass-loader',
						],
					},
					{
						use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'styles.css',
		}),
		// 	new HtmlWebpackPlugin({
		// 		template: path.resolve(__dirname, '..', 'src', 'webview', 'index.html'),
		// 		filename: 'index.html',
		// 		inject: 'body',
		// 	}),
	],
};
module.exports = config;
