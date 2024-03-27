/** Entrypoint to show stats and preprocessing results. */
import { graph } from "./graph.js";
import { paths, pathHash, pathQuery } from "./path.js";
import { select } from "./sparql.js";

/** Returns an array of all paths in the graph.
Each symmetric pair only occurs once.
For example: ["Language", "language", "SoftwareProduct", "license", "License"]
There are 8748 as of HITO 24.03.
*/
export function allPaths(cy) {
  const nodes = cy.nodes();
  const result = [];
  for (let i = 0; i < nodes.size(); i++) {
    const source = nodes[i];
    for (let j = i + 1; j < nodes.size(); j++) {
      const target = nodes[j];
      result.push(...paths(cy, source, target));
    }
  }
  return result;
}

/** Return whether the path has at least one row of data. */
export async function validate(path) {
  const query = pathQuery(path) + " LIMIT 1";
  // todo: "parallelize" i.e. Promise.all
  const bindings = await select(query, false, 3);
  return bindings.length > 0;
}

// by Google Gemini
export async function asyncFilter(arr, predicate) {
  const promises = arr.map(async (element) => {
    const result = await predicate(element);
    return result;
  });

  const results = await Promise.all(promises);
  return arr.filter((element, index) => results[index]);
}

/** Return hashes for each given path and its reverse that has values in the SPARQL endpoint. */
async function validHashes(cy, ps) {
  // ps = ps.slice(0, 1000); // for faster testing
  const validPaths = await asyncFilter(ps, validate);
  const reversePaths = validPaths.map((p) => cy.collection(p.toArray().reverse()));
  const hashes = [...validPaths, ...reversePaths].map(pathHash);
  return hashes;
}

/** To speed up preprocessing, temporarily set local SPARQL endpoint in js/sparql.js
 * Still takes a few minutes even with local SPARQL endpoint on an Intel i9-12900k.
 * Try if increasing Virtuoso buffer size significantly increases speed.
 */
export async function main() {
  document.write("loading graph...");
  const cy = await graph();
  document.write(cy.nodes().size() + " nodes, ", cy.edges().size() + " edges loaded.<br>");
  document.write("calculating all paths...");
  const ps = allPaths(cy);
  //const ps = paths(cy, swp, study);
  const swp = cy.getElementById("SoftwareProduct");
  const study = cy.getElementById("Study");
  document.write(ps.length + " (symmetric), " + ps.length * 2 + " (total) <br>");
  const hashes = await validHashes(cy, ps);
  document.write(hashes.length + " valid hashes<br>");
  document.write("hashes: <br>[" + hashes + "]");
}
