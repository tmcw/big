# Upgrading to Big 4

Change for the better. Big 4 is a lot different.

## No more NPM

Big used to provide a bunch of utilities: big-compose so you could write presentations in Markdown, big-offline so you could make them work offline, big-init to start presentations, big-serve so you could serve them. I removed all of these.

**I removed big-compose** because I never used it, and it was never possible to do everything in Markdown, especially not layouts. Big is opinionated software: in particular, my opinions, and those I acquire from smart people along the way. One of those opinions is that HTML’s a pretty good language and if you aren't writing a lot, it’s perfectly usable as a markup language for text.

**big-offline** was cool, but I recommend using your browser’s “save webpage” feature instead, which produces a more efficient result and you already have in your web browser. I really recommend making your presentations work offline by default, too, by uploading images and keeping all your resources close.

**big-serve** was just a HTTP server. I don't underestimate the difficulty of setting up an HTML server for a lot of folks, but those folks are better served by double-clicking the `index.html` file, and local servers are really good in other projects, like the `serve` module.

**big-init** should just be a download. Now it is.

## No more audio tracks

It was a really cool feature, but I have a suspicion – and hard data — that almost nobody used it. Big is about minimalism, and niche features cut against that.

## No more Rubik font

The San Francisco font included with macOS is really good. Web fonts just rub me the wrong way, and I’ve tried really hard to avoid them in new projects – they’re big binary dependencies that make everything more complex. You can really use web fonts in your presentations, and please do if you find one you love, but it wasn’t a good default.