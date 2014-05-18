window.onload = function() {
    big = {};
    big.cur = 0;
    var s = document.getElementsByTagName('div'), ti;
    if (!s) return;
    function go(n) {
        big.cur = n;
        var i = 1e3, e = s[n], t;
        // if the div has a bodyclass data attribute, add it to the body
        document.body.className = e.dataset.bodyclass || '';
        for (var k = 0; k < s.length; k++) s[k].style.display = 'none';
        e.style.display = 'inline';
        e.style.fontSize = i + 'px';
        if (e.firstChild.nodeName === 'IMG') {
            document.body.style.backgroundImage = 'url(' + e.firstChild.src + ')';
            e.firstChild.style.display = 'none';
            if ('classList' in e) e.classList.add('imageText');
        } else {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = e.style.backgroundColor;
        }
        if (ti !== undefined) window.clearInterval(ti);
        t = parseInt(e.dataset.timeToNext || 0, 10);
        if (t > 0) ti = window.setTimeout(big.fwd, (t * 1000));
        while (
            e.offsetWidth > window.innerWidth ||
            e.offsetHeight > window.innerHeight) {
            e.style.fontSize = (i -= 2) + 'px';
            if (i < 0) break;
        }
        e.style.marginTop = ((window.innerHeight - e.offsetHeight) / 2) + 'px';
        if (window.location.hash !== n) window.location.hash = n;
        document.title = e.textContent || e.innerText;
    }
    document.onclick = function() { go(++big.cur % (s.length)); };
    big.fwd = function() { go(Math.min(s.length - 1, ++big.cur)); };
    big.rev = function() { go(Math.max(0, --big.cur)); };
    document.onkeydown = function(e) {
        if (e.which === 39) big.fwd();
        if (e.which === 37) big.rev();
    };
    document.ontouchstart = function(e) {
        var x0 = e.changedTouches[0].pageX;
        document.ontouchend = function(e) {
            var x1 = e.changedTouches[0].pageX;
            if (x1 - x0 < 0) big.fwd();
            if (x1 - x0 > 0) big.rev();
        };
    };
    function parse_hash() {
        return Math.max(Math.min(
            s.length - 1,
            parseInt(window.location.hash.substring(1), 10)), 0);
    }
    if (window.location.hash) big.cur = parse_hash() || big.cur;
    window.onhashchange = function() {
        var c = parse_hash();
        if (c !== big.cur) go(c);
    };
    go(big.cur);
};
