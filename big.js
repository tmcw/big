window.onload = function() {
    var s = document.getElementsByTagName('div'), cur = 0;
    if (!s) return;
    function go(n) {
        var i = 1e3;
        for (var k = 0; k < s.length; k++) s[k].style.display = 'none';
        s[n].style.display = 'inline';
        s[n].style.fontSize = i + 'px';
        if (s[n].firstChild.nodeName === 'IMG') {
            s[n].style.right = 0;
            s[n].style.bottom = 0;
        } else {
            while (
                s[n].offsetWidth > window.innerWidth ||
                s[n].offsetHeight > window.innerHeight) {
                i -= 10;
                s[n].style.fontSize = i + 'px';
            }
        }
        if (window.location.hash !== n) window.location.hash = n;
    }
    document.onclick = function() {
        cur = ++cur % (s.length);
        go(cur);
    };
    document.onkeydown = function(e) {
        (e.which === 39) && go(cur = Math.min(s.length - 1, ++cur));
        (e.which === 37) && go(cur = Math.max(0, --cur));
    };
    if (window.location.hash) cur = Math.max(
        Math.min(
            s.length - 1,
            parseInt(window.location.hash.substring(1), 10)), 0) || cur;
    window.onhashchange = function() {
        var c = Math.max(Math.min(
            s.length - 1,
            parseInt(window.location.hash.substring(1), 10)), 0);
        if (c !== cur) go(cur = c);
    };

    go(cur);
};
