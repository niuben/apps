function persent() {
  this.curNum = 0;
  this.duration = 600;
  this.handle = null;
};

persent.prototype = {
  run: function(endNum, callback) {
    this.stop();
    var num = endNum - this.curNum,
        loop = Math.ceil(this.duration / num),
        _this = this;				

    //开始循环，进度是一个一个累加
    this.handle = setInterval(function() {					
      if(_this.curNum >= endNum ){
        _this.stop();
        return false;
      }
      _this.curNum++;
      if(_this.curNum == 99) {
        // console.timeEnd("时间");
      }

      callback && callback(_this.curNum);
    }, loop);
  },
  stop: function() {
    if( this.handle ) { 
      clearInterval(this.handle);
    }
  }			
};

module.exports = persent;