/**
 * @returns an array of paths without cycles from source to target treating all edges as undirected.
 * Each path is an ordered Cytoscape collection with alternating nodes and edges, nodes being at both endpoints.
 * @param {Cytoscape collection} visited all visited nodes
 * @param {Cytoscape collection} path all visited nodes and edges
 * @param {Cytoscape node} target last node of the path
 */
function pathsRec(visited, path, target) {
  const cursor = visited.last();
  /*console.log(
    "visited",
    visited.toArray().map((n) => n.id()),
    "target",
    target.id()
  );*/
  if (visited.size() > 20) {
    console.error("path too long");
    return [];
  }
  if (cursor.id() == target.id()) {
    //console.log("FOUND IT");
    return [path];
  }
  const next = cursor.incomers().merge(cursor.outgoers());
  //console.log("next", toString(next));
  const results = [];
  for (let i = 0; i < next.size() / 2; i++) {
    const edge = next[i * 2];
    const node = next[i * 2 + 1];
    if (visited.has(node)) {
      continue;
    }
    results.push(...pathsRec(visited.union(node), path.union(edge).union(node), target));
  }
  results.sort((a, b) => a.size() - b.size());
  return results;
}

/**
 * @returns an array of paths without cycles from source to target treating all edges as undirected
 * @param {Cytoscape node} source first node of the path
 * @param {Cytoscape node} target last node of the path
 */
export function paths(cy, source, target) {
  return pathsRec(cy.collection(source), cy.collection(source), target);
}

function strHash(str) {
  return str.split("").reduce((prevHash, currVal) => ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0, 0);
}

export function pathHash(path) {
  const ids = path.map((ele) => ele.id());
  const s = ids.reduce((a, b) => a + b);
  const h = strHash(s);
  console.log("hash for ", ids, ":", h);
  return h;
}
