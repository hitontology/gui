// draft

function search(source, target) {
  // calculate all possible paths without cycles between source and target
  const paths = null;
  // show paths in meta model
  // user selects one path
  const path = null;
}

var source = null;
var paths = null;
var path = null;

function main() {
  var cy = cytoscape({
    container: document.getElementById("cy"),
    style: [
      {
        selector: "edge[name]",
        style: {
          "curve-style": "straight",
          "target-arrow-shape": "triangle",
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
  /* 
    paths = cy.elements().cytoscapeAllPaths({ maxPaths: 1000 });
	// Usage example: display each path at regular intervals
    let maxTimes = paths.length;
    let currentTimes = 0;
    let selectedEles;
    let interval = setInterval(() => {
      if (currentTimes === maxTimes) {
        currentTimes = 0;
      } else {
        if (selectedEles) selectedEles.unselect();
        selectedEles = paths[currentTimes];
        selectedEles.select();
        currentTimes++;
      }
    }, 2000);
*/

  cy.on("tap", "node", function (evt) {
    var node = evt.target;
    //console.log("source: " + node.id());
    source = node;
    //paths = cy.elements().cytoscapeAllPaths({maxPaths: 1000, rootIds: [source]});
    //paths = cy.elements().cytoscapeAllPaths({ maxPaths: 1000 });
    //console.log(paths.length, "paths found from source", source, ": ", paths);
  });

  cy.on("cxttap", "node", function (evt) {
    var node = evt.target;
    console.log("target: " + node.id());
    target = node;
    if (source) {
      console.log(`calculating paths from ${source.id()} to ${target.id()}`);
      if (path) path.unselect();
      path = cy.elements().aStar({ root: source, goal: target }).path;
      path.select();
    }
  });

  //{ group: "edges", data: { id: "e0", source: "n0", target: "n1" } },
}
