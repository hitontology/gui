function show(swp) {
  document.getElementsByTagName("header")[0].innerHTML += `<h3>Search results / ${swp}</h3><h1>${swp}</h1>`;
}

function property(p, o) {
  return `<span>
          <b>${p}</b>
          ${o}
        </span><br>`;
}

function details() {
  const container = document.getElementById("details");
  for (let d = 0; d < 4; d++) {
    let div = document
      .createRange()
      .createContextualFragment(`<div><h3>${["General Information", "Supports Enterprise Function", "Offers Features", "Studies"][d]}</h3></div>`).firstChild;
    for (let i = 1; i <= 10; i++) {
      let html = property("exampleproperty" + i, "exampleobject" + i);
      let fragment = document.createRange().createContextualFragment(html);
      div.appendChild(fragment);
    }
    container.appendChild(div);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const urlParams = new URLSearchParams(window.location.search);
    const swp = urlParams.get("swp");
    show(swp);
    details();
  },
  false
);
