import { graph } from "./graph.js";
import { paths, pathHash } from "./path.js";
import { table } from "./table.js";
import { pathHashes } from "./pathHashes.js";
import MicroModal from "https://cdn.jsdelivr.net/npm/micromodal/dist/micromodal.es.js";
import { SVG } from "https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js/dist/svg.esm.js";

/** Prototype. Deactivate CORS restrictions e.g. with the CORS Everywhere Firefox addon for local testing or it won't work.
 */
async function main() {
  console.log(SVG);
  MicroModal.init({ onShow: (modal) => console.info(`${modal.id} is shown`) });
  const graphCall = graph(); // parallel processing to save time
  const response = await fetch("./img/diagram.svg");
  const s = (await response.text()).replaceAll(/\n[ ]*/g, "");
  const draw = SVG().addTo("#svgContainer").size("100%", "100%");
  draw.svg(s);
  cy = await graphCall;
  // object 0 is a white background rectangle
  const g = draw.get(0).findOne("g");
  g.each(addListeners, false);
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
  table(path);
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
    const validPaths = allPaths.filter((p) => pathHashes.has(pathHash(p)));
    if (validPaths.length === 0) {
      console.warn(`No valid paths found between ${sourceId} and ${targetId}}`);
      break breakme;
    } else {
      console.info(allPaths.length, "paths found,", validPaths.length, " of them valid");
      console.table(validPaths.map((p) => p.toArray().map((x) => x.id())));
    }

    if (validPaths.length == 1) {
      showPath(validPaths[0]);
      return;
    }
    MicroModal.show("modal-choose-path");
    const table = document.getElementById("choose-path-table");
    table.innerHTML = "";
    for (const path of validPaths) {
      const tr = document.createElement("tr");
      tr.addEventListener("click", () => {
        showPath(path);
        MicroModal.close("modal-choose-path");
      });

      path.forEach((ele) => {
        const td = document.createElement("td");
        tr.appendChild(td);
        td.innerText = ele.id();
      });

      table.appendChild(tr);
    }
  }
}

function addListeners() {
  if (this.type !== "g") {
    // generic defs and legend filter
    return;
  }
  const id = this.attr("id");
  this.on("click", (e) => selectSource(e, id));
  this.on("contextmenu", (e) => selectTarget(e, id));
}
window.addEventListener("load", main);
