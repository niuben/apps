var ExtractTextPlugin = webpack = {
	extract: function(){

	},
	ProvidePlugin: function(){

	}
};
var configJson = {
	list: [
		{
			name: "extracttext",
			package: {

			},
			textList:[{
					type: "top",
					text: 'var ExtractTextPlugin = require("extract-text-webpack-plugin");'
				},{
					type: "loader",
					text: { 
						test: /\.css$/, 
						loader: ExtractTextPlugin.extract("style-loader", "css-loader", {publicPath: "./"})
					}	
				},{
					type: "loader",
					text: { 
						test: /\.scss$/, 
						loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader", {
							publicPath: "./"
						})
					}	
				}
			]
		},{
			name: "sourcemap",
			type: "main",
			text: {
				devtool: "source-map"
			}
		},{
			name: "autoRequire",
			type: "plugins",
			text: new webpack.ProvidePlugin({
				React: "react",
				ReactDOM: "react-dom",
				$: "jquery"
			})
		},{
			name: "ES6",
			type: "loaders",
			package: {
				"babel-loader": ""
			},
			text: {
		        test: /\.(js)$/,
				exclude: /node_modules/,
		        loader: 'babel-loader',
		        query: {
		            presets: ['react', 'es2015']             
		        }
	        }
		},{
			name: "loaderJs",
			type: "loaders",
			package: {
				"babel-loader": ""
			},
			text: { 
	          test: /\.js$/, 
	          loader: "file-loader!css-loader"
	        },
	    },{
			name: "loaderCss",
			type: "loaders",
			package: {
				"style-loader": "",
				"css-loader": ""
			},
			text: { 
	          test: /\.css$/, 
	          loader: "style-loader!css-loader"
	        },
	    },{
			name: "loaderScss",
			type: "loaders",
			package: {				
				"style-loader": "",
				"css-loader": "",
				"scss-loader": ""
			},
			text: { 
		        test: /\.scss$/, 
				loader: "style-loader!css-loader!sass-loader"
		    }
        },{
			name: "loaderLess",
			type: "loaders",
			package: {
				"style-loader": "",
				"css-loader": "",
				"less-loader": ""
			},
			text: { 
		        test: /\.scss$/, 
				loader: "style-loader!css-loader!less-loader"
		    }
        },{
			name: "loaderPngJpg",
			type: "loaders",
			package: {
				"url-loader": ""
			},
			text: {
	            test: /\.(png|jpg)$/,
	            loader: 'url-loader?limit=8192'
	        }
		},{
			name: "loaderJsx",			
			type: "loaders",
			package: {
				"babel-loader": ""
			},
			text: {
				test: /\.jsx$/,
				loader: 'react-templates-loader'
			}
		}
	]
}