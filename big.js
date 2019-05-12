let ASPECT_RATIO = window.BIG_ASPECT_RATIO === undefined ? 1.6 : window.BIG_ASPECT_RATIO;

function parseHash() {
  return parseInt(window.location.hash.substring(1), 10);
}

function emptyNode(node) {
  while (node.hasChildNodes()) node.removeChild(node.lastChild);
}

function ce(type, className = "") {
  return Object.assign(document.createElement(type), { className });
}

addEventListener("load", () => {
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
      length: slideDivs.length,
      forward,
      reverse,
      go
    });

  function forward() {
    go(big.current + 1);
  }

  function reverse() {
    go(big.current - 1);
  }

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
    for (let slide of slideDivs) slide.style.display = slide._i === n ? "" : "none";
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
    let m = { p: onPrint, t: onTalk, j: onJump }[e.key];
    if (m) m(big.current);
  }

  function onResize() {
    if (big.mode !== "talk") return;
    let { clientWidth: width, clientHeight: height } = document.documentElement;
    if (ASPECT_RATIO !== false) {
      if (width / height > ASPECT_RATIO) width = Math.ceil(height * ASPECT_RATIO);
      else height = Math.ceil(width / ASPECT_RATIO);
    }
    resizeTo(slideDivs[big.current], width, height);
  }

  window.matchMedia("print").addListener(onPrint);
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("touchstart", e => {
    if (big.mode !== "talk") return;
    let { pageX: startingPageX } = e.changedTouches[0];
    document.addEventListener(
      "touchend",
      e2 => {
        let distanceTraveled = e2.changedTouches[0].pageX - startingPageX;
        // Don't navigate if the person didn't swipe by fewer than 4 pixels
        if (Math.abs(distanceTraveled) < 4) return;
        if (distanceTraveled < 0) forward();
        else reverse();
      },
      { once: true }
    );
  });
  addEventListener("hashchange", () => {
    if (big.mode === "talk") go(parseHash());
  });
  addEventListener("resize", onResize);
  console.log("This is a big presentation. You can: \n\n* press j to jump to a slide\n" + "* press p to see the print view\n* press t to go back to the talk view");
  body.className = `talk-mode ${initialBodyClass}`;
  go(parseHash() || big.current);
});
