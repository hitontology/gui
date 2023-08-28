function catalogue(title, text, link) {
  return `<div class="box">
          <img class="boximg" src="img/catalogue.svg">
          <h3>${title}</h3>
          ${text}
          <a href="${link}">More Info</a>
        </div>`;
}

function catalogues() {
  const container = document.getElementById("catalogues");
  for (let i = 1; i <= 10; i++) {
    let html = catalogue("Catalog" + i, "A collection of classified things " + i, "catalogue.html?cat=BbApplicationSystemTypeCatalogue");
    let fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}

document.addEventListener("DOMContentLoaded", () => catalogues(), false);
