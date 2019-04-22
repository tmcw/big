const ASPECT_RATIO = window.BIG_ASPECT_RATIO || 1.6;

function parseHash() {
  return parseInt(window.location.hash.substring(1), 10);
}

function ce(type, klass = "") {
  const element = document.createElement(type);
  element.className = klass;
  return element;
}

window.addEventListener("load", function() {
  let slideDivs = Array.from(document.querySelectorAll("body > div")),
    timeoutInterval;
  const { body } = document,
    { className: initialBodyClass } = body,
    notes = slideDivs.map(slide =>
      Array.from(slide.querySelectorAll("notes"), noteElement => {
        noteElement.parentNode.removeChild(noteElement);
        return noteElement.innerHTML.trim();
      })
    ),
    big = {
      current: -1,
      mode: "talk",
      forward: forward,
      reverse: reverse,
      go: go,
      length: slideDivs.length
    },
    pc = body.appendChild(ce("div", "presentation-container"));

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
    "This is a big presentation. You can: \n\n* press j to jump to a slide\n" +
      "* press p to see the print view\n* press t to go back to the talk view"
  );
  go(parseHash() || big.current);

  function useDataImageAsBackground(sc) {
    const { firstChild } = sc;
    if (firstChild.hasAttribute("data-background-image")) {
      sc.style.backgroundImage = `url("${firstChild.getAttribute(
        "data-background-image"
      )}")`;
      return firstChild.classList.add("imageText");
    }
    sc.style.backgroundImage = "";
    sc.style.backgroundColor = firstChild.style.backgroundColor;
  }

  function go(n, force) {
    n = Math.max(0, Math.min(big.length - 1, n));
    if (!force && big.current === n) return;
    big.current = n;
    const sc = slideDivs[n];
    const slideDiv = sc.firstChild;
    if (notes[n].length) {
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
    slideDivs.forEach((slide, i) => {
      slide.style.display = i === n ? "flex" : "none";
    });
    body.className = `talk-mode ${slideDiv.getAttribute("data-bodyclass") ||
      ""} ${initialBodyClass}`;
    useDataImageAsBackground(sc);
    if (timeoutInterval !== undefined) {
      window.clearInterval(timeoutInterval);
      timeoutInterval = undefined;
    }
    if (slideDiv.hasAttribute("data-time-to-next")) {
      const timeToNext = parseFloat(slideDiv.getAttribute("data-time-to-next"));
      timeoutInterval = window.setTimeout(forward, timeToNext * 1000);
    }
    slideDiv.focus();
    onResize();
    if (window.location.hash !== n) window.location.hash = n;
    document.title = slideDiv.textContent || slideDiv.innerText;
  }

  const forward = () => go(big.current + 1);
  const reverse = () => go(big.current - 1);

  function resizeTo(sc, width, height) {
    const slideDiv = sc.firstChild;
    const padding = Math.min(width * 0.04);
    let fontSize = height;
    sc.style.width = `${width}px`;
    sc.style.height = `${height}px`;
    slideDiv.style.padding = `${padding}px`;
    if (getComputedStyle(slideDiv).display === "grid")
      slideDiv.style.height = `${height - padding * 2}px`;
    for (const step of [100, 50, 10, 2]) {
      for (; fontSize > 0; fontSize -= step) {
        slideDiv.style.fontSize = `${fontSize}px`;
        if (
          slideDiv.scrollWidth <= width &&
          slideDiv.offsetHeight <= height &&
          Array.from(slideDiv.querySelectorAll("div")).every(
            elem =>
              elem.scrollWidth <= elem.clientWidth &&
              elem.scrollHeight <= elem.clientHeight
          )
        ) {
          break;
        }
      }
      fontSize += step;
    }
  }

  function emptyNode(node) {
    while (node.hasChildNodes()) node.removeChild(node.lastChild);
  }

  function onPrint() {
    if (big.mode === "print") return;
    body.className = `print-mode ${initialBodyClass}`;
    emptyNode(pc);
    slideDivs.forEach((sc, i) => {
      const subContainer = pc.appendChild(ce("div", "sub-container")),
        sbc = subContainer.appendChild(
          ce("div", sc.firstChild.getAttribute("data-bodyclass") || "")
        );
      sbc.appendChild(sc);
      sc.style.display = "flex";
      useDataImageAsBackground(sc);
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
    if (typeof i === "number") goTo = i;
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
      useDataImageAsBackground(sc);
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
    if (big.mode !== "jump") return;
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

  function getColumnIndexes(activeElement) {
    const { left } = activeElement.getBoundingClientRect();
    let lastIndex,
      foundSelf = false;
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
    if (slideDivs[i]) {
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
    if (big.mode === "talk") go(parseHash());
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
