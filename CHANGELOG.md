## 3.0.0

* **modes**: hit t, p, and j for talk, presentation, and jump modes
* **tooling**: now has cli tools to init, serve, and offline-pack presentations
* **breaking change**: background images are now specified with the data-background-image
  property, rather than an img tag
* **code style**: now uses normal style, longer, more commented code

## 2.0.3

* Nested `<div>` elements are now allowed in slides.

## 2.0.2

* Notes in `<notes>` are no longer included in the title of slides.

## 2.0.1

* Fixes an issue where clicking on a link in a slide advanced the slide
  as well as clicked the link.

## 2.0.0

* [63](https://github.com/tmcw/big/pull/63): a big performance improvement!
  Flipping between slides is now much faster.

## 1.0.0

* [50](https://github.com/tmcw/big/issues/50) Fixed IE9 and earlier support by accessing data attributes with `getAttribute`
  rather than the `dataset` object.
* [53](https://github.com/tmcw/big/issues/53) **Speakers notes**: adding
  notes in a `<notes>` element will show those notes in your developer
  console when you visit that slide.
