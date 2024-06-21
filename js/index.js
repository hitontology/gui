/** @module index */
import { graph } from "./graph.js";
import { paths, pathHash, edgeHash, toString } from "./path.js";
import { showTable } from "./table.js";
import { pathHashes } from "./pathHashes.js";
import { SVG } from "https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js/dist/svg.esm.js";
import { Spinner } from "https://cdn.jsdelivr.net/npm/spin.js@4.1.1/spin.min.js";
import { edges } from "./edges.js";
import { nodes } from "./nodes.js";
import { addTooltips } from "./tooltip.js";

import { Notyf } from "https://cdn.jsdelivr.net/npm/notyf@3/notyf.es.js";
const NOTYF_DEFAULTS = { duration: 20000, dismissible: true };
const notyf = new Notyf({
  types: [
    { type: "success", ...NOTYF_DEFAULTS },
    { type: "error", ...NOTYF_DEFAULTS },
    {
      type: "warning",
      background: "orange",
      icon: {
        className: "material-icons",
        tagName: "i",
      },
      ...NOTYF_DEFAULTS,
    },
  ],
});
notyf.warning = (message) => notyf.open({ type: "warning", message });

const BASE_SEPARATION = 9;
const COMPLEX_PATH_MULTIPLIER = 1.2;
const MIN_TRANSLATION = 8;
const TEST_PATH_COUNT = 7;

/** Prototype. Deactivate CORS restrictions e.g. with the CORS Everywhere Firefox addon for local testing or it won't work.
 */
async function main() {
  const spinner = new Spinner({ color: "black", lines: 12 });
  spinner.spin(document.body);
  const graphCall = graph(); // parallel processing to save time
  const response = await fetch("./img/diagram.svg");
  const s = (await response.text()).replaceAll(/\n[ ]*/g, "");
  const draw = SVG().size("100vw").addTo("#top").size("100vw", "100%");
  draw.svg(s);
  addTooltips();
  cy = await graphCall;
  // object 0 is a white background rectangle
  const g = draw.get(0).findOne("g");

  // handling study subclasses separately would yield too few results, only use superclass Study
  disableNodes(["ExperimentalStudyRCT", "NonExperimentalStudy", "ValidationStudy", "QuasiExperimentalStudy", "LabStudy"]);
  // disable edges that are never used
  disableEdges(Object.keys(edges).filter((eid) => !pathHashes.has(edgeHash(eid))));
  // disable nodes that only have connected edges that are never used
  disableNodes(Object.keys(nodes).filter((nid) => Object.values(edges).filter((edge) => !edge.disabled && (edge.source === nid || edge.target === nid)).length === 0));
  //disableEdges(["y.edge.47", "y.edge.48", "y.edge.49", "y.edge.50", "y.edge.51"]);
  g.each(addListeners);

  // test paths
  if (window.location.search.substr(1).includes("testpath")) testPaths(); // "testpath" in the get parameters
  spinner.stop();
}

let oldSourceId = null;
let sourceElement = null;
let targetElement = null;
let cy;
let lastPath = null;
let controller = new AbortController();

function testPaths() {
  for (let id in edges) {
    const edgeObj = edges[id];
    const sourceNode = cy.getElementById(edgeObj.source);
    const cyEdge = cy.getElementById(id);
    const targetNode = cy.getElementById(edgeObj.target);
    const collection = cy.collection([sourceNode, cyEdge, targetNode]);
    const paths = Array(TEST_PATH_COUNT).fill(collection);
    showPaths(paths, true);
  }
}

/** @param validPaths: the paths to show the user for selection
 * @param keep: optional boolean indicating whether to keep previous paths for testing purposes
 */
function showPaths(validPaths, keep) {
  if (!keep) Array.from(document.getElementsByClassName("clone")).forEach((c) => c.remove()); // clear previously shown paths
  controller.abort(); // clear existing event listeners
  controller = new AbortController();
  const listenerOptions = { signal: controller.signal };

  // 2d vector math and point representations:
  // Vectors are two-element arrays [x,y], which allows easier manipulation of both dimensions in the same way using map and so on.
  // Points are represented as Objects {x: ..., y: ...} instead for more intuitive formulas and easier SVG path splitting.
  // It doesn't seem worth the time, effort and space to use a library or refactor it out because we don't use this anywhere else in the code.
  // However if it becomes used elsewhere or it becomes a maintenance problem in the future, this could be refactored.

  if (lastPath && !keep) {
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
    // edges in path
    for (let j = 1; j < path.size() - 1; j += 2) {
      const id = path[j].id();
      const domEle = document.getElementById(id);
      if (!domEle) {
        console.error("DOM element with ID", id, "not found, cannot draw path", toString(path));
        continue;
      }
      const pathCount = (pathCounts.get(id) ?? -1) + 1;
      pathCounts.set(id, pathCount);

      domEle.classList.add("path");
      let arrowBodyEle = document.getElementById(id + "ArrowBody");
      if (!arrowBodyEle) console.warn("cannot find arrow body of " + id);
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
            // const n = points.length;
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
        eventEle.addEventListener("click", () => showTable(path), listenerOptions);
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
  document.getElementById("source-label").innerText = id;
  if (sourceElement) {
    oldSourceId = sourceElement.id;
    sourceElement.classList.remove("source");
  }
  //console.log(id);
  sourceElement = document.getElementById(id);
  sourceElement.classList.add("source");
  console.log("set source to", sourceElement);
}

function selectTarget(e, id) {
  e.preventDefault();
  document.getElementById("target-label").innerText = id;
  if (targetElement) {
    targetElement.classList.remove("target");
    if (sourceElement) {
      if (oldSourceId == sourceElement.id && id == targetElement.id) {
        notyf.warning(`All non-empty paths between ${oldSourceId} and ${id} are already shown.`);
        return;
      } else if (oldSourceId == id && targetElement.id == sourceElement.id) {
        notyf.success("Swapped source and target: paths remains the same in reverse.");
        //return;
      }
    }
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
      notyf.warning(`Sorry, we currently do not have any data for paths between ${sourceId} and ${targetId}`);
      break breakme;
    } else {
      console.info(allPaths.length, "paths found,", validPaths.length, " of them valid");
      console.table(validPaths.map((p) => p.toArray().map((x) => x.id())));
    }

    oldSourceId = sourceElement.id;

    if (validPaths.length == 1) {
      showPaths(validPaths);
      showTable(validPaths[0]);
      return;
    }
    document.getElementById("paths-label").innerText = `Showing all ${validPaths.length} paths between ${sourceElement.id} and ${id}, please select one.`;
    showPaths(validPaths);
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

/**
 * Disabled a specified set of nodes (makes them unclickable and greyed out)
 * @param {Array} nodeIds array of node ids
 */
function disableNodes(nodeIds) {
  nodeIds.forEach((id) => {
    const node = document.getElementById(id);
    if (!node) {
      console.error(`cannot disable node ${id}, element doesn't exist`);
      return;
    }
    node.classList.remove("node");
    node.classList.add("disabled-node");
  });
}

/**
 * Disabled a specified set of edges (makes them greyed out)
 * @param {Array} edgeIds array of edge ids
 */
function disableEdges(edgeIds) {
  edgeIds.forEach((id) => {
    edges[id].disabled = true;
    const node = document.getElementById(id);
    node.classList.remove("edge");
    node.classList.add("disabled-edge");
  });
}

export function getPath() {
  return lastPath === null ? false : lastPath;
}

window.addEventListener("load", main);
