window.onload = function() {
    var t = document.getElementById('t'), i = 10;

    if (!t.innerHTML) return;

    t.style.fontSize = ++i;

    do {
        t.style.fontSize = (i += 0.5);
    } while (
        i < 10000 &&
        t.offsetWidth < window.innerWidth &&
        t.offsetHeight < (window.innerHeight - 10)
   );

    window.onkeydown = function(e) {
        window.location = window.location.href.replace(/(\d+)\.html$/, function(d) {
            var n = parseInt(d, 10);
            if (!document.body.className.match(/last/g) && e.which === 39) {
                return (++n) + '.html';
            } else if (n !== 1 && e.which === 37) {
                return (--n) + '.html';
            } else {
                return n + '.html';
            }
        });
    };
};
