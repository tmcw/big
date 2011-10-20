window.onload = function() {
    var s = document.getElementsByTagName('section'), cur = 0;
    if (!s) return;

    function hide() {
        for (var k = 0; k < s.length; k++) s[k].style.display = 'none';
    }

    function g(n) {
        hide();
        var i = 1000;
        s[n].style.display = 'block';
        s[n].style.fontSize = i + 'px';
        while (
            s[n].offsetWidth > window.innerWidth ||
            s[n].offsetHeight > window.innerHeight) {
            i -= 10;
            s[n].style.fontSize = i + 'px';
        }
    }

    g(0);

    window.onkeydown = function(e) {
        if (e.which === 39) {
            cur = Math.min(s.length - 1, ++cur);
            g(cur);
        } else if (e.which === 37) {
            cur = Math.max(0, --cur);
            g(cur);
        }
    };
};
