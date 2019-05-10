let ASPECT_RATIO = window.BIG_ASPECT_RATIO === undefined ? 1.6 : window.BIG_ASPECT_RATIO;

function parseHash() {
  return parseInt(window.location.hash.substring(1), 10);
}

function emptyNode(node) {
  while (node.hasChildNodes()) node.removeChild(node.lastChild);
}

function ce(type, klass = "") {
  let element = document.createElement(type);
  element.className = klass;
  return element;
}

addEventListener("load", function() {
  let slideDivs = Array.from(document.querySelectorAll("body > div"));
  let pc = document.body.appendChild(ce("div", "presentation-container"));
  slideDivs = slideDivs.map((slide, _i) => {
    slide.setAttribute("tabindex", 0);
    slide.classList.add("slide");
    let sc = pc.appendChild(ce("div", "slide-container"));
    sc.appendChild(slide);
    return Object.assign(sc, {
      _notes: Array.from(slide.querySelectorAll("notes"), noteElement => {
        noteElement.parentNode.removeChild(noteElement);
        return noteElement.innerHTML.trim();
      }),
      _i
    });
  });
  let timeoutInterval,
    { body } = document,
    {
      className: initialBodyClass,
      style: { cssText: initialBodyStyle }
    } = body,
    big = (window.big = {
      current: -1,
      mode: "talk",
      forward: forward,
      reverse: reverse,
      go: go,
      length: slideDivs.length
    });
  function forward() {
    go(big.current + 1);
  }
  function reverse() {
    go(big.current - 1);
  }

  body.className = `talk-mode ${initialBodyClass}`;
  window.matchMedia("print").addListener(onPrint);
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("touchstart", onTouchStart);
  addEventListener("hashchange", onHashChange);
  addEventListener("resize", onResize);
  window.big = big;
  console.log("This is a big presentation. You can: \n\n* press j to jump to a slide\n" + "* press p to see the print view\n* press t to go back to the talk view");
  go(parseHash() || big.current);

  function go(n, force) {
    n = Math.max(0, Math.min(big.length - 1, n));
    if (!force && big.current === n) return;
    big.current = n;
    let sc = slideDivs[n],
      slideDiv = sc.firstChild;
    if (sc._notes.length) {
      console.group(n);
      for (let note of sc._notes) console.log("%c%s", "padding:5px;font-family:serif;font-size:18px;line-height:150%;", note);
      console.groupEnd();
    }
    slideDivs.forEach((slide, i) => {
      slide.style.display = i === n ? "flex" : "none";
    });
    body.className = `talk-mode ${slideDiv.dataset.bodyClass || ""} ${initialBodyClass}`;
    body.style.cssText = `${initialBodyStyle} ${slideDiv.dataset.bodyStyle || ""}`;
    window.clearInterval(timeoutInterval);
    if (slideDiv.dataset.timeToNext) timeoutInterval = window.setTimeout(forward, parseFloat(slideDiv.dataset.timeToNext) * 1000);
    onResize();
    if (window.location.hash !== n) window.location.hash = n;
    document.title = slideDiv.textContent;
  }

  function resizeTo(sc, width, height) {
    let slideDiv = sc.firstChild,
      padding = Math.min(width * 0.04),
      fontSize = height;
    sc.style.width = `${width}px`;
    sc.style.height = `${height}px`;
    slideDiv.style.padding = `${padding}px`;
    if (getComputedStyle(slideDiv).display === "grid") slideDiv.style.height = `${height - padding * 2}px`;
    for (let step of [100, 50, 10, 2]) {
      for (; fontSize > 0; fontSize -= step) {
        slideDiv.style.fontSize = `${fontSize}px`;
        if (
          slideDiv.scrollWidth <= width &&
          slideDiv.offsetHeight <= height &&
          Array.from(slideDiv.querySelectorAll("div")).every(elem => elem.scrollWidth <= elem.clientWidth && elem.scrollHeight <= elem.clientHeight)
        ) {
          break;
        }
      }
      fontSize += step;
    }
  }

  function onPrint() {
    if (big.mode === "print") return;
    body.className = `print-mode ${initialBodyClass}`;
    body.style.cssText = initialBodyStyle;
    emptyNode(pc);
    for (let sc of slideDivs) {
      let subContainer = pc.appendChild(ce("div", "sub-container")),
        sbc = subContainer.appendChild(ce("div", sc.firstChild.dataset.bodyClass || ""));
      sbc.appendChild(sc);
      sbc.style.cssText = sc.dataset.bodyStyle || "";
      sc.style.display = "flex";
      resizeTo(sc, 512, 320);
      if (sc._notes.length) continue;
      let notesUl = subContainer.appendChild(ce("ul", "notes-list"));
      for (let note of sc._notes) {
        let li = notesUl.appendChild(ce("li"));
        li.innerText = note;
      }
    }
    big.mode = "print";
  }

  function onTalk(i) {
    if (big.mode === "talk") return;
    big.mode = "talk";
    body.className = `talk-mode ${initialBodyClass}`;
    emptyNode(pc);
    for (let sc of slideDivs) pc.appendChild(sc);
    go(i, true);
  }

  function onJump() {
    if (big.mode === "jump") return;
    big.mode = "jump";
    body.className = "jump-mode " + initialBodyClass;
    body.style.cssText = initialBodyStyle;
    emptyNode(pc);
    slideDivs.forEach(sc => {
      let subContainer = pc.appendChild(ce("div", "sub-container"));
      subContainer.addEventListener("keypress", e => {
        if (e.key !== "Enter") return;
        subContainer.removeEventListener("click", onClickSlide);
        e.stopPropagation();
        e.preventDefault();
        onTalk(sc._i);
      });
      let sbc = subContainer.appendChild(ce("div", sc.firstChild.dataset.bodyClass || ""));
      sbc.appendChild(sc);
      sc.style.display = "flex";
      sbc.style.cssText = sc.dataset.bodyStyle || "";
      resizeTo(sc, 192, 120);
      function onClickSlide(e) {
        subContainer.removeEventListener("click", onClickSlide);
        e.stopPropagation();
        e.preventDefault();
        onTalk(sc._i);
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
        onTalk(big.current);
        break;
      case "j":
        onJump();
        break;
    }
    if (big.mode !== "jump") return;
    let { activeElement } = document;
    if (activeElement && activeElement.classList.contains("slide")) {
      let startIndex = slideDivs.indexOf(activeElement.parentNode),
        columnIndexes = getColumnIndexes(activeElement);
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
    let { left } = activeElement.getBoundingClientRect(),
      lastIndex,
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
    if (!slideDivs[i]) return;
    e.preventDefault();
    slideDivs[i].firstChild.focus();
  }

  function onTouchStart(e) {
    if (big.mode !== "talk") return;
    let { pageX: startingPageX } = e.changedTouches[0];
    document.addEventListener(
      "touchend",
      function(e2) {
        let distanceTraveled = e2.changedTouches[0].pageX - startingPageX;
        // Don't navigate if the person didn't swipe by fewer than 4 pixels
        if (Math.abs(distanceTraveled) < 4) return;
        if (distanceTraveled < 0) forward();
        else reverse();
      },
      { once: true }
    );
  }

  function onHashChange() {
    if (big.mode === "talk") go(parseHash());
  }

  function onResize() {
    if (big.mode !== "talk") return;
    let { clientWidth: width, clientHeight: height } = document.documentElement;
    if (ASPECT_RATIO !== false) {
      // Too wide
      if (width / height > ASPECT_RATIO) {
        width = Math.ceil(height * ASPECT_RATIO);
      } else {
        height = Math.ceil(width / ASPECT_RATIO);
      }
    }
    resizeTo(slideDivs[big.current], width, height);
  }
});
