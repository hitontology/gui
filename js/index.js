import { graph } from "./graph.js";
import { paths, pathHash } from "./path.js";
import { table } from "./table.js";
import { pathHashes } from "./pathHashes.js";
import MicroModal from "https://cdn.jsdelivr.net/npm/micromodal/dist/micromodal.es.js";
import { SVG } from "https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js/dist/svg.esm.js";

import { Notyf } from "https://cdn.jsdelivr.net/npm/notyf@3/notyf.es.js";
const notyf = new Notyf();

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

function showPath(validPaths) {
  if (lastPath) {
    for (let i = 0; i < lastPath.length; i++) {
      const path = lastPath[i];
      path.forEach((ele) => {
        const domEle = document.getElementById(ele.id());
        domEle.classList.remove("path");
        const arrowBodyEle = document.getElementById(ele.id() + "ArrowBody");
        if (arrowBodyEle) {
          arrowBodyEle.classList.remove("path" + i);
        }
      });
    }
  }
  lastPath = validPaths;
  const pathCounts = new Map();
  for (let i = validPaths.length - 1; i >= 0; i--) {
    const path = validPaths[i];
    for (let j = 0; j < path.size(); j++) {
      const id = path[j].id();
      const domEle = document.getElementById(id);
      const pathCount = (pathCounts.get(id) ?? -1) + 1;
      pathCounts.set(id, pathCount);

      domEle.classList.add("path");
      let arrowBodyEle = document.getElementById(id + "ArrowBody");
      if (arrowBodyEle) {
        if (pathCount > 0) {
          console.log("cloning");
          const clone = SVG(arrowBodyEle).clone();
          clone.addClass("clone");
          for (let i = validPaths.length - 1; i >= 0; i--) {
            clone.removeClass("path" + i);
          }
          clone.addClass("path" + i);
          // determine shift direction based on path direction
          const d = arrowBodyEle
            .getAttribute("d")
            .replaceAll(/[^0-9. ]/g, "")
            .split(" ");
          console.log("d", d);
          // vector between first and last point in the path
          const [x, y] = [d.at(-2) - d[0], d.at(-1) - d[1]];
          const norm = Math.hypot(x, y);
          const [xn, yn] = [x / norm, y / norm];
          // normal vector is (-y, x)
          // shift additional clones further and in the other direction as well
          // function from 0,1,2,3,4,... to 0,1,-1,2,-2,...
          // bitwise and of a number with 1 returns 1 if it is even, 0 otherwise
          const f = (x) => Math.floor((x + 1) / 2) * ((x & 1) * 2 - 1);
          const multiplier = f(pathCount);
          clone.translate(-7 * multiplier * yn, 7 * multiplier * xn);
          // todo: this works perfectly well for single-line paths but is not optimal for multi-line paths
          // shift each part of the path separately and adapt the connecting points?
          SVG(arrowBodyEle.parentElement).add(clone);
        } else {
          arrowBodyEle.classList.add("path" + i);
        }
      }
    }
  }
  //table(path);
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
      notyf.error(`No valid paths found between ${sourceId} and ${targetId}`);
      break breakme;
    } else {
      console.info(allPaths.length, "paths found,", validPaths.length, " of them valid");
      console.table(validPaths.map((p) => p.toArray().map((x) => x.id())));
    }

    const legend = document.getElementById("legend");
    legend.classList.add("legend-hidden");

    /*if (validPaths.length == 1) {
      showPath(validPaths[0]);
      return;
    }*/
    showPath(validPaths);
    return;
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
  if (!id.startsWith("y.")) {
    this.on("click", (e) => selectSource(e, id));
    this.on("contextmenu", (e) => selectTarget(e, id));
  }
}

export function getPath() {
  return lastPath === null ? false : lastPath;
}

window.addEventListener("load", main);
