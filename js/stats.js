/** Entrypoint to show stats and preprocessing results. */
import { graph } from "./graph.js";
import { paths } from "./path.js";

function hashCode(str) {
  return str.split("").reduce((prevHash, currVal) => ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0, 0);
}

function hash(path) {
  const ids = path.map((ele) => ele.id());
  const s = ids.reduce((a, b) => a + b);
  const h = hashCode(s);
  console.log("hash for ", ids, ":", h);
  return h;
}

/** Returns an array of all paths in the graph.
Each symmetric pair only occurs once.
For example: ["Language", "language", "SoftwareProduct", "license", "License"]
There are 8748 as of HITO 24.03.
*/
export function allPaths(cy) {
  const nodes = cy.nodes();
  const result = [];
  let count = 0;
  for (let i = 0; i < nodes.size(); i++) {
    const source = nodes[i];
    for (let j = i + 1; j < nodes.size(); j++) {
      const target = nodes[j];
      result.push(...paths(cy, source, target));
    }
  }
  return result;
}

/** Return hashes for each given path that has values in the SPARQL endpoint. */
function validHashes(ps) {
  const hashes = [];
  for (const p of ps) {
  }
  return hashes;
}

async function main() {
  document.write("loading graph...");
  const cy = await graph();
  document.write(cy.nodes().size() + " nodes, ", cy.edges().size() + " edges loaded.<br>");
  document.write("calculating all paths...");
  const ps = allPaths(cy);
  document.write(ps.length + " (symmetric), " + ps.length * 2 + " (total) <br>");
  document.write(validHashes(ps).length + " valid hashes");
}

window.addEventListener("load", main);
