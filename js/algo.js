// draft

function search(source, target) {
  // calculate all possible paths without cycles between source and target
  const paths = null;
  // show paths in meta model
  // user selects one path
  const path = null;
}

function main() {
  var cy = cytoscape({
    container: document.getElementById("cy"),
    style: [
      {
        selector: "node[name]",
        style: {
          content: "data(name)",
        },
      },
    ],
  });
  for (let node of nodes) {
    cy.add({ group: "nodes", data: { id: node.id, name: node.name } });
  }
  for (let edge of edges) {
    cy.add({ group: "edges", data: { source: edge.source, target: edge.target } });
  }
  const layout = cy.layout({
    name: "cose",
  });
  cy.zoom(0.5);
  cy.minZoom(0.5);
  cy.maxZoom(4);
  layout.run();

  //{ group: "edges", data: { id: "e0", source: "n0", target: "n1" } },
}
