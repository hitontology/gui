function preprocess() {
  const draw = SVG().addTo("#svgContainer");
  draw.svg(document.getElementById("svgContainer").innerHTML);
  const g = draw.get(0);
  g.each(addIds, false);
}

function addIds(i, children) {
  /* if(i==0 || this.children().length < 3 || this.type == "#text" || (this.node.name != undefined && this.node.name=="#text") || (this.node.data != undefined && this.node.data=="\n  ")) { // generic defs and legend filter
        return;
    }*/
  console.log(this);
  // add ids
  const link = this.first();
  console.log(link);
  const href = link.attr("xlink:href");
  const split = href.split("/");
  const newId = split[split.length - 1];
  this.attr("id", newId);

  // remove <a>link</a> and preserve children
  link.each(preserveHyperlinkChildren, false);
  link.remove();
}
function preserveHyperlinkChildren(i, children) {
  const correctNodeGroup = this.parents()[1]; // correct parent
  this.toParent(correctNodeGroup);
}
