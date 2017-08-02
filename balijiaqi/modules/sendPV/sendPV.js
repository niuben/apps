/*统计发送组件*/
var sendPVStats = function(options) {
	var gifType = {
			vgif: "http://nsclick.baidu.com/v.gif?pid=104&",
			pgif: "http://nsclick.baidu.com/p.gif?pid=104&"
		},
		param = function(obj, traditional) {
			var params = [];
			params.add = function(k, v) {
				this.push(escape(k) + '=' + escape(v))
			};
			return params.join('&').replace('%20', '+');
		},
		isObject = function(obj) {
			return new RegExp('Object]', 'i').test(Object.prototype.toString.call(obj));
		},
		time = Date.now(),
		img = new Image(),
		node, target,
		options = options || {},
		callback = options.callback,
		query = options.query || {
			u: location.href
		},
		oldquery = "",
		event = options.event,
		gif = gifType[(options.pv || 'p') + 'gif'];

	window["bd_" + time] = img;

	if (oldquery == query) //同一个统计一段时间内不允许连续发送
		return false;
	oldquery = query;
	setTimeout(function() {
		oldquery = '';
	}, 500)

	if (options.pv && options.pv.toLowerCase() == 'v') { //延迟200MS
		if (isObject(query) && !query.cu) {
			query.cu = location.href;
			delete query.u;
		}

		target = event && ((node = event.target).nodeType == 1 ? node : node.parentNode);

		if (target && target.getAttribute('data-clicked') == "1") { //防止重复点击
			return false;
		}
		target && target.setAttribute('data-clicked', "1");

		if (callback) {
			setTimeout(function() {
				callback(event);
				//销毁img对象
				img = null;
				target && target.removeAttribute("data-clicked");
			}, 200)
		} else {
			target && target.removeAttribute("data-clicked");
		}
	}

	query = isObject(query) ? param(query) : query;
	img.src = gif + query + "&t=" + time;
	if (window.debuge) console.log.apply(console, ['发送了统计', options.pv || 'p', '地址为：'].concat(query.split('&')));
	return false;
};

module.exports = sendPVStats;