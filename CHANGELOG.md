# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.2.3"></a>
## [3.2.3](https://github.com/tmcw/big/compare/v3.2.2...v3.2.3) (2018-05-16)


### Bug Fixes

* Add page breaks in print mode ([#149](https://github.com/tmcw/big/issues/149)) ([f89c9fd](https://github.com/tmcw/big/commit/f89c9fd))



<a name="3.2.2"></a>
## [3.2.2](https://github.com/tmcw/big/compare/v3.2.1...v3.2.2) (2018-05-12)


### Bug Fixes

* **package:** update cpy to version 7.0.0 ([#146](https://github.com/tmcw/big/issues/146)) ([d96a22c](https://github.com/tmcw/big/commit/d96a22c))



<a name="3.2.1"></a>
## [3.2.1](https://github.com/tmcw/big/compare/v3.2.0...v3.2.1) (2018-04-15)


### Bug Fixes

* **package:** update cpy to version 6.0.0 ([#107](https://github.com/tmcw/big/issues/107)) ([22b2c41](https://github.com/tmcw/big/commit/22b2c41))
* **package:** update ecstatic to version 3.0.0 ([#103](https://github.com/tmcw/big/issues/103)) ([d4612b4](https://github.com/tmcw/big/commit/d4612b4))
* **package:** update ecstatic to version 3.1.1 ([#115](https://github.com/tmcw/big/issues/115)) ([e62bb04](https://github.com/tmcw/big/commit/e62bb04)), closes [#114](https://github.com/tmcw/big/issues/114)
* Use event.key instead of event.which ([#131](https://github.com/tmcw/big/issues/131)) ([41e46d4](https://github.com/tmcw/big/commit/41e46d4)), closes [#129](https://github.com/tmcw/big/issues/129)



<a name="3.2.0"></a>
# [3.2.0](https://github.com/tmcw/big/compare/v3.2.0-0...v3.2.0) (2017-08-04)



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
