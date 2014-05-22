window.onload = function() {
    var s = document.getElementsByTagName('div'), cur = 0, ti, fk, rk;
    if (!s) return;
    fk = [39].concat(window.fwdKeys||[]); // append to default key events for "forward"
    rk = [37].concat(window.revKeys||[]); // append to default key events for "reverse"
    var howdy;
    function go(n) {
        cur = n;
        var i = 1e3, e = s[n], t;
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
        if (t > 0) ti = window.setTimeout(fwd, (t * 1000));
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
    document.onclick = function() { go(++cur % (s.length)); };
    function fwd() { go(Math.min(s.length - 1, ++cur)); }
    function rev() { go(Math.max(0, --cur)); }
    document.onkeydown = function(e) {
        if (fk.indexOf(e.which) >= 0) fwd();
        if (rk.indexOf(e.which) >= 0) rev();
    };
    document.ontouchstart = function(e) {
        var x0 = e.changedTouches[0].pageX;
        document.ontouchend = function(e) {
            var x1 = e.changedTouches[0].pageX;
            if (x1 - x0 < 0) fwd();
            if (x1 - x0 > 0) rev();
        };
    };
    function parse_hash() {
        return Math.max(Math.min(
            s.length - 1,
            parseInt(window.location.hash.substring(1), 10)), 0);
    }
    if (window.location.hash) cur = parse_hash() || cur;
    window.onhashchange = function() {
        var c = parse_hash();
        if (c !== cur) go(c);
    };
    go(cur);
};
