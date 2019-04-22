function parseHash() {
  return parseInt(window.location.hash.substring(1), 10);
}

function ce(type, klass = "") {
  const element = document.createElement(type);
  element.className = klass;
  return element;
}

window.addEventListener("load", function() {
  const ASPECT_RATIO = 1.6;

  const { body } = document;
  const { className: initialBodyClass } = body;
  let slideDivs = Array.from(document.querySelectorAll("body > div"));

  if (!slideDivs.length) {
    throw new Error(
      "big couldn't find any slides in this presentation: " +
        "there are no divs directly within the body of this page"
    );
  }

  let timeoutInterval;

  const notes = slideDivs.map(slide =>
    Array.from(slide.querySelectorAll("notes"), noteElement => {
      noteElement.parentNode.removeChild(noteElement);
      return noteElement.innerHTML.trim();
    })
  );

  const big = {
    current: -1,
    mode: "talk",
    forward: forward,
    reverse: reverse,
    go: go,
    length: slideDivs.length
  };

  const pc = body.appendChild(ce("div", "presentation-container"));

  slideDivs = slideDivs.map(slide => {
    slide.setAttribute("tabindex", 0);
    slide.classList.add("slide");

    if (slide.hasAttribute("data-background-image")) {
      const preloadLink = document.createElement("link");
      preloadLink.href = slide.getAttribute("data-background-image");
      preloadLink.rel = "preload";
      preloadLink.as = "image";
      document.head.appendChild(preloadLink);
    }

    const sc = pc.appendChild(ce("div", "slide-container"));
    sc.appendChild(slide);
    return sc;
  });

  body.className = "talk-mode " + initialBodyClass;

  window.matchMedia("print").addListener(onPrint);
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

  function printNotesToConsole(n) {
    if (notes[n].length && "group" in console) {
      console.group(n);
      for (const note of notes[n]) {
        console.log(
          "%c%s",
          "padding:5px;font-family:serif;font-size:18px;line-height:150%;",
          note
        );
      }
      console.groupEnd();
    }
  }

  function useDataImageAsBackground(sc) {
    const { firstChild: slideDiv } = sc;
    if (slideDiv.hasAttribute("data-background-image")) {
      sc.style.backgroundImage = `url("${slideDiv.getAttribute(
        "data-background-image"
      )}")`;
      slideDiv.classList.add("imageText");
    } else {
      sc.style.backgroundImage = "";
      sc.style.backgroundColor = slideDiv.style.backgroundColor;
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
    const sc = slideDivs[n];
    const slideDiv = sc.firstChild;
    printNotesToConsole(n);

    slideDivs.forEach((slide, i) => {
      slide.style.display = i === n ? "flex" : "none";
    });

    body.className = `talk-mode ${slideDiv.getAttribute("data-bodyclass") ||
      ""} ${initialBodyClass}`;

    // useDataImageAsBackground(sc);

    // If a previous slide had set a timer to auto-advance but
    // the user navigated before it fired, cancel it.
    if (timeoutInterval !== undefined) {
      window.clearInterval(timeoutInterval);
      timeoutInterval = undefined;
    }

    // If this slide has a time-to-next data attribute, set a
    // timer that advances to the next slide within that many
    // seconds.
    if (slideDiv.hasAttribute("data-time-to-next")) {
      const timeToNext = parseFloat(slideDiv.getAttribute("data-time-to-next"));
      timeoutInterval = window.setTimeout(forward, timeToNext * 1000);
    }

    slideDiv.focus();
    onResize();
    if (window.location.hash !== n) window.location.hash = n;
    document.title = slideDiv.textContent || slideDiv.innerText;
  }

  function forward() {
    go(big.current + 1);
  }

  function reverse() {
    go(big.current - 1);
  }

  function resizeTo(sc, width, height) {
    const slideDiv = sc.firstChild;
    let fontSize = height;
    sc.style.width = `${width}px`;
    sc.style.height = `${height}px`;

    for (const step of [100, 50, 10, 2]) {
      for (; fontSize > 0; fontSize -= step) {
        slideDiv.style.fontSize = `${fontSize}px`;
        if (slideDiv.scrollWidth <= width && slideDiv.offsetHeight <= height) {
          break;
        }
      }
      fontSize += step;
    }
  }

  function emptyNode(node) {
    while (node.hasChildNodes()) node.removeChild(node.lastChild);
  }

  // Event listeners
  function onPrint() {
    if (big.mode === "print") return;
    body.className = `print-mode ${initialBodyClass}`;
    emptyNode(pc);
    slideDivs.forEach((sc, i) => {
      const subContainer = pc.appendChild(ce("div", "sub-container"));
      const sbc = subContainer.appendChild(
        ce("div", sc.firstChild.getAttribute("data-bodyclass") || "")
      );
      sbc.appendChild(sc);
      sc.style.display = "flex";
      // useDataImageAsBackground(sc);
      resizeTo(sc, 512, 320);
      if (notes[i].length) {
        const notesUl = subContainer.appendChild(ce("ul", "notes-list"));
        for (const note of notes[i]) {
          const li = notesUl.appendChild(ce("li"));
          li.innerText = note;
        }
      }
    });

    big.mode = "print";
  }

  function onTalk(i) {
    if (big.mode === "talk") return;
    big.mode = "talk";
    body.className = `talk-mode ${initialBodyClass}`;
    emptyNode(pc);
    for (const sc of slideDivs) pc.appendChild(sc);
    let goTo = big.current;
    if (typeof i === "number") {
      goTo = i;
    }
    go(goTo, true);
  }

  function onJump() {
    if (big.mode === "jump") return;
    big.mode = "jump";
    body.className = "jump-mode " + initialBodyClass;
    emptyNode(pc);
    slideDivs.forEach((sc, i) => {
      const subContainer = pc.appendChild(ce("div", "sub-container"));
      subContainer.addEventListener("keypress", e => {
        if (e.key !== "Enter") return;
        subContainer.removeEventListener("click", onClickSlide);
        e.stopPropagation();
        e.preventDefault();
        onTalk(i);
      });
      const sbc = subContainer.appendChild(
        ce("div", sc.firstChild.getAttribute("data-bodyclass") || "")
      );
      sbc.appendChild(sc);
      sc.style.display = "flex";
      // useDataImageAsBackground(sc);
      resizeTo(sc, 192, 120);
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
      const { activeElement } = document;
      if (activeElement && activeElement.classList.contains("slide")) {
        const startIndex = slideDivs.indexOf(activeElement.parentNode);
        const columnIndexes = getColumnIndexes(activeElement);
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
    const { left } = activeElement.getBoundingClientRect();
    let lastIndex;
    let foundSelf = false;
    for (let i = 0; i < slideDivs.length; i++) {
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
    const { pageX: startingPageX } = e.changedTouches[0];
    document.addEventListener("touchend", onTouchEnd, { once: true });

    function onTouchEnd(e2) {
      const distanceTraveled = e2.changedTouches[0].pageX - startingPageX;
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
    let { clientWidth: width, clientHeight: height } = document.documentElement;
    // Too wide
    if (width / height > ASPECT_RATIO) {
      width = Math.ceil(height * ASPECT_RATIO);
    } else {
      height = Math.ceil(width / ASPECT_RATIO);
    }
    resizeTo(slideDivs[big.current], width, height);
  }
});
