function result(title, text, link) {
  return `<div class="result">
          <img class="catalogueimg" src="img/catalogue.svg">
          <h3>${title}</h3>
          ${text}
          <a href="${link}">More Info</a>
        </div>`;
}

function results() {
  const container = document.getElementById("results");
  for (let i = 1; i <= 10; i++) {
    let html = result("Catalog" + i, "A collection of classified things " + i, "catalogue.html?cat=BbApplicationSystemTypeCatalogue");
    let fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    results();
  },
  false
);
