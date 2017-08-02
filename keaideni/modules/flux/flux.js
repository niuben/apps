

    function getcss(element, key) {
        return document.defaultView.getComputedStyle(element, null).getPropertyValue(key);
    }

    function extend(target, obj) {
        target = target || customNL.prototype;
        for (var prop in obj) {
            target[prop] = obj[prop];
        }
    }


    //栅格变化类
    function transition(options) {
        var options = options || {};
        this.columns = options.columns || 4;
        this.rows = options.rows || 4;
        this.forceSquare = options.forceSquare || false;
        this.delayBetweenBars = options.delayBetweenBars || 100;
        this.endCallback = options.endCallback || null;
        //this.image1 = $(options.img1);//需要被隐藏的图片
        this.image = document.querySelector(options.id);
    }

    extend(transition.prototype, {
        run:function (options) {
            var _this = this;
            this.options=options||{};
            if (this.setup !== undefined) {
                this.setup();
            }
            this.setup && this.setup();
            setTimeout(function(){
                _this.image.style.backgroundImage = "none";
            }, 600);
            setTimeout(function () {
                _this.execute && _this.execute();
            }, 5);
        },
        setup:function () {

            var imgWidth = this.image.clientWidth,
                imgHeight = this.image.clientHeight;
            var colWidth = Math.floor(imgWidth / this.columns),
                rowHeight = Math.floor(imgHeight / this.rows);

            if (this.forceSquare) {
                rowHeight = colWidth;
                this.rows = Math.floor(imgHeight / rowHeight);
            }

            // Work out how much space remains with the adjusted barWidth
            var colRemainder = imgWidth - (this.columns * colWidth),
                colAddPerLoop = Math.ceil(colRemainder / this.columns),

                rowRemainder = imgHeight - (this.rows * rowHeight),
                rowAddPerLoop = Math.ceil(rowRemainder / this.rows),

                totalLeft = 0,
                totalTop = 0,
                fragment = document.createDocumentFragment();
            var size=this.options;
            var w1=size.width,h1=size.height,left=size.left;
            for (var i = 0; i < this.columns; i++) {
                var thisColWidth = colWidth,
                    totalTop = 0;

                if (colRemainder > 0) {
                    var add = colRemainder >= colAddPerLoop ? colAddPerLoop : colRemainder;
                    thisColWidth += add;
                    colRemainder -= add;
                }

                for (var j = 0; j < this.rows; j++) {
                    var thisRowHeight = rowHeight,
                        thisRowRemainder = rowRemainder;
                    if (thisRowRemainder > 0) {
                        var add = thisRowRemainder >= rowAddPerLoop ? rowAddPerLoop : thisRowRemainder;
                        thisRowHeight += add;
                        thisRowRemainder -= add;
                    }

                    var tile = document.createElement("div");
                    tile.className = 'tile tile-' + i + '-' + j;
                    tile.style.width = thisColWidth + 'px';
                    tile.style.height = thisRowHeight + 'px';
                    tile.style.position = "absolute";
                    tile.style.top = totalTop + 'px';
                    tile.style.left = totalLeft + 'px';
                    tile.style.backgroundSize= w1 +"px " + h1 + "px";
                    /*tile.style.backgroundSize="90% 90%";*/
                    this.renderTile.call(this, tile, i, j, thisColWidth, thisRowHeight, totalLeft, totalTop);
                    fragment.appendChild(tile);

                    totalTop += thisRowHeight;
                }

                totalLeft += thisColWidth;
            }

            // Append the fragement to the surface
            this.image.appendChild(fragment);
        },
        renderTile:function (elem, colIndex, rowIndex, colWidth, rowHeight, leftOffset, topOffset) {
            var delay = Math.floor(Math.random() * 10 * this.delayBetweenBars);
            var backGround = getcss(this.image, "background-image");
            leftOffset = leftOffset + this.options.left;
            elem.style.backgroundImage = backGround;
            elem.style.backgroundPosition = '-' + leftOffset + 'px -' + topOffset + 'px';
            elem.style.webkitTransitionDuration = "350ms";
            elem.style.webkitTransitionTimingFunction = "ease-in";
            elem.style.webkitTransitionProperty = "all";
            elem.style.webkitTransitionDelay = delay + "ms";


            // Keep track of the last elem to fire
            if (this.maxDelay === undefined)
                this.maxDelay = 0;

            if (delay > this.maxDelay) {
                this.maxDelay = delay;
                this.maxDelayTile = elem;
            }
        },
        execute:function () {
            var _this = this

            var blocks = document.querySelectorAll('div.tile');

            // Get notified when the last transition has completed
            /*this.maxDelayTile.transitionEnd(function () {
             _this.finished();
             });*/
            _this.transitionEnd(_this.finished);

            setTimeout(function () {
                for (var i = 0, l = blocks.length; i < l; i++) {
                    var bl = blocks[i];
                    bl.style.opacity = 0;
                    bl.style.webkitTransform = "scale(0.8)";
                }
            }, 50);
        },
        finished:function () {
            this.image.innerHTML = "";
            this.endCallback && this.endCallback();
        },
        transitionEnd:function (callback) {
            var obj = this.maxDelayTile, 
                _this = this;
            var call = function(e){
                callback && callback.call(_this);
                if (e.propertyName == 'width') {
                    this.removeEventListener('webkitTransitionEnd', call, false);
                }
            };
            obj.addEventListener('webkitTransitionEnd', call, false);
            return this;
        }
    });
    module.exports = transition;
