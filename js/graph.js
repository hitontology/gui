import { nodes } from "./nodes.js";
import { edges } from "./edges.js";
import { select } from "./sparql.js";
import { style } from "./style.js";
import cytoscape from "https://cdn.jsdelivr.net/npm/cytoscape/dist/cytoscape.esm.min.js";

/** returns a map from HITO properties to counts */
async function selectEdgeCounts() {
  const query = "SELECT ?p COUNT(*) AS ?count WHERE {?s ?p ?o. {?p a owl:ObjectProperty.} UNION {?p a owl:DatatypeProperty.} } GROUP BY ?p";
  const result = await select(query);
  return new Map(result.map((b) => [b.p.value.replace("http://hitontology.eu/ontology/", ""), b.count.value]));
}

/** */
function edgeObject(id, count) {
  const obj = {
    group: "edges",
    data: {
      id,
      width: Math.log2(count + 2),
      ...edges[id],
    },
  };
  if (count == 0) {
    console.warn("Removing unused property", id);
  }
  return obj;
}

/** Cytoscape.js graph with HITO classes as nodes and connecting properties as edges.
 * Can optionally be displayed as well.
 */
export async function graph(visualize) {
  const options = visualize ? { container: document.getElementById("cy"), style } : {};
  const edgeCounts = await selectEdgeCounts();
  const cy = cytoscape(options);
  for (const [id, node] of Object.entries(nodes)) {
    cy.add({
      group: "nodes",
      data: {
        id,
        name: node.name,
      },
    });
  }
  cy.add(Object.keys(edges).map((eid) => edgeObject(eid, edgeCounts.get(eid))));
  const isolated = cy.nodes().filter((node) => node.degree() === 0);
  if (isolated.size() > 0) {
    console.warn(
      isolated.size(),
      "isolated nodes:",
      isolated.map((node) => node.id())
    );
    isolated.addClass("isolated");
  }
  return cy;
}
