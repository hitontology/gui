import { nodes } from "./nodes.js";
import { edges } from "./edges.js";
import { select } from "./sparql.js";
import { style } from "./style.js";
import cytoscape from "../node_modules/cytoscape/dist/cytoscape.esm.min.js";

/** */
async function edgeData(edgeId) {
  const data = {
    ...edges[edgeId],
    id: edgeId,
  };
  const query = `SELECT COUNT(*) AS ?count WHERE {?s hito:${edgeId} ?o.}`;
  const result = await select(query);
  const count = result[0].count.value;
  if (count == 0) {
    console.warn("Removing unused property", edgeId);
  }
  data.width = Math.log2(count + 2);
  return data;
}

/** Cytoscape.js graph with HITO classes as nodes and connecting properties as edges.
 * Can optionally be displayed as well.
 */
export async function graph(visualize) {
  const options = visualize ? { container: document.getElementById("cy"), style } : {};
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
  cy.add(
    await Promise.all(
      Object.keys(edges).map(async (eid) => ({
        group: "edges",
        data: await edgeData(eid),
      }))
    )
  );
  console.log("cy size", cy.nodes().size());
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
