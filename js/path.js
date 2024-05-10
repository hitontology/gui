/** @module path */
import { nodes } from "./nodes.js";
import { edges } from "./edges.js";

/** @returns a string representation of a Cytoscape path */
export function toString(path) {
  return path
    .toArray()
    .map((x) => x.id())
    .reduce((a, b) => a + " " + b);
}

/**
 * @returns An array of paths without cycles from source to target treating all edges as undirected.
 * Each path is an ordered Cytoscape collection with alternating nodes and edges, nodes being at both endpoints.
 * @param {cytoscape.collection} visited all visited nodes
 * @param {cytoscape.collection} path all visited nodes and edges
 * @param {cycape.node} target last node of the path
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
 * @param {cytoscape.node} source first node of the path
 * @param {cytoscape.node} target last node of the path
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
  //console.debug("hash for ", ids, ":", h);
  return h;
}

/** returns a SPARQL select query for a given path */
export function pathQuery(path) {
  const pathNodes = path.nodes().toArray();
  const pathEdges = path.edges().toArray();
  let query = "SELECT ";
  //let isNode = true;
  for (let i = 0; i < pathNodes.length; i++) {
    query += `?n${i + 1} SAMPLE(?l${i + 1}) AS ?l${i + 1} `;
  }
  query += " { ";
  for (let i = 0; i < pathNodes.length; i++) {
    const nodeId = pathNodes[i].id();
    const node = nodes[nodeId];
    if (node?.type === "string") {
      continue;
    }
    //console.log("node", nodeId, node.type, node);
    query += `?n${i + 1} a hito:${nodeId}. `;
    query += `?n${i + 1} rdfs:label ?l${i + 1}. `;
  }

  for (let i = 0; i < pathEdges.length; i++) {
    const pathEdge = pathEdges[i];
    const id = pathEdge.id();
    const edge = edges[id];

    //console.log("edge id ", id);
    // arrow points from source to target
    if (edge.source === pathNodes[i].id()) {
      query += `?n${i + 1} hito:${id} ?n${i + 2}. `;
    }
    // arrow points from target to source
    else {
      query += `?n${i + 2} hito:${id} ?n${i + 1}. `;
    }
  }
  query += "}";
  return query;
}
