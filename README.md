[![Circle CI](https://circleci.com/gh/tmcw/big/tree/gh-pages.svg?style=svg&circle-token=2963848e42fe67b8a66a2ad2d6dd99d05bdde6a4)](https://circleci.com/gh/tmcw/big/tree/gh-pages)

This is a ridiculous presentation system that works great for
creative, hurried people. See [the demo](http://macwright.org/big/demo.html)
for an example of it working.

It makes text and images as big as they can be, gives you minimal
styling (`em`) and keyboard controls for navigation.

## Quickstart

You can skip every step by doing

    wget https://raw.github.com/tmcw/big/gh-pages/big.quickstart.html

This is a **bundle of all JS, CSS, and HTML code** - which means that it's
a bit harder to update, but there are **no external dependencies** here,
so no conference-wifi-pwn.

## Slowstart

big makes sense if you're comfortable with JavaScript, CSS, and HTML.
If you are very familiar with those languages, you can jump right in.
Otherwise, here are some tips:

* When you are working locally you can view your slides by opening your
  presentation in a browser. Remember to save the file as a `.html`.
* Use `<div>` & `</div>` around each slide
* You may be used to `em` displaying as italicized text, but in big emphasized
  text is green and unitalicized. You can change this default behavior in the header. <em>(Look, Ma-- CSS in action!)</em>
* Paragraph tags aren't displayed in big. This can be a useful place for you
  to store your speaking notes. (I don't actually understand this, but I've seen it done)
* If you'll have internet access when you present, you can reference images
  hosted online. If you won't, any images you want to reference will need to
  be in the same folder as your presentation.

## Examples

A full presentation looks like:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Big</title>
  <meta charset='utf-8'>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
  <link href='big.css' rel='stylesheet' type='text/css' />
  <script src='big.js'></script>
</head>
<body>
<div>use &harr; to navigate</div>
<div>Big</div>
<div class="center"><em>Presentation software</em> for busy busy hackers</div>
<div>+text</div>
<div>as <em>big</em> as it can be</div>
<div data-time-to-next="3">and now it's perfect for ignite talks (wait 3 seconds)</div>
<div>no config</div>
<div><em>1.5k</em></div>
<div><img src='http://farm3.static.flickr.com/2506/5757000880_509440308e_z.jpg' /> images too</div>
<div data-bodyclass="new-shiny">per slide body classes</div>
<div>JS+CSS <a href='https://github.com/tmcw/big'>github.com/ tmcw/ big</a></div>
</body>
</html>
```

Here's how you write a single slide

```html
<div>Hello, I am a slide</div>
```

A slide that automatically advances in 5 seconds

```html
<div data-time-to-next='5'>Life is short but sweet for certain</div>
```

A slide that changes the body tag's class to 'minard'

```html
<div data-bodyclass='minard'>Winter sucks</div>
```

## Features

* If you put an image as the first thing in a slide, it'll become the slide's background. I abused this power in
  [my presentation on project it yourself](http://macwright.org/presentations/projections/#0)
* You can swipe left & right on mobile devices to go back and forth.
* Add `data-time-to-next="5"` as an attribute to a slide and the slide will auto-advance after 5 seconds - useful for ignite talks.
* Add `data-bodyclass="something"` to add a custom class to the body tag. Useful for making changes to one slide at a time.
* Add `<notes>Write your speakers notes here</notes>` in a slide to add speakers notes.
  These notes will appear in your web developer console when you go to
  the slide.

## Protips

* [The big cookbook covers a few useful techniques for controlling the style and behavior of your slides](COOKBOOK.md)

## JavaScript API

big exposes a JavaScript API via the `big` object:

* `big.current`: the current slide as a number between `0` and `big.length`
* `big.length`: the number of slides
* `big.forward()`: go forward 1 slide. at the last slide, do nothing.
* `big.reverse()`: go back 1 slide. at the first slide, do nothing.
* `big.go(number)`: go to a specific slide, given its number.

## Installation with `npm`

big is available on `npm` as the `big-presentation` package.

    npm install --save big-presentation

## Presentations with Big

* [the demo](http://macwright.org/big/demo.html)
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
* [Python for Random People](http://isaacjg.github.io/intro_to_python/python_presentation/python_presentation.html#0) by @IsaacJG
* [Open Data with CouchDB](http://pres.macode.org)
* [deanbrew](http://dbsgeo.com/deanbrew/#0)
* [anatomy of a web map](http://maptime.github.io/anatomy-of-a-web-map/)
* [intro to web mapping at open data day](http://copystar.github.io/intro-web-mapping-odd14/)
* [What is Dat data management?](https://maxogden.github.io/slides/okcon/index.html#0)
* [Sam Franklin on Open Source GIS at OSGIS](http://samfranklin.github.io/osgis2014/)
* [Ryan Cooper's  "Where's the Story?" from KYGIS2014](http://ryan-m-cooper.com/kygis2014/)
* [Web Maps Without Web Maps @ SOTM by Tyler Dahlberg](http://tdahlberg.github.io/somworkshop2015/)
* Yours? Post it in issues.

# Stuff that works with big

* [big-printer](https://github.com/tmcw/big-printer) create "notes" pages from big presentations.
* [Draft](https://draftin.com/), a version control and collaboration tool for writers, uses big for its presentation mode
* [bigout](https://github.com/abenrob/bigout) exports big presentations to PDF
* [Slidepad](http://slidepad.herokuapp.com/), a docpad server, supports big
* [bigpy](https://github.com/harperreed/bigpy) lets you use Markdown with big by implementing it as a pre-processing step in Python
* [big-themes](https://github.com/tmcw/big-themes) ([website](http://macwright.org/big-themes/#0))
is a fledgling new repository for big themes. Try one, make one, take one home
today.
* [big-gist](http://big.artemis.cat/) is a tool to create presentations even faster, using Markdown and GitHub Gists

## Open Source

* Big is awesomer because [lots of people](https://github.com/tmcw/big/graphs/contributors)
  contributed to it! And you can too: it's Public Domain, CC0.
* mdznr [has a really cool fork](https://github.com/mdznr/big)
  with [its own demo](http://mdznr.github.com/big/#0)
* Calvin Metcalf has a [fork that includes on-the-fly Markdown support](https://github.com/calvinmetcalf/medium)

## See Also

* [Jed Schmidt's weenote is a awesome big-inspired software](https://github.com/jed/weenote)
