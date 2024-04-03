import { graph } from "./graph.js";
import { paths, pathHash } from "./path.js";
import { showTable } from "./table.js";
import { pathHashes } from "./pathHashes.js";
import MicroModal from "https://cdn.jsdelivr.net/npm/micromodal/dist/micromodal.es.js";
import { SVG } from "https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js/dist/svg.esm.js";
import { Spinner } from "https://cdn.jsdelivr.net/npm/spin.js@4.1.1/spin.min.js";

import { Notyf } from "https://cdn.jsdelivr.net/npm/notyf@3/notyf.es.js";
const notyf = new Notyf();

const BASE_SEPARATION = 9;
const COMPLEX_PATH_MULTIPLIER = 1.2;
const MIN_TRANSLATION = 8;

/** Prototype. Deactivate CORS restrictions e.g. with the CORS Everywhere Firefox addon for local testing or it won't work.
 */
async function main() {
  const spinner = new Spinner({ color: "black", lines: 12 });
  spinner.spin(document.body);
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
  spinner.stop();
}

let sourceElement = null;
let targetElement = null;
let cy;
let lastPath = null;

function showPath(validPaths) {
  Array.from(document.getElementsByClassName("clone")).forEach((c) => c.remove()); // clear previously shown paths

  // 2d vector math and point representations:
  // Vectors are two-element arrays [x,y], which allows easier manipulation of both dimensions in the same way using map and so on.
  // Points are represented as Objects {x: ..., y: ...} instead for more intuitive formulas and easier SVG path splitting.
  // It doesn't seem worth the time, effort and space to use a library or refactor it out because we don't use this anywhere else in the code.
  // However if it becomes used elsewhere or it becomes a maintenance problem in the future, this could be refactored.

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
      let eventEle = arrowBodyEle;
      if (arrowBodyEle) {
        if (pathCount === 0) {
          //console.log("keep original path");
          arrowBodyEle.classList.add("path" + i);
        } else {
          //console.log("cloning");
          // we need both svg.js and DOM element functionality so we need to convert between the two
          // there is some overlap in functionality but often different syntax
          // see https://svgjs.dev/docs/3.1/referencing-creating-elements/#existing-dom-elements
          // convert to svg.js element so we get the clone function
          // arrowBodyEle is still available for DOM functionality
          const clone = SVG(arrowBodyEle).clone();
          eventEle = clone.node;
          clone.addClass("clone");
          for (let i = validPaths.length - 1; i >= 0; i--) {
            clone.removeClass("path" + i);
          }
          clone.addClass("path" + i);
          clone.addClass("clone");
          // determine shift direction based on path direction
          const points = [];
          {
            const dParts = arrowBodyEle
              .getAttribute("d")
              .replaceAll(/[^0-9. ]/g, "")
              .split(" ");
            for (let k = 0; k < dParts.length / 2; k++) {
              points.push({ x: Number(dParts[k * 2]), y: Number(dParts[k * 2 + 1]) });
            }
          }
          //console.log("d", points);
          // vector between first and last point in the path
          let [vx, vy] = [points.at(-1).x - points[0].x, points.at(-1).y - points[0].y];
          // normalize
          const norm = Math.hypot(vx, vy);
          [vx, vy] = [vx / norm, vy / norm];
          // shift additional clones further and in the other direction as well
          // function from 0,1,2,3,4,... to 0,1,-1,2,-2,...
          // bitwise and of a number with 1 returns 1 if it is even, 0 otherwise
          const f = (n) => Math.floor((n + 1) / 2) * ((n & 1) * 2 - 1);
          const multiplier = f(pathCount);
          // normal vector is (-y, x)
          // translation vector
          let vt = [-vy, vx].map((r) => r * BASE_SEPARATION * multiplier);
          // Single line, as those are orthagonal to the nodes in our image, a translation will keep the source and origin points in a good spot.
          if (points.length <= 2) {
            clone.translate(vt[0], vt[1]);
          } else {
            // To improve visual separation we increase translation.
            // Also ensure minimum translation in each direction.
            const absMax = (x, max) => Math.max(Math.abs(x), max) * Math.sign(x);
            vt = vt.map((r) => absMax(r * COMPLEX_PATH_MULTIPLIER, MIN_TRANSLATION));
            // translate each part of the path separately so we can fix source and target points
            const newPoints = points.map((p) => ({ x: p.x + vt[0], y: p.y + vt[1] }));
            // work around badly positioned source and target points
            const n = points.length;
            // replace first and last new points with the original ones, first and last line will not be axis parallel anymore
            /*newPoints[0] = points[0];
            newPoints[n - 1] = points[n - 1];*/
            // add first and last original points
            // this to covers missing connections nicely but may produce artifacts if the new connections push too far in
            newPoints.unshift(points[0]);
            newPoints.push(points.at(-1));
            const newD = "M" + newPoints.map((p) => p.x + " " + p.y).reduce((a, b) => a + " L" + b);
            //console.log(newD);
            clone.attr("d", newD);
          }
          SVG(arrowBodyEle.parentElement).add(clone);
        }
        eventEle.addEventListener("click", () => {
          showTable(path);
        });
      }
    }
  }
  //showTable(path);
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
  //console.log(id);
  sourceElement = document.getElementById(id);
  sourceElement.classList.add("source");
  console.log("set source to", sourceElement);
}

function selectTarget(e, id) {
  e.preventDefault();
  if (targetElement) {
    targetElement.classList.remove("target");
  }
  //console.log(id);
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

    if (validPaths.length == 1) {
      showPath(validPaths);
      showTable(validPaths[0]);
      return;
    }
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
  if (this.hasClass("node")) {
    this.on("click", (e) => selectSource(e, id));
    this.on("contextmenu", (e) => selectTarget(e, id));
  }
}

export function getPath() {
  return lastPath === null ? false : lastPath;
}

window.addEventListener("load", main);
