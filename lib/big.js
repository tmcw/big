window.addEventListener("load", function() {
  // document.body isn't a guaranteed value
  if (!document.body) {
    throw new Error(
      "big could not find a body element on this page, so it is exiting"
    );
  }

  var body = document.body;
  var initialBodyClass = body.className;
  var slideDivs = nodeListToArray(document.querySelectorAll("body > div"));

  if (!slideDivs.length) {
    throw new Error(
      "big couldn't find any slides in this presentation: " +
        "there are no divs directly within the body of this page"
    );
  }

  var ASPECT_RATIO = 1.6;
  var timeoutInterval;

  // Read the contents of `notes` elements as strings, and then
  // get rid of the elements themselves so that they don't interfere with
  // rendering.
  var notes = slideDivs.map(function(slide) {
    return nodeListToArray(slide.getElementsByTagName("notes")).map(function(
      noteElement
    ) {
      noteElement.parentNode.removeChild(noteElement);
      return noteElement.innerHTML.trim();
    });
  });

  /**
   * The big API
   * @public
   */
  var big = {
    /**
     * The current slide
     * @type {number}
     * @public
     */
    current: -1,
    /**
     * The current mode, one of 'talk', 'print', or 'jump'
     * @public
     */
    mode: "talk",
    /**
     * Move one slide forward
     * @function
     * @public
     */
    forward: forward,
    /**
     * Move one slide backward
     * @function
     * @public
     */
    reverse: reverse,
    /**
     * Go to a numbered slide
     * @function
     * @public
     */
    go: go,
    /**
     * The number of slides in this presentation
     * @type {number}
     * @public
     */
    length: slideDivs.length
  };

  var presentationContainer = body.appendChild(
    ce("div", "presentation-container")
  );

  slideDivs = slideDivs.map(function(slide, i) {
    slide.setAttribute("tabindex", 0);
    slide.classList.add("slide");

    if (slide.hasAttribute("data-background-image")) {
      var preloadLink = document.createElement("link");
      preloadLink.href = slide.getAttribute("data-background-image");
      preloadLink.rel = "preload";
      preloadLink.as = "image";
      document.head.appendChild(preloadLink);
    }

    var slideContainer = presentationContainer.appendChild(
      ce("div", "slide-container")
    );
    slideContainer.appendChild(slide);
    return slideContainer;
  });

  body.className = "talk-mode " + initialBodyClass;

  var printListener = window.matchMedia("print");
  printListener.addListener(onPrint);
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("touchstart", onTouchStart);
  window.addEventListener("hashchange", onHashChange);
  window.addEventListener("resize", onResize);
  window.big = big;

  console.log(
    "This is a big presentation. You can: \n\n" +
      "* press j to jump to a slide\n" +
      "* press p to see the print view\n" +
      "* press t to go back to the talk view"
  );
  go(parseHash() || big.current);

  /**
   * Parse the current window's hash, returning a number for a
   * slide.
   * @returns {number} slide number
   */
  function parseHash() {
    return parseInt(window.location.hash.substring(1), 10);
  }

  /**
   * Just save some typing when we refer to document.createElement
   *
   * @param {string} type
   * @param {string?} klass
   * @returns {HTMLElement}
   */
  function ce(type, klass) {
    var element = document.createElement(type);
    if (klass) {
      element.className = klass;
    }
    return element;
  }

  /**
   * Turn a NodeList, returned by querySelectorAll or another DOM method,
   * into an Array with array methods.
   * @param {NodeList} nodeList
   * @returns {Array<HTMLElement>} array of nodes
   */
  function nodeListToArray(nodeList) {
    return [].slice.call(nodeList);
  }

  /**
   * Given a slide number, if there are notes for that slide,
   * print them to the console.
   */
  function printNotesToConsole(n) {
    if (notes[n].length && "group" in console) {
      console.group(n);
      notes[n].forEach(function(note) {
        console.log(
          "%c%s",
          "padding:5px;font-family:serif;font-size:18px;line-height:150%;",
          note
        );
      });
      console.groupEnd();
    }
  }

  function useDataImageAsBackground(slideContainer) {
    var slideDiv = slideContainer.firstChild;
    if (slideDiv.hasAttribute("data-background-image")) {
      slideContainer.style.backgroundImage =
        'url("' + slideDiv.getAttribute("data-background-image") + '")';
      slideDiv.classList.add("imageText");
    } else {
      slideContainer.style.backgroundImage = "";
      slideContainer.style.backgroundColor = slideDiv.style.backgroundColor;
    }
  }

  /**
   * The central navigation method: given a slide number, it goes to that slide
   * and sets it up.
   *
   * @param {number} n slide index
   */
  function go(n, force) {
    // Ensure that the slide we're going to is in range: it isn't
    // less than 0 or higher than the actual number of slides available.
    n = Math.max(0, Math.min(big.length - 1, n));
    // Avoid doing extra work if we're going from a slide to itself.
    if (!force && big.current === n) return;
    big.current = n;
    var slideContainer = slideDivs[n];
    var slideDiv = slideContainer.firstChild;
    printNotesToConsole(n);

    slideDivs.forEach(function(slide, i) {
      slide.style.display = i === n ? "flex" : "none";
    });

    body.className =
      "talk-mode " +
      (slideDiv.getAttribute("data-bodyclass") || "") +
      " " +
      initialBodyClass;

    useDataImageAsBackground(slideContainer);

    // If a previous slide had set a timer to auto-advance but
    // the user navigated before it fired, cancel it.
    if (timeoutInterval !== undefined) {
      window.clearInterval(timeoutInterval);
    }

    // If this slide has a time-to-next data attribute, set a
    // timer that advances to the next slide within that many
    // seconds.
    if (slideDiv.hasAttribute("data-time-to-next")) {
      var timeToNextStr = slideDiv.getAttribute("data-time-to-next");
      var timeToNext = parseFloat(timeToNextStr);
      if (isNaN(timeToNext)) {
        throw new Error(
          "big encountered a bad value for the time-to-next string: " +
            timeToNextStr
        );
      }
      timeoutInterval = window.setTimeout(forward, timeToNext * 1000);
    }

    slideDiv.focus();
    onResize();
    if (window.location.hash !== n) {
      window.location.hash = n;
    }
    document.title = slideDiv.textContent || slideDiv.innerText;
  }

  function forward() {
    go(big.current + 1);
  }

  function reverse() {
    go(big.current - 1);
  }

  /**
   * This is the 'meat': it resizes a slide to a certain size. In
   * talk mode, that size is the side of an aspect-fit box inside of
   * the display. In jump and print modes, that size is a certain fixed
   * pixel size.
   *
   * @param {HTMLElement} slideContainer
   * @param {number} width
   * @param {number} height
   */
  function resizeTo(slideContainer, width, height) {
    var slideDiv = slideContainer.firstChild;
    var fontSize = height;
    slideContainer.style.width = width + "px";
    slideContainer.style.height = height + "px";
    [100, 50, 10, 2].forEach(function(step) {
      for (; fontSize > 0; fontSize -= step) {
        slideDiv.style.fontSize = fontSize + "px";
        if (slideDiv.offsetWidth <= width && slideDiv.offsetHeight <= height) {
          break;
        }
      }
      fontSize += step;
    });
  }

  function emptyNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  // Event listeners ===========================================================

  function onPrint() {
    if (big.mode === "print") return;
    body.className = "print-mode " + initialBodyClass;
    emptyNode(presentationContainer);
    slideDivs.forEach(function(slideContainer, i) {
      var subContainer = presentationContainer.appendChild(
        ce("div", "sub-container")
      );
      var slideBodyContainer = subContainer.appendChild(
        ce(
          "div",
          slideContainer.firstChild.getAttribute("data-bodyclass") || ""
        )
      );
      slideBodyContainer.appendChild(slideContainer);
      slideContainer.style.display = "flex";
      useDataImageAsBackground(slideContainer);
      resizeTo(slideContainer, 512, 320);
      if (notes[i].length) {
        var notesUl = subContainer.appendChild(ce("ul", "notes-list"));
        notes[i].forEach(function(note) {
          var li = notesUl.appendChild(ce("li"));
          li.innerText = note;
        });
      }
    });

    big.mode = "print";
  }

  function onTalk(i) {
    if (big.mode === "talk") return;
    big.mode = "talk";
    body.className = "talk-mode " + initialBodyClass;
    emptyNode(presentationContainer);
    slideDivs.forEach(function(slideContainer) {
      presentationContainer.appendChild(slideContainer);
    });
    var goTo = big.current;
    if (typeof i === "number") {
      goTo = i;
    }
    go(goTo, true);
  }

  function onJump() {
    if (big.mode === "jump") return;
    big.mode = "jump";
    body.className = "jump-mode " + initialBodyClass;
    emptyNode(presentationContainer);
    slideDivs.forEach(function(slideContainer, i) {
      var subContainer = presentationContainer.appendChild(
        ce("div", "sub-container")
      );
      subContainer.addEventListener("keypress", function(e) {
        if (e.key !== "Enter") return;
        subContainer.removeEventListener("click", onClickSlide);
        e.stopPropagation();
        e.preventDefault();
        onTalk(i);
      });
      var slideBodyContainer = subContainer.appendChild(
        ce(
          "div",
          slideContainer.firstChild.getAttribute("data-bodyclass") || ""
        )
      );
      slideBodyContainer.appendChild(slideContainer);
      slideContainer.style.display = "flex";
      useDataImageAsBackground(slideContainer);
      resizeTo(slideContainer, 192, 120);
      function onClickSlide(e) {
        subContainer.removeEventListener("click", onClickSlide);
        e.stopPropagation();
        e.preventDefault();
        onTalk(i);
      }
      subContainer.addEventListener("click", onClickSlide);
    });
  }

  function onClick(e) {
    if (big.mode !== "talk") return;
    if (e.target.tagName !== "A") go((big.current + 1) % big.length);
  }

  function onKeyDown(e) {
    if (big.mode === "talk") {
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          return reverse();
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          return forward();
      }
    }
    switch (e.key) {
      case "p":
        onPrint();
        break;
      case "t":
        onTalk();
        break;
      case "j":
        onJump();
        break;
    }
    if (big.mode === "jump") {
      var activeElement = document.activeElement;
      if (activeElement && activeElement.classList.contains("slide")) {
        var column = [];
        var startIndex = slideDivs.indexOf(activeElement.parentNode);
        var columnIndexes = getColumnIndexes(activeElement);
        jumpFocus(
          e,
          {
            ArrowLeft: startIndex - 1,
            ArrowRight: startIndex + 1,
            ArrowDown: columnIndexes.next,
            ArrowUp: columnIndexes.prev
          }[e.key]
        );
      } else if (e.key.indexOf("Arrow") === 0) {
        jumpFocus(e, 0);
      }
    }
  }

  function getColumnIndexes(activeElement) {
    var left = activeElement.getBoundingClientRect().left;
    var lastIndex;
    var foundSelf = false;
    for (var i = 0; i < slideDivs.length; i++) {
      if (slideDivs[i].firstChild.getBoundingClientRect().left === left) {
        if (foundSelf) return { prev: lastIndex, next: i };
        if (slideDivs[i] === activeElement.parentNode) {
          foundSelf = true;
        } else {
          lastIndex = i;
        }
      }
    }
    return { prev: lastIndex };
  }

  function jumpFocus(e, i) {
    if (typeof i === "number" && slideDivs[i]) {
      e.preventDefault();
      slideDivs[i].firstChild.focus();
    }
  }

  function onTouchStart(e) {
    if (big.mode !== "talk") return;
    // When the 'once' option to addEventListener is available, we'll be able to
    // simplify this code, but for now we manually remove the End listener
    // after it is invoked once
    var startingPageX = e.changedTouches[0].pageX;
    document.addEventListener("touchend", onTouchEnd);

    function onTouchEnd(e2) {
      document.removeEventListener("touchend", onTouchEnd);
      var distanceTraveled = e2.changedTouches[0].pageX - startingPageX;
      // Don't navigate if the person didn't swipe by fewer than 4 pixels
      if (Math.abs(distanceTraveled) < 4) return;
      if (distanceTraveled < 0) forward();
      else reverse();
    }
  }

  function onHashChange() {
    if (big.mode !== "talk") return;
    go(parseHash());
  }

  function onResize() {
    if (big.mode !== "talk") return;
    var documentElement = document.documentElement;
    if (!documentElement) {
      throw new Error(
        "document.documentElement not found, this environment is weird"
      );
    }
    var width = documentElement.clientWidth;
    var height = documentElement.clientHeight;
    // Too wide
    if (width / height > ASPECT_RATIO) {
      width = Math.ceil(height * ASPECT_RATIO);
    } else {
      height = Math.ceil(width / ASPECT_RATIO);
    }
    resizeTo(slideDivs[big.current], width, height);
  }
});
