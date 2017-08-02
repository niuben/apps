

var transition = require('flux');
var scrollPageY = require('scrollPageY');
var $ = require('zepto');
// var wechat = require('wechat');

//分享到微信
// wechat({
//     imgUrl: "http://lidashih5.duapp.com/liyuchun/app/img/liyuchun.jpg",
//     lineLink: 'http://lidashih5.duapp.com/liyuchun/index.html?v=1',
//     shareTitle: '李宇春《蜀绣》 QQ音乐出品',
//     descContent: '李宇春《蜀绣》 QQ音乐出品'
// });

function init(){
　　if (window.DeviceMotionEvent) {
　　　　window.addEventListener('devicemotion', deviceMotionHandler, false);
　　} else{
　　　　// 移动浏览器不支持运动传感事件
　　} 
}

// 那么，我们如何计算用户是否是在摇动手机呢？可以从以下几点进行考虑：
// 1、其实用户在摇动手机的时候始终都是以一个方向为主进行摇动的；
// 2、用户在摇动手机的时候在x、y、z三个方向都会有相应的想速度的变化；
// 3、不能把用户正常的手机运动行为当做摇一摇（手机放在兜里，走路的时候也会有加速度的变化）。
// 从以上三点考虑，针对三个方向上的加速度进行计算，间隔测量他们，考察他们在固定时间段里的变化率，而且需要确定一个阀值来触发摇一摇之后的操作。

// 首先，定义一个摇动的阀值
var SHAKE_THRESHOLD = 2000;
// 定义一个变量保存上次更新的时间
var last_update = 0;
// 紧接着定义x、y、z记录三个轴的数据以及上一次出发的时间
var x;
var y;
var z;
var last_x;
var last_y;
var last_z;

function deviceMotionHandler(eventData) {
　　// 获取含重力的加速度
　　var acceleration = eventData.accelerationIncludingGravity; 
    // $("#number").append("<p>" + objToString(acceleration) + "</p>");
    
　　// 获取当前时间
　　var curTime = new Date().getTime(); 
　　var diffTime = curTime -last_update;
　　// 固定时间段
　　if (diffTime > 100) {
　　　　last_update = curTime; 

　　　　x = acceleration.x; 
　　　　y = acceleration.y; 
　　　　z = acceleration.z; 

　　　　var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000; 

　　　　if (speed > SHAKE_THRESHOLD) { 
            $("#firstPage").addClass("yaoyiyao");
            $("audio")[0].play();
            
            setTimeout(function(){
                hideFirstPage();
                $(".content").css("height", "auto");
                $("audio")[0].onload = function(){
                    $("audio")[0].play();
                };
                $("audio")[0].src = "app/img/bg.mp3";
                $("audio")[0].loop="loop";
                $("audio")[0].play();

            }, 5000);
　　　　}

　　　　last_x = x; 
　　　　last_y = y; 
　　　　last_z = z; 
　　} 
}

init();

var Img = {
	resetImg:function (elemWidth, elemHeight, w, h) {
        var widthRate = w / elemWidth;
        var heightRate = h / elemHeight;
        var w1, h1, r1, l1 = 0, t1 = 0;
        r1 = (widthRate > heightRate) ? widthRate : heightRate;
        w1 = Math.floor(elemWidth * r1);
        h1 = Math.floor(elemHeight * r1);
        l1 = Math.floor((w1 - w) / 2);
        return {
            realWidth:elemWidth,
            realHeight:elemHeight,
            width:w1,
            height:h1,
            rate:r1,
            left:l1,
            top:t1
        };
    },
    setSize:function (id, realW, realH ) {
        	          
        var w2 = window.innerWidth,
            h2 = window.innerHeight;
            // h2 = document.body.scrollHeight > window.innerHeight ? document.body.scrollHeight : window.innerHeight;

        size = this.resetImg(realW, realH, w2, h2);
        
        eleObj = document.querySelector("#" + id);
        eleObj.style.backgroundSize = size.width + "px " + size.height + "px";
        eleObj.style.backgroundPosition = "-" + size.left + "px 0px";
        eleObj.style.height = h2 + "px";
        return size;
    }
};

var createTpl = function(cur){
	var $cur = $(cur),
		$tpl = $('#' + $cur.attr('id') + '-tpl');
	if($tpl.length && $tpl.html()){
		$(cur).html($tpl.html());
	}
}

var clearTpl = function(cur) {
	var $cur = $(cur);
	$(cur).html("");
}

var firstSection = document.querySelector("#page1");
var trans = new transition({
    id: "#firstPage",
    endCallback: function() {    	
    	if(! $("#firstPage").css("zIndex") == "-1") {
    		return false;
    	}
    	$("#firstPage").css("zIndex", "-1");
    	createTpl(firstSection);
    }
}),
size = Img.setSize("firstPage", 640, 960);
$(".content").css("height", size.height + "px");


function hideFirstPage() {
    $(".js-page-content").css("opacity", 1);
    scrollPageY({
        parent: '.js-page-content',
        section: 'section',
        callback: function(cur){        
            createTpl(cur);        
            
        }
    });
    trans.run(size);
    clearTpl(firstSection);
}

//绑定点击音乐按钮事件
$(".music").on("touchstart", function(){
    if($(this).hasClass("music-pause")) {
        $(this).removeClass("music-pause");
        $("audio")[0].play();
    }else {
        $(this).addClass("music-pause");
        $("audio")[0].pause();
    }
});

$("body").on("touchstart", function(e){
    var targetObj = e.target;    
    if($(targetObj).hasClass("share")){        
        $(".tips").show();
    }
    
    if($(targetObj).hasClass("goMap")){        
        var url = $(targetObj).attr("href");
        location.href = url;
    }


});
$(".tips").on("touchstart", function(){
    $(this).hide();
});

