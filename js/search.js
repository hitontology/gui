const options = { tokenize: "forward", document: { id: "s", index: ["l[]", "cit[]"] } };
const index = new FlexSearch.Document(options);
fetch("scripts/index.json")
  .then((response) => response.json())
  .then((json) => {
    console.log("adding to index", json.slice(-5), " and more");
    for (let entry of json) index.add(entry);
  });

function change(event) {
  event.preventDefault();
  const query = event.target.value;
  if (query.length < 3) return;
  document.getElementById("ast").classList.add("highlight");
  document.getElementById("feature").classList.add("highlight");
  document.getElementById("function").classList.add("highlight");
  document.getElementById("orgunit").classList.add("highlight");
  document.getElementById("usergroup").classList.add("highlight");
  document.getElementById("swp").classList.add("highlight");
  document.getElementById("study").classList.add("highlight");
  const hits = index.search(query);
  console.log(query, hits);
  const suggestions = document.getElementById("searchresults");
  while (suggestions.firstChild) {
    suggestions.removeChild(suggestions.firstChild);
  }
  if (hits[0])
    for (let hit of hits[0].result) {
      const option = document.createElement("option");
      option.value = hit;
      suggestions.appendChild(option);
    }
}
