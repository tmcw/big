<p align="center">
  <img width="540" src='.github/logo.png' />
</p>

<p align="center">
  <strong>Big.</strong> The antidote to your presentation procrastination.
</p>

A presentation system that works great for creative, hurried people making focused presentations. Stop tweaking fonts and filling slides with text. Big is a configuration-free system that naturally encourages good style.

### Features

- The entire system is about 16kb
- Slide layouts based on CSS Grid
- Includes tools to make presentations self-contained so you can present offline
- Speakers notes appear in your developer console, which you can put on your other screen
- Several themes available

### Quickstart

_These instructions assume you have [NPM](https://www.npmjs.com/get-npm) installed._

Use the `big create` command to create a new presentation. This will create a new directory and include the HTML, CSS, and JavaScript necessary.

```sh
$ npx big-presentation big create all-about-cats
```

Serve that presentation so you can preview it locally:

```sh
$ cd all-about-cats
$ npx big-presentation big serve
```

Copy in any online resources for the presentation so that you can show it without an internet connection.

```sh
$ npx big-presentation offline
```

:tada: :tada: :tada: :tada: :tada:

* [Demo](http://macwright.org/big/demo.html)
* :blue_book: [User Guide](docs/user-guide.md)
* :green_book: [API Documentation](docs/api.md)
* :pencil: [Protips](docs/protips.md)
* :camera: [Presentations using big](docs/awesome-big.md)
* :grapes: [Related projects](docs/see-also.md)

---

[![Circle CI](https://circleci.com/gh/tmcw/big/tree/gh-pages.svg?style=shield&circle-token=2963848e42fe67b8a66a2ad2d6dd99d05bdde6a4)](https://circleci.com/gh/tmcw/big/tree/gh-pages) [![Greenkeeper badge](https://badges.greenkeeper.io/tmcw/big.svg)](https://greenkeeper.io/)
