function search(query) {
  document.body.innerHTML += `<h2>Search results for: ${query}</h2>`;
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");
    search(query);
  },
  false
);
