function show(swp) {
  document.getElementsByTagName("header")[0].innerHTML += `<h3>Search results / ${swp}</h3><h1>${swp}</h1>`;
}

function property(p, o) {
  return `<span>
          <b>${p}</b>
          ${o}
        </span>`;
}

function properties() {
  const container = document.getElementById("properties");
  for (let i = 1; i <= 50; i++) {
    let html = property("exampleproperty" + i, "exampleobject" + i);
    let fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const urlParams = new URLSearchParams(window.location.search);
    const swp = urlParams.get("swp");
    show(swp);
    properties();
  },
  false
);
