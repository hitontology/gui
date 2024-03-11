import { graph } from "./graph.js";

/** Prototype. Deactivate CORS restrictions e.g. with the CORS Everywhere Firefox addon for local testing or it won't work.
 */
async function main() {
  const graphCall = graph(); // parallel processing to save time
  const response = await fetch("https://hitontology.eu/public/2024-03-hito_diagram.svg");
  const s = (await response.text()).replaceAll(/\n[ ]*/g, "");
  const draw = SVG().addTo("#svgContainer").size("100%", "100%");
  draw.svg(s);
  const cy = await graphCall;
  // object 0 is a white background rectangle
  const g = draw.get(0).findOne("g");
  g.each(addIds, false);
}

let source = null;
let target = null;
let cy;

function selectSource(e, id) {
  e.preventDefault();
  if (source) {
    source.classList.remove("source");
  }
  console.log(id);
  source = document.getElementById(id);
  source.classList.add("source");
  console.log("set source to", source);
}

function selectTarget(e, id) {
  e.preventDefault();
  if (target) {
    target.classList.remove("target");
  }
  console.log(id);
  target = document.getElementById(id);
  target.classList.add("target");
  console.log("set target to", target);
}

function addIds(i, children) {
  if (this.type !== "g" || this.children().length > 1) {
    // generic defs and legend filter
    return;
  }
  console.log(this);
  // add ids
  const link = this.findOne("a");
  if (link !== null) {
    console.log("link", link);
    const href = link.attr("xlink:href");
    const split = href.split("/");
    const newId = split[split.length - 1];
    this.attr("id", newId);
    this.on("click", (e) => selectSource(e, newId));
    this.on("contextmenu", (e) => selectTarget(e, newId));

    // remove <a>link</a> and preserve children
    link.each(preserveHyperlinkChildren, false);
    link.remove();
  }
}
function preserveHyperlinkChildren(i, children) {
  const correctNodeGroup = this.parents()[1]; // correct parent
  this.toParent(correctNodeGroup);
}

window.addEventListener("load", main);
