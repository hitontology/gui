function select(facet) {
  console.log("processing " + JSON.stringify(facet));
  const container = document.createElement("span");
  const label = document.createElement("label");
  label.for = facet.id;
  label.textContent = facet.name;
  const select = document.createElement("select");
  select.id = facet.id;
  select.textConent = facet.name;
  container.style.position = "absolute";
  container.style.top = facet.position[0] + "px";
  container.style.left = facet.position[1] + "px";
  container.appendChild(label);
  container.appendChild(select);
  return container;
}

function showFacets() {
  console.log("Showing facets");
  const container = document.getElementById("facets");
  const selects = Object.values(facets).map(select);
  selects.forEach((s) => container.appendChild(s));
}
