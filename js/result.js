function search(query) {
  document.body.innerHTML += `<h2>Search results for: ${query}</h2>`;
}

function result(title, text, link) {
  return `<div class="result">
          <h3>${title}</h3>
          ${text}
          <a href="${link}">More Info</a>
        </div>`;
}

function results() {
  const container = document.getElementById("results");
  for (let i = 1; i <= 10; i++) {
    let html = result("Commercial RIS " + i, "Commercial Radiology Information System (RIS) Dummy " + i, "");
    let fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");
    search(query);
    results();
  },
  false
);
