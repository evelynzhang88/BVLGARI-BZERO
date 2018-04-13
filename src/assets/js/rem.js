(function(doc, win) {
    var docEl = doc.documentElement,
    isIOS = navigator.userAgent.match(/iphone|ipod|ipad/gi),
    //dpr = isIOS? Math.min(win.devicePixelRatio, 3) : 1,
    dpr = 3,
    scale = 1 / dpr,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    //fix iphone plus bug
    //if(dpr == 3){
    //    scale=1;
    //    dpr = 2;
    //}
    docEl.dataset.dpr = dpr;
    //var metaEl = doc.createElement('meta');
    //metaEl.name = 'viewport';
    //metaEl.content = 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale;
    //docEl.firstElementChild.appendChild(metaEl);
    var recalc = function () {
        var width = docEl.clientWidth,
			height = docEl.clientHeight;
        //if (width / dpr > 750) {
        //    width = 750 * dpr;
        //}
				if(width/height>414/675){
					docEl.style.fontSize = 50 * (height / 675) + 'px';

				}else{
					docEl.style.fontSize = 50 * (width / 414) + 'px';
				}
      };
    recalc();
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
})(document, window);