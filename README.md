This is a ridiculous presentation system that works great for
creative, hurried people. See [the demo](http://macwright.org/big)
for an example of it working.

It makes text and images as big as they can be, gives you minimal
styling (`em`), and gives you left/right arrows for navigation.

## Quickstart

You can skip every step by doing

    wget https://raw.github.com/tmcw/big/gh-pages/big.quickstart.html

This is a **bundle of all JS, CSS, and HTML code** - which means that it's
a bit harder to update, but there are **no external dependencies** here,
so no conference-wifi-pwn.

## Presentations with Big

* [the demo](http://macwright.org/big)
* [javascript for cats](http://maxogden.github.com/slides/empirejs/index.html#0) by [Max Ogden](http://maxogden.com/) for [empire js](http://empirejs.org/) and there's a
  [great video of him presenting it](http://www.youtube.com/watch?v=GeCWaTML3D0)
* [d3-geo](http://exposedata.com/talk/d3-geo/#0) by [Kai Chang](https://twitter.com/syntagmatic)
* [THREE.js + geo](http://bdon.org/talk-2013-1-29.html#0) by [Brandon Liu](http://bdon.org/)
* [esri2open](http://calvinmetcalf.github.io/esri2open/#0)
* [FOSS4G: Beyond](http://macwright.org/presentations/beyond/)
* [Project It Yourself](http://macwright.org/presentations/projections/#0)
* [Carto](http://macwright.org/presentations/carto/)
* [Freeing the DC Code](http://macwright.org/presentations/dccode/)
* [WhereCamp Boston](http://macwright.org/presentations/wherecampboston/) (big alpha)
* [foss4g](http://macwright.org/presentations/foss4g/1.html) (big alpha)
* Yours? Post it in issues.

# Stuff that works with big

* [bigclicker](https://github.com/tmcw/bigclicker) is a remote control for big
* [bigpy](https://github.com/harperreed/bigpy) lets you use Markdown with big by implementing it as a pre-processing step in Python
* [big-themes](https://github.com/tmcw/big-themes) ([website](http://macwright.org/big-themes/#0))
is a fledgling new repository for big themes. Try one, make one, take one home
today.

## Open Source

* Big is awesomer because [lambda](https://github.com/lambda), [mikeal](http://github.com/mikeal), and [BraulioVM](https://github.com/BraulioVM) contributed to it! And you can too: it's Public Domain, CC0.
* mdznr [has a really cool fork](https://github.com/mdznr/big) with [its own demo](http://mdznr.github.com/big/#0)

## HTML5

Big is totally HTML5! It uses the HTML5 doctype: `<!DOCTYPE html>`!
It's therefore imbued with standardslicious hypeclouds.

## Source

The source looks like:

```html
<!DOCTYPE html><html><head><title></title><link href='big.css' rel='stylesheet' type='text/css' /><script src='big.js'></script></head><body>
<div>Big</div>
<div><em>Presentation software</em> for busy busy hackers</div>
<div>text</div>
<div>as <em>big</em> as it can be</div>
<div>no config</div>
<div><em>1.5k</em></div>
<div><em>images too</em></div>
<div><img src='http://farm3.static.flickr.com/2506/5757000880_509440308e_z.jpg' /></div>
<div>JS+CSS <a href='https://github.com/tmcw/big'>github.com/ tmcw/ big</a></div>
```

## 'features'

* If you put an image as the first thing in a slide, it'll become a tiled background. I abused this power in
  [my presentation on project it yourself](http://macwright.org/presentations/projections/#0)

## See Also

* [Jed Schmidt's weenote is a awesome big-inspired software](https://github.com/jed/weenote)

