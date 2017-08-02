//分享到微信，自定义链接显示方式
var wechat = function(opt){
    var imgUrl = opt.imgUrl || '';
    var lineLink = opt.lineLink || '';
    var shareTitle = opt.shareTitle || '';
    var descContent = opt.descContent || '';
    function shareFriend(){
        WeixinJSBridge.invoke('sendAppMessage',{
                                // "appid": appid,
                                "img_url": imgUrl,
                                "img_width": "240",
                                "img_height": "371",
                                "link": lineLink,
                                "desc": descContent,
                                "title": shareTitle
                                }, function(res) {
                                _report('send_msg', res.err_msg);
                            });
    };
    function shareTimeline() {
        WeixinJSBridge.invoke('shareTimeline',{
                                "img_url": imgUrl,
                                "img_width": "240",
                                "img_height": "371",
                                "link": lineLink,
                                "desc": descContent,
                                "title": shareTitle
                                }, function(res) {
                                _report('timeline', res.err_msg);
                            });
    };
    // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {

        // 发送给好友
        WeixinJSBridge.on('menu:share:appmessage', function(argv){
            shareFriend();
        });

        // 分享到朋友圈
        WeixinJSBridge.on('menu:share:timeline', function(argv){
            shareTimeline();
        });

    }, false);
};

module.exports = wechat;