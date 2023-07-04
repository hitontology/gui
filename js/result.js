function search(query) {
  document.body.innerHTML += `<h2>Search results for: ${query}</h2>`;
}

function result(title, text)
{
		return 
}

function results()
{
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
