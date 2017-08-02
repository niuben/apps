var scrollPageY = require('scrollPageY');
var $ = require('zepto');

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
// function hideFirstPage() {
    scrollPageY({
        parent: '.js-page-content',
        section: 'section',
        prevCallback: function(cur, opt){
            clearTpl(cur);
            $(".cloud").css("top", opt.curScrollPos * opt.screenSize.h + "px");            
        },
        nextCallback: function(cur, opt){
            clearTpl(cur);
            $(".cloud").css("top", opt.curScrollPos * opt.screenSize.h + "px");            
        },
        callback: function(cur, top){
            top = top || 0;
            $(".cloud").css("top", top + "px");            
            createTpl(cur);         
        }
    });
    
    // $("#firstPage").hide().addClass("firstPageHide");
    
    // setTimeout(function(){
    //     var firstSection = document.querySelector("#page1");
    //     createTpl(firstSection);
    //     $(".js-page-content").css("opacity", 1);
    // }, 2000);
// }

// setTimeout(function(){
    // hideFirstPage();
// }, 6000);

$(".content").css("height", "auto");
$("audio")[0].onload = function(){
    $("audio")[0].play();
};
$("audio")[0].src = "http://case.lianlicard.com/balijiaqi/clip.mp3";
$("audio")[0].loop="loop";
$("audio")[0].play();


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

// $("body").on("touchstart", function(e){
//     var targetObj = e.target;    
//     if($(targetObj).hasClass("share")){        
//         $(".tips").show();
//     }
    
//     if($(targetObj).hasClass("goMap")){        
//         var url = $(targetObj).attr("href");
//         location.href = url;
//     }
// });



// var wechat = require('wechat');
// //分享到微信
// wechat({
//     imgUrl: "http://case.lianlicard.com/balijiaqi/app/img/logo_afff753.png",
//     lineLink: 'http://case.lianlicard.com/balijiaqi/',
//     shareTitle: '《巴黎假期》先导发布会 邀您参加1',
//     descContent: '《巴黎假期》先导发布会 邀您参加1'
// });

