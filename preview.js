import Prism from "https://jspm.dev/prismjs@1.22.0";

const highlight = (e) => {
  Prism.highlightElement(e);
};

function prepEntities(str) {
  var p = document.createElement("p");
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
}

const createPreview = (str) => {
  const c = document.createElement("code");
  const d = document.createElement("iframe");
  const l = document.createElement("fieldset");
  const n = document.createElement("legend");
  const pre = document.createElement("pre");

  n.innerText = (/<([^ >]+).*/.exec(str) || [])[1];
  n.style.fontWeight = "bold";

  c.contentEditable = "plaintext-only";
  c.spellcheck = false;
  c.style.display = "table";
  c.className = "language-html";
  pre.className = "language-html";

  d.style.width = "100%";
  d.style.height = "1px";
  d.style.resize = "both";
  d.style.overflow = "auto";
  const setBody = (str) => {
    d.src =
      `./preview.html?execute=` +
      encodeURIComponent(`
    <head>
        <link
        href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;300;400;500;600;700;800;900&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
    />
    <script
        defer
        src="https://unpkg.com/focus-visible@5.1.0/dist/focus-visible.js"
    ></script>
    <script defer src="${window.location.href}css.js"></script>
    <link rel="stylesheet" href="${window.location.href}white.css" />
 
    </head>
    <body style=" min-height: auto"><div>${str}</div></body>`);

    d.onload = () => {
      d.contentWindow.$$onReady.then(() => {
        d.style.height = d.contentDocument.body.scrollHeight + "px";
      });
    };
  };

  c.oninput = ({ target }) => {
    setBody(target.innerText);
  };

  const h = () => {
    c.innerHTML = c.innerHTML.replace(/<br>/g, "hash9340439781033849");
    c.innerText = c.innerText.replace(/\n/g, "hash9340439781033849");

    highlight(c);
    c.innerHTML = c.innerHTML.replace(/hash9340439781033849/g, "<br>");
  };

  c.innerText = str;

  setBody(str);

  h();
  c.onblur = h;

  pre.appendChild(c);

  l.appendChild(n);
  l.appendChild(pre);

  l.appendChild(document.createElement("hr"));
  l.appendChild(d);
  document.getElementById("content").appendChild(l);
};

fetch("./components.html")
  .then((response) => response.text())
  .then((t) =>
    t
      .split(/\r?\n\r?\n/g)
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach(createPreview)
  );
