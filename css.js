customElements.define(
  "ui-icon",
  class extends HTMLElement {
    constructor() {
      super();
      import("https://jspm.dev/feather-icons").then(({ icons }) => {
        console.log(icons[this.innerText.trim()].toSvg());
        this.innerHTML = `<svg viewBox="0 0 24 24">${
          icons[this.innerText.trim()].contents
        }</svg>`;
      });
    }
  }
);

customElements.define(
  "boxed-text",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const ctx = new OffscreenCanvas(1, 1).getContext("2d");

      const computedStyle = window.getComputedStyle(this);
      ctx.font = computedStyle.font;
      const lh =
        computedStyle.lineHeight === "normal"
          ? parseInt(computedStyle.fontSize) * 1.2
          : parseInt(computedStyle.lineHeight);

      console.log(computedStyle.lineHeight, lh);
      this.innerText = "X";
      const realHeight = this.clientHeight;
      this.innerText = "";

      const X = ctx.measureText("X");

      const y = ctx.measureText("y");

      const xHeight = X.actualBoundingBoxAscent - X.actualBoundingBoxDescent;

      const lhFactor = lh / parseInt(computedStyle.fontSize);
      console.log(lhFactor);

      const line = lh - xHeight * 1.8;

      const descender = y.actualBoundingBoxDescent;
      console.log({
        xHeight,
        descender,
        realHeight,
        lh,
      });

      this.style.marginTop =
        descender + xHeight - realHeight + line * 0.5 + "px";
      this.style.marginBottom = -descender - line * 0.5 + "px";
      // this.style.position = "relative";
    }
  }
);

function textNodesUnder(el) {
  var n,
    a = [],
    walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  while ((n = walk.nextNode())) {
    a.push(n);
    const t = document.createElement("boxed-text");

    // t.style.marginTop = "-0.3em";
    // t.style.marginBottom = "-1em";
    // t.style.display = "inline-block";

    // t.style.height = "auto";

    n.replaceWith(t);
    t.appendChild(n);
  }

  return a;
}

console.log(
  [...document.querySelectorAll('[data-text="boxed"]')].map(textNodesUnder)
);

customElements.define(
  "ui-switch",
  class extends HTMLInputElement {
    #label;
    #once;
    constructor() {
      super();
      this.#label = document.createElement("label");
      this.type = "checkbox";

      this.#label.classList.add("ui-switch");

      this.addEventListener("change", () => {
        if (this.checked) this.#label.setAttribute("checked", true);
        else this.#label.removeAttribute("checked");
      });
    }

    connectedCallback() {
      if (!this.#once) {
        this.#once = true;
        this.replaceWith(this.#label);
        this.#label.appendChild(this);
      }
    }
  },
  { extends: "input" }
);

const repSwitch = () =>
  [...document.querySelectorAll("ui-switch")].map((e) => {
    const rep = new (customElements.get("ui-switch"))();

    rep.setAttribute("is", "ui-switch");
    e.replaceWith(rep);
  });

const observe = (name, cb) => {
  new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (
        [...mutation.addedNodes].reduce(
          (acc, node) => acc || node.nodeName.toLowerCase() === name,
          false
        )
      )
        cb();
    }
  }).observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });
};

repSwitch();
observe("ui-switch", repSwitch);
