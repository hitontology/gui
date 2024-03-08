async function preprocess() {
  // deactivate CORS restrictions e.g. with the CORS Everywhere Firefox addon
  const response = await fetch("https://hitontology.eu/public/2024-03-hito_diagram.svg");
  const s = await response.text();
  const draw = SVG().addTo("#svgContainer").size("100%", "100%");
  draw.svg(s);
  // first level is the svg object itself, level 2 object 0 is a white background rectangle
  const g = draw.get(0).findOne("g");
  g.each(addIds, false);
}

function addIds(i, children) {
  if (
    this.type != "g" ||
    this.children().length > 1 // legend
    //this.type == "#text" ||
    //(this.node.name != undefined && this.node.name == "#text") ||
    //(this.node.data != undefined && this.node.data == "\n  ")
  ) {
    // generic defs and legend filter
    return;
  }
  console.log(this);
  // add ids
  const a = this.findOne("a");
  if (!a) {
    return;
  }
  console.log("a", a);
  const href = a.attr("xlink:href");
  const split = href.split("/");
  const newId = split[split.length - 1];
  this.attr("id", newId);

  // remove <a>link</a> and preserve children
  a.each(preserveHyperlinkChildren, false);
  a.remove();
}
function preserveHyperlinkChildren(i, children) {
  const correctNodeGroup = this.parents()[1]; // correct parent
  this.toParent(correctNodeGroup);
}
