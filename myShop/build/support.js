module.exports = {
    "entry": {
        "app": "./src/main.js"
    },
    "output": {
        "path": "D:\\vue\\my-project\\dist",
        "filename": "static/js/[name].[chunkhash].js",
        "publicPath": "/",
        "chunkFilename": "static/js/[id].[chunkhash].js"
    },
    "resolve": {
        "extensions": [".js", ".vue", ".json"],
        "alias": {
            "vue$": "vue/dist/vue.esm.js",
            "@": "D:\\vue\\my-project\\src"
        }
    },
    "module": {
        "rules": [
	        {
	            "test": /\.(js|vue)$/,
	            "loader": "eslint-loader",
	            "enforce": "pre",
	            "include": ["D:\\vue\\my-project\\src", "D:\\vue\\my-project\\test"],
	            "options": {
	            	"formatter": require('eslint-friendly-formatter')
	            }
	        },
	        {
	            "test": /\.vue$/,
	            "loader": "vue-loader",
	            "options": {
	                "loaders": {
	                    "css": ExtractTextPlugin.extract({
	                    	"use":[
		                    	{
		                    		"loader":"css-loader",
		                    		"options":{
		                    			"minimize":true,
		                    			"sourceMap":true
		                    		}
		                    	}
	                    	],
	                    	"fallback":"vue-style-loader"
	                    }),
	                    "postcss": ExtractTextPlugin.extract({
	                    	"use":[
		                    	{
		                    		"loader":"css-loader",
		                    		"options":{
		                    			"minimize":true,
		                    			"sourceMap":true
		                    		}
		                    	}
	                    	],
	                    	"fallback":"vue-style-loader"
	                    }),
	                    "less": ExtractTextPlugin.extract({
	                    	"use":[
		                    	{
		                    		"loader":"css-loader",
		                    		"options":{"minimize":true,"sourceMap":true}
		                    	},
		                    	{
		                    		"loader":"less-loader",
		                    		"options":{"sourceMap":true}
		                    	}
	                    	],
	                    	"fallback":"vue-style-loader"
	                    }),
	                    "sass": ExtractTextPlugin.extract({
	                    	"use":[
		                    	{
		                    		"loader":"css-loader",
		                    		"options":{"minimize":true,"sourceMap":true}
		                    	},
		                    	{
		                    		"loader":"sass-loader",
		                    		"options":{"indentedSyntax":true,"sourceMap":true}
		                    	}
	                    	],
	                    	"fallback":"vue-style-loader"
	                    }),
	                    "scss": ExtractTextPlugin.extract({
	                    	"use":[
		                    	{
		                    		"loader":"css-loader",
		                    		"options":{"minimize":true,"sourceMap":true}
		                    	},
		                    	{
		                    		"loader":"sass-loader",
		                    		"options":{"sourceMap":true}
		                    	}
	                    	],
	                    	"fallback":"vue-style-loader"
	                    }),
	                    "stylus": ExtractTextPlugin.extract({
	                    	"use":[
		                    	{
		                    		"loader":"css-loader",
		                    		"options":{"minimize":true,"sourceMap":true}
		                    	},
		                    	{
		                    		"loader":"stylus-loader",
		                    		"options":{"sourceMap":true}
		                    	}
	                    	],
	                    	"fallback":"vue-style-loader"
	                    }),
	                    "styl": ExtractTextPlugin.extract({
	                    	"use":[
		                    	{
		                    		"loader":"css-loader",
		                    		"options":{"minimize":true,"sourceMap":true}
		                    	},
		                    	{
		                    		"loader":"stylus-loader",
		                    		"options":{"sourceMap":true}
		                    	}
	                    	],
	                    	"fallback":"vue-style-loader"
	                    }),
	                },
	                "transformToRequire": {
	                    "video": "src",
	                    "source": "src",
	                    "img": "src",
	                    "image": "xlink:href"
	                }
	            }
	        },
	        {
	            "test": /\.js$/,
	            "loader": "babel-loader",
	            "include": ["D:\\vue\\my-project\\src", "D:\\vue\\my-project\\test"]
	        },
	        {
	            "test": /\.(png|jpe?g|gif|svg)(\?.*)?$/,
	            "loader": "url-loader",
	            "options": {
	                "limit": 10000,
	                "name": "static/img/[name].[hash:7].[ext]"
	            }
	        },
	        {
	            "test": /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
	            "loader": "url-loader",
	            "options": {
	                "limit": 10000,
	                "name": "static/media/[name].[hash:7].[ext]"
	            }
	        },
	        {
	            "test": /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
	            "loader": "url-loader",
	            "options": {
	                "limit": 10000,
	                "name": "static/fonts/[name].[hash:7].[ext]"
	            }
	        },
	        {
	            "test": /\.css$/,
	            "use": ExtractTextPlugin.extract({
                	"use":[
                    	{
                    		"loader":"css-loader",
                    		"options":{
                    			"minimize":true,
                    			"sourceMap":true
                    		}
                    	}
                	],
                	"fallback":"vue-style-loader"
                })
	        },
	        {
	            "test": /\.postcss$/,
	            "use": ExtractTextPlugin.extract({
                	"use":[
                    	{
                    		"loader":"css-loader",
                    		"options":{
                    			"minimize":true,
                    			"sourceMap":true
                    		}
                    	}
                	],
                	"fallback":"vue-style-loader"
                })
	        },
	        {
	            "test": /\.less$/,
	            "use": ExtractTextPlugin.extract({
                	"use":[
                    	{
                    		"loader":"css-loader",
                    		"options":{"minimize":true,"sourceMap":true}
                    	},
                    	{
                    		"loader":"less-loader",
                    		"options":{"sourceMap":true}
                    	}
                	],
                	"fallback":"vue-style-loader"
                })
	        },
	        {
	            "test": /\.sass$/,
	            "use": ExtractTextPlugin.extract({
                	"use":[
                    	{
                    		"loader":"css-loader",
                    		"options":{"minimize":true,"sourceMap":true}
                    	},
                    	{
                    		"loader":"sass-loader",
                    		"options":{"indentedSyntax":true,"sourceMap":true}
                    	}
                	],
                	"fallback":"vue-style-loader"
                })
	        },
	        {
	            "test": /\.scss$/,
	            "use": ExtractTextPlugin.extract({
                	"use":[
                    	{
                    		"loader":"css-loader",
                    		"options":{"minimize":true,"sourceMap":true}
                    	},
                    	{
                    		"loader":"sass-loader",
                    		"options":{"sourceMap":true}
                    	}
                	],
                	"fallback":"vue-style-loader"
                })
	        },
	        {
	            "test": /\.stylus$/,
	            "use": ExtractTextPlugin.extract({
                	"use":[
                    	{
                    		"loader":"css-loader",
                    		"options":{"minimize":true,"sourceMap":true}
                    	},
                    	{
                    		"loader":"stylus-loader",
                    		"options":{"sourceMap":true}
                    	}
                	],
                	"fallback":"vue-style-loader"
                })
	        },
	        {
	            "test": /\.styl$/,
	            "use": ExtractTextPlugin.extract({
                	"use":[
                    	{
                    		"loader":"css-loader",
                    		"options":{"minimize":true,"sourceMap":true}
                    	},
                    	{
                    		"loader":"stylus-loader",
                    		"options":{"sourceMap":true}
                    	}
                	],
                	"fallback":"vue-style-loader"
                })
	        }
        ]
    },
    "devtool": "#source-map",
    "plugins": [
	    new webpack.DefinePlugin({
	      	'process.env': env
	    }),
	    new webpack.optimize.UglifyJsPlugin({
	    	compress: {
	    		warnings: false
	    	},
	    	sourceMap: true
	    }),
	    new ExtractTextPlugin({
	    	filename: utils.assetsPath('css/[name].[contenthash].css')
	    }),
	    new OptimizeCSSPlugin({
	    	cssProcessorOptions: {
	    		safe: true
	    	}
	    }),
	    new HtmlWebpackPlugin({
	    	filename: process.env.NODE_ENV === 'testing'
	    	? 'index.html'
	    	: config.build.index,
	    	template: 'index.html',
	    	inject: true,
	    	minify: {
	    		removeComments: true,
	    		collapseWhitespace: true,
	    		removeAttributeQuotes: true
			},
		 
		  	chunksSortMode: 'dependency'
		}),
    	new webpack.HashedModuleIdsPlugin(),
    	new webpack.optimize.CommonsChunkPlugin({
    		name: 'vendor',
    		minChunks: function (module, count) {
		        return (
		        	module.resource &&
		        	/\.js$/.test(module.resource) &&
		        	module.resource.indexOf(
		        		path.join(__dirname, '../node_modules')
		        		) === 0
		        	)
    		}
		}),
    	new webpack.optimize.CommonsChunkPlugin({
    		name: 'manifest',
    		chunks: ['vendor']
    	}),
    	new CopyWebpackPlugin([
	    	{
	    		from: path.resolve(__dirname, '../static'),
	    		to: config.build.assetsSubDirectory,
	    		ignore: ['.*']
	    	}
    	])
 	]
}