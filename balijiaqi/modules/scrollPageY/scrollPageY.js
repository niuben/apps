/*
 * @description		上下滚屏模块
 * @depends			zepto
 * @params			[config.parent] 所有屏的公共父级
 * @params 			[config.section] 每一屏
 */

var $ = require('zepto');

function scrollPageY(config){
	if(!(this instanceof scrollPageY)){
		return new scrollPageY(config);
	}
	this.init(config);
};
scrollPageY.prototype = {
	constructor: scrollPageY,
	init: function(conf){
		//默认配置
		var opt = {
			parent: '.page-content',
			section: 'section',
			callback: null,	//滚动切屏动画结束后的回调
			isScrolling: false,	//是否处于切屏动画中，
			curScrollPos: 0, //当前滚动位置
			minHeight: 490, //每一屏的最小高度
			prevCallback: null, //向上翻页时回调函数			
			nextCallback: null //向下翻页回调函数			
		};
		//合并参数
		this.opt = $.extend({}, opt, conf);
		this.pages = $(this.opt.parent).find(this.opt.section);
		this.opt.total = this.pages.length;
		//将每一屏的大小，设为当前设备的尺寸
		this.setSectionSize(this.pages);
		this.registEvents();
		this.opt.curScrollPos = Math.round(document.body.scrollTop/this.opt.screenSize.h);
		this.opt.callback && this.opt.callback(this.pages[this.opt.curScrollPos]);
	},
	registEvents: function(){
		var me = this;
		$(window).on('mousewheel', function(e){
			if(e.wheelDelta > 0){
				me.scrollUp();
			}
			else{
				me.scrollDown();
			}
		});
		/*window.addEventListener('orientationchange', function(e){
			me.opt.screenSize = me.getDeviceSize();
		}, false);*/
		$('body').on('touchstart', function(e){
			me.opt.touchstartY = e.touches[0].clientY;
			//阻止滚动事件
			// e.stopPropagation();
			// e.preventDefault();
			// return false;
		});
		$('body').on('touchmove', function(e){
			me.opt.isDrag = true;
			me.opt.touchmoveY = e.touches[0].clientY;
			//阻止滚动事件
			e.stopPropagation();
			// e.preventDefault();
			return false;
		});
		$('body').on('touchend', function(e){
			if(!me.opt.isDrag){
				return false;
			}
			me.opt.isDrag = false;
			//上滑
			if(me.opt.touchstartY > me.opt.touchmoveY){				
				me.scrollDown();
			}
			//下滑
			else if(me.opt.touchstartY < me.opt.touchmoveY){				
				me.scrollUp();
			}
		});
		//点击向上的按钮
		/*$('#next').on('click', function(e){
			me.scrollDown();
		});*/
	},
	getDeviceSize: function(){
		return {
			w: $(window).width(),
			h: $(window).height()
		}
	},
	setSectionSize: function($tar){
		var opt = this.opt,width,height;
		opt.screenSize = this.getDeviceSize();
		width = opt.screenSize.w;
		if(opt.screenSize.h > opt.minHeight){
			height = opt.screenSize.h;
			opt.compatibleMode = false;
		}
		//兼容小屏手机（小于500px高度）
		else{
			height = opt.minHeight;
			opt.compatibleMode = true;
		}
		$tar.css({
			'width': width + 'px',
			'height': height + 'px'
		});
	},
	scrollUp: function(){
		var opt = this.opt;
		$('#next').css('display', 'block');
		//兼容模式
		if(opt.compatibleMode && document.body.scrollTop > opt.curScrollPos*opt.minHeight){
			clearTimeout(this.auto);
			this.animate(opt.curScrollPos*opt.minHeight);
			return false;
		}

		if(opt.curScrollPos <= 0){
			return false;
		}
		opt.curScrollPos--;
		clearTimeout(this.auto);
		opt.prevCallback && opt.prevCallback(this.pages[opt.curScrollPos], opt);
		this.animate(opt.curScrollPos*(opt.compatibleMode ? opt.minHeight : opt.screenSize.h));
	},
	scrollDown: function(){
		var opt = this.opt;
		$('#next').css('display', 'block');
		if(opt.curScrollPos >= opt.total - 2){
			$('#next').css('display', 'none');
		}
		var fixPix = 0;
		if($.os.iphone && /MicroMessenger/i.test(window.navigator.userAgent)){
			fixPix = 50;
		}
		//兼容模式
		//console.log(document.body.scrollTop, opt.minHeight, opt.screenSize.h);
		if(opt.compatibleMode && document.body.scrollTop <= opt.curScrollPos*opt.minHeight){
			clearTimeout(this.auto);
			this.animate((opt.curScrollPos+1)*opt.minHeight - opt.screenSize.h + fixPix);
			return false;
		}

		if(opt.curScrollPos >= opt.total - 1){
			return false;
		}
		opt.curScrollPos++;
		clearTimeout(this.auto);
		
		opt.nextCallback && opt.nextCallback(this.pages[opt.curScrollPos], opt);	
		this.animate(opt.curScrollPos*(opt.compatibleMode ? opt.minHeight : opt.screenSize.h));
	},
	//@param tar 目标位置
	//@param callback 滚动到目标位置后的回调
	animate: function(tar){
		var me = this;
		clearTimeout(this.auto);
		this.auto = setTimeout(function(){
			var body = document.body;
			var curTop = body.scrollTop;
			var speed = (tar - curTop)/5;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			me.opt.scrollTop = body.scrollTop = curTop + speed;
			if(speed == 0){
				me.opt.isScrolling = false;
				clearTimeout(me.auto);
				//增加当前处于哪一个page的参数
				// var top = me.opt.pos * me.opt.screenSize.h;            	
				me.opt.callback && me.opt.callback(me.pages[me.opt.curScrollPos], me.opt.scrollTop);
			}
			else{
				me.opt.isScrolling = true;
				me.animate(tar);
			}
		}, 30);
	}
};

module.exports = scrollPageY;