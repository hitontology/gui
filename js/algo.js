// draft

function search(source, target) {
  // calculate all possible paths without cycles between source and target
  const paths = null;
  // show paths in meta model
  // user selects one path
  const path = null;
}

var source = null;

function main() {
  var cy = cytoscape({
    container: document.getElementById("cy"),
    style: [
      {
        selector: "edge[name]",
        style: {
          content: "data(name)",
        },
      },
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
    //cy.add({ group: "edges", data: { source: edge.source, target: edge.target } });
    cy.add({ group: "edges", data: edge });
  }
  const layout = cy.layout({
    name: "cose",
    nodeRepulsion: function (node) {
      return 2_000_000;
    },
  });
  cy.zoom(0.5);
  cy.minZoom(0.5);
  cy.maxZoom(1.5);
  layout.run();

  cy.on("tap", "node", function (evt) {
    var node = evt.target;
    console.log("source: " + node.id());
    source = node.id();
  });

  cy.on("cxttap", "node", function (evt) {
    var node = evt.target;
    console.log("target: " + node.id());
    target = node.id();
    if (source) {
      console.log(`calculating paths from ${source} to ${target}`);
    }
  });

  //{ group: "edges", data: { id: "e0", source: "n0", target: "n1" } },
}
