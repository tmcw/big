# big cookbook

The ideal presentation is gesamtkunstwerk. While the big default style and
behavior is nice and simple, there are lots of things you might want as
you go along in your presentation-crafting. Having done
quite a few [presentations](http://www.macwright.org/presentations/)
using this system, I've done a lot of per-presentation tweaks and have some
general-usage protips to share.

Recipes are presented as HTML, that would go in `index.html`, and CSS,
that can go in `big.css`.

## Theory

* Presentations are webpages, and should be created and styled in the same
  way, using HTML & CSS
* Embrace resolution and aspect ratio diversity and make presentations
  work on a variety of screens and in lots of environments.

## Avoiding text breaks

By default, **big** will wrap text the same way your browser does. Sometimes
this isn't what you desire, like if you want a title to be on the same line.

```html
<div>
  beyond the <code>for</code> loop
  <br />
  <small class='nobreak'>@tmcw / Tom MacWright / Mapbox</small>
</div>
```

```css
.nobreak {
    white-space:pre;
}
```

The `nobreak` class uses the CSS `white-space` property to prevent linebreaks
from appearing anywhere within the contained text.

## Blinking text

Blinking text, like that [previously supported by the `<blink>` tag](https://en.wikipedia.org/wiki/Blink_element)
can be an effective tool if used judiciously: it draws attention to
slides in a simple and straightforward way. By using CSS's `keyframes`
construct, you can make an entire slide or part of a slide tastefully
pulse.

```html
<div class='blink'>
    [questions]
</div>
```

```css
@-webkit-keyframes blinker {
  from { opacity: 1.0; }
  to { opacity: 0.5; }
}
.blink {
  -webkit-animation-name: blinker;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: cubic-bezier(1.0,0,0,1.0);
  -webkit-animation-duration: 800ms;
}
```

## Code

There are many ways to do code highlighting in presentations. My personal
philosophy is that **you should never show more than 8 lines of code**
on a slide, and instead of using traditional semantic highlighting, you should
manually add emphasis to focus points in the code. See an example of this
in [beyond for](http://www.macwright.org/presentations/beyondfor/#15).

```html
<div>
    problem one: make some animals rock
    <pre>var animals = <em>['cats', 'dogs']</em>;</pre>
</div>
```

```css
pre {
    margin:0;
    padding:0.2em;
    background:#fff;
    color:#000;
    font-weight:normal;
}

pre em {
    color:#000;
    background:yellow;
}
```

## Fancy Fonts

You can set up fancy fonts with big the same way you would with a website:
by using a font CDN like [Google Fonts](http://www.google.com/fonts)
or downloading them from places like [FontSquirrel](http://www.fontsquirrel.com/).
Downloading webfonts to the same directory as your presentation
means that they'll work even if you're offine when you give the talk.

This time the HTML example goes in the `<head>` element rather than in a slide.

```html
<link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
```

```css
body {
    font-family: 'Roboto', sans-serif;
}
```

## Backgrounds

By default, `big` has a plain white background. If you make an image the first
thing in a slide, then it'll make that image the background image of the slide -
it's just a convenient little shortcut.

Note that making the image the first thing in a slide means that the element
must **go directly after the `<div>` tag with no space**. Whitespace in HTML
is an element, too - a TextNode.

Anyway - by default, big has the rule `background-size:100%;` set on slides.
This means that the background will be positioned to fit _within_ the slide's
dimensions. This isn't always what you want - for instance, if your background
is like an "image of the stars" and you don't terribly mind part of it
getting cut off but do definitely want it to cover the whole slide, you can
change that rule in `big.css` to

```css
body {
    background-size: cover;
}
```

And sometimes you want more control than that: let's say that you have
one slide that you want a [patterned background](http://www.macwright.org/presentations/projections/#0)
under, but a bunch that you don't. For this you can use the bodyclass feature,
in conjunction with a class that triggers repeating background images scaled
at their native size:

```css
body.background-repeat {
    background-size: auto;
    background-repeat: repeat;
}
```

```html
<div data-bodyclass='background-repeat'><img src='background-pattern.png' />
</div>
```

## Speakers Notes

What if you want to store some commentary and hints for your presentation, like
_speakers notes_? Let's say that your slide looks like

```html
<div>
  Complicated topic
</div>
```

Add a `notes` element

```html
<div>
  Complicated topic
  <notes>This topic is complicated, but really it's just a kind of tensor</notes>
</div>
```

Then open your [developer console](http://debugbrowser.com/), and you'll see your
speaker notes in it when you visit that slide! In most browsers, the console is detachable,
too, so you can move it to a different screen or window when you're giving the presentation.
