This is a ridiculous presentation system that works great for
creative, hurried people.

It makes text and images as big as they can be, gives you minimal
styling (`em`), and gives you left/right arrows for navigation.

Use it by throwing this HTML chunk at the top of pages.

```html
<html><head><title></title><link href='big.css' rel='stylesheet' type='text/css' /><script src='big.js'></script></head><body><span id='t'>
```

The last page has this to make sure you don't run off the tracks.

```html
<html><head><title></title><link href='big.css' rel='stylesheet' type='text/css' /><script src='big.js'></script></head><body class='last'><span id='t'>
```


# Authors

* tmcw
* visual style cribbed from stamen
