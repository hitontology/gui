import { nodes } from "./nodes.js";
import { edges } from "./edges.js";
import { select } from "./sparql.js";

function search(source, target) {
  // calculate all possible paths without cycles between source and target
  const paths = null;
  // show paths in meta model
  // user selects one path
  const path = null;
}

var source = null;
var target = null;
var paths = null;
var path = null;

var grid = null;

function table(path) {
  const eles = path.toArray();
  const nodes = path.nodes().toArray();
  const edges = path.edges().toArray();
  console.debug(
    "generating table for path",
    eles.map((ele) => ele.id())
  );
  let columnDefs = [];
  let columns = nodes.map((node) => node.id());
  for (let node of nodes) {
    columnDefs.push({ field: node.id() });
  }

  let rowData = [];
  for (let i = 0; i < 5; i++) {
    let row = {};
    for (let column of columns) {
      row[column] = "test" + Math.floor(Math.random() * 100);
    }
    rowData.push(row);
  }

  let query = "SELECT * { ";
  let isNode = true;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    query += `?n${i + 1} a hito:${node.id()}. `;
  }

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    query += `?n${i + 1} hito:${edge.id()} ?n${i + 2}. `;
  }
  query += "}";
  console.log(query);

  //const table = document.getElementById("table");
  const gridOptions = {
    rowData,
    columnDefs,
  };
  const gridEle = document.getElementById("grid");
  if (grid) {
    grid.destroy();
  }
  grid = agGrid.createGrid(gridEle, gridOptions);
}

async function main() {
  var cy = cytoscape({
    container: document.getElementById("cy"),
    style: [
      {
        selector: "edge[name]",
        style: {
          "curve-style": "straight",
          "target-arrow-shape": "triangle",
          width: "data(width)",
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
    const query = `SELECT COUNT(*) AS ?count WHERE {?s hito:${edge.id} ?o.}`;
    const result = await select(query);
    const count = result[0].count.value;
    console.log(edge.id, count);
    if (count == 0) {
      continue;
    }
    edge.width = Math.log2(count + 2);
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
      table(path);
    }
  });

  //{ group: "edges", data: { id: "e0", source: "n0", target: "n1" } },
}

window.addEventListener("load", main);
