window.onload = function() {
    var s = document.getElementsByTagName('div'), cur = 0, prev=0;
    if (!s) return;
    function go(n) {
        cur = n;
        var i = 1e3, e = s[n];
         s[prev].style.display = 'none';
        e.style.display = 'inline';
        e.style.fontSize = i + 'px';
        if (e.firstChild.nodeName === 'IMG') {
            document.body.style.backgroundImage = 'url(' + e.firstChild.src + ')';
            e.firstChild.style.display = 'none';
        } else {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = e.style.backgroundColor;
        }
        while (
            e.offsetWidth > window.innerWidth ||
            e.offsetHeight > window.innerHeight) {
            e.style.fontSize = (i -= 10) + 'px';
            if (i < 0) break;
        }
        e.style.marginTop = ((window.innerHeight - e.offsetHeight) / 2) + 'px';
        if (window.location.hash !== n) window.location.hash = n;
        document.title = e.textContent || e.innerText;
    }
    document.onclick = function() {
    	prev=cur;
        go(++cur % (s.length));
    };
    document.onkeydown = function(e) {
        if(e.which === 39){
        	prev=cur;
        	go(Math.min(s.length - 1, ++cur));
        }
        else if(e.which === 37) {
        	prev=cur;
        	go(Math.max(0, --cur));
        }
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
   for (var k = 0; k < s.length; k++) s[k].style.display = 'none';
    go(cur);
};
