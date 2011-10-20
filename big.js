window.onload = function() {
    var s = document.getElementsByTagName('div'), cur = 0;
    if (!s) return;

    function hide() {
        for (var k = 0; k < s.length; k++) s[k].style.display = 'none';
    }

    function go(n) {
        hide();
        var i = 1000;
        s[n].style.display = 'inline';
        s[n].style.fontSize = i + 'px';
        while (
            s[n].offsetWidth > window.innerWidth ||
            s[n].offsetHeight > window.innerHeight) {
            i -= 10;
            s[n].style.fontSize = i + 'px';
        }
        window.location.hash = n;
    }

    document.onclick = function() {
        cur = ++cur % (s.length);
        go(cur);
    };

    document.onkeydown = function(e) {
        if (e.which === 39) {
            go(cur = Math.min(s.length - 1, ++cur));
        }
        if (e.which === 37) {
            go(cur = Math.max(0, --cur));
        }
    };

    if (window.location.hash) cur = Math.max(
        Math.min(
            s.length - 1,
            parseInt(window.location.hash.substring(1), 10)), 0) || cur;

    go(cur);
};
