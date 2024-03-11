import { graph } from "./graph.js";
import { paths } from "./path.js";

/** Prototype. Deactivate CORS restrictions e.g. with the CORS Everywhere Firefox addon for local testing or it won't work.
 */
async function main() {
  const graphCall = graph(); // parallel processing to save time
  const response = await fetch("https://hitontology.eu/public/2024-03-hito_diagram.svg");
  const s = (await response.text()).replaceAll(/\n[ ]*/g, "");
  const draw = SVG().addTo("#svgContainer").size("100%", "100%");
  draw.svg(s);
  cy = await graphCall;
  // object 0 is a white background rectangle
  const g = draw.get(0).findOne("g");
  g.each(addIds, false);
}

let sourceElement = null;
let targetElement = null;
let cy;
let lastPath = null;

function showPath(path) {
  if (lastPath) {
    lastPath.forEach((ele) => document.getElementById(ele.id()).classList.remove("path"));
  }
  lastPath = path;
  for (let i = 0; i < path.size(); i++) {
    const id = path[i].id();
    const domEle = document.getElementById(id);
    domEle.classList.add("path");
  }
  /*
  for (let i = 0; i < path.size() / 2 - 1; i++) {
    const node = path[i * 2];
    console.log("showing node", node.id());
    const edge = path[i * 2 + 1];
    console.log("showing edge", edge.id());
  }
*/
}

function selectSource(e, id) {
  e.preventDefault();
  if (sourceElement) {
    sourceElement.classList.remove("source");
  }
  console.log(id);
  sourceElement = document.getElementById(id);
  sourceElement.classList.add("source");
  console.log("set source to", sourceElement);
}

function selectTarget(e, id) {
  e.preventDefault();
  if (targetElement) {
    targetElement.classList.remove("target");
  }
  console.log(id);
  targetElement = document.getElementById(id);
  targetElement.classList.add("target");
  console.log("set target to", targetElement);
  breakme: if (sourceElement) {
    const sourceId = sourceElement.id;
    const targetId = targetElement.id;
    console.log(`calculating paths from ${sourceId} to ${targetId}`);
    const sourceNode = cy.getElementById(sourceId);
    const targetNode = cy.getElementById(targetId);
    const allPaths = paths(cy, sourceNode, targetNode);
    if (allPaths.length === 0) {
      console.warn(`No paths found between ${sourceId} and ${targetId}}`);
      break breakme;
    } else {
      console.info(allPaths.length, "paths found");
      console.table(allPaths.map((p) => p.toArray().map((x) => x.id())));
    }
    const path = allPaths[0];
    showPath(path);
    //table(path);
  }
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
