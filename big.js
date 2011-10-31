window.onload = function() {
    var s = document.getElementsByTagName('div'), cur = 0;
    if (!s) return;
    function go(n) {
        var i = 1e3, e = s[n];
        for (var k = 0; k < s.length; k++) s[k].style.display = 'none';
        e.style.display = 'inline';
        e.style.fontSize = i + 'px';
        if (e.firstChild.nodeName === 'IMG') {
            document.body.style.backgroundImage = 'url(' + e.firstChild.src + ')';
            e.firstChild.style.display = 'none';
        } else {
            document.body.style.backgroundImage = '';
        }
        while (
            e.offsetWidth > window.innerWidth ||
            e.offsetHeight > window.innerHeight) {
            e.style.fontSize = (i -= 10) + 'px';
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
