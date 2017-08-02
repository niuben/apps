//common打包
/*fis.config.set('pack', {
	'pkg/common.js': [
		'/modules/**.js'
	]
});*/
//var dir = '~xingwenliang/datareport/';
var dir = 'balijiaqi';
//页面零散资源自动打包
fis.config.set('settings.postpackager.simple.autoCombine', true);
//页面零散资源打包后的位置
fis.config.set('settings.postpackager.simple.output', '/pkg/common');

fis.config.merge({
    statics: dir,
    modules: {
        parser: {
            less: 'less',
            tmpl: 'utc'
        },
        postprocessor: {
            js: "jswrapper, require-async",
            html: "require-async"
        },
        postpackager : ['autoload', 'simple']
    },
    roadmap: {
        ext: {
            less: 'css'
        },
        path : [
        	{
        		//lib中非模块化的组件，如模块解析器
        		reg : /^\/libs\/.+\.js/i,
        		isMode : false,
        		release : '${statics}/$&'
        	},
            {
                //一级同名组件，可以引用短路径，比如modules/jquery/jquery-1.9.1.min.js
                //直接引用为var $ = require('jquery');
                reg : /^\/modules\/([^\/]+)\/(.+).(js)$/i,
                //是组件化的，会被jswrapper包装
                isMod : true,
                //id为文件夹名
                id : '$1',
                release : '${statics}/$&'
            },
            {
                //app目录下的当前产品业务逻辑的代码
                reg : /^\/(app\/.*)\.(js)$/i,
                isMod : true,
                id : '$1',
                release : '${statics}/$&'
            },
            {
                //css文件
                reg : /^(.*)\.(css|less)$/i,
                //启用sprite自动合并，书写需要合并的图片地址的时候，需要在文件地址后面加?__sprite，如: background: url(images/abc.png?__sprite);
                useSprite: true,
                release : '${statics}/$&'
            },
            {
                //图片文件
                reg : /^(.*)\.(jpg|gif|png)$/i,
                release : '${statics}/$&'
            },
            {
                //前端模板
                reg : '**.tmpl',
                //当做类js文件处理，可以识别__inline, __uri等资源定位标识
                isJsLike : true,
                //只是内嵌，不用发布
                release : false
            },
            {
                //less的mixin文件无需发布
                reg : /^(.*)mixin\.less$/i,
                release : false
            },
            {
                reg : /.*\.(html|jsp|tpl|vm|htm|asp|aspx)/,
                useCache : false,
                release : '${statics}/$&'
            },
            {
                reg : "README.md",
                release : false
            },
            {
                //其他上文未匹配到的
                reg : "**",
                release : '${statics}/$&'
            }
        ]
    },
    settings: {
        postprocessor: {
            jswrapper: {
                type: 'amd'
            }
        },
        spriter: {
            csssprites: {
                margin: 20
            }
        },
        lint : {
            jshint : {
                camelcase : true,
                curly : true,
                eqeqeq : true,
                forin : true,
                immed : true,
                latedef : true,
                newcap : true,
                noarg : true,
                noempty : true,
                node : true
            }
        }
    }
});