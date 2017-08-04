# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.2.0-0"></a>
# [3.2.0-0](https://github.com/tmcw/big/compare/v3.1.0...v3.2.0-0) (2017-08-04)


### Features

* command-line interface for generating presentations from markdown ([c5e3aa7](https://github.com/tmcw/big/commit/c5e3aa7))



<a name="3.3.0-0"></a>
# [3.3.0-0](https://github.com/tmcw/big/compare/v3.1.0...v3.3.0-0) (2017-08-04)


### Features

* command-line interface for generating presentations from markdown ([c5e3aa7](https://github.com/tmcw/big/commit/c5e3aa7))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/tmcw/big/compare/v2.0.3...v3.1.0) (2017-06-01)


### Bug Fixes

* Remove unused groupEnd argument ([f37e9fd](https://github.com/tmcw/big/commit/f37e9fd))


### Features

* apply data-bodyclass also on print/jump views ([#80](https://github.com/tmcw/big/issues/80)) ([52e6a31](https://github.com/tmcw/big/commit/52e6a31))
* Make it beautiful ([fd5d14f](https://github.com/tmcw/big/commit/fd5d14f))



<a name="3.1.0-alpha.0"></a>
# [3.1.0-alpha.0](https://github.com/tmcw/big/compare/v2.0.3...v3.1.0-alpha.0) (2017-06-01)


### Bug Fixes

* Remove unused groupEnd argument ([f37e9fd](https://github.com/tmcw/big/commit/f37e9fd))


### Features

* apply data-bodyclass also on print/jump views ([#80](https://github.com/tmcw/big/issues/80)) ([52e6a31](https://github.com/tmcw/big/commit/52e6a31))
* Make it beautiful ([97c5972](https://github.com/tmcw/big/commit/97c5972))



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
