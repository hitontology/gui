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

async function table(path) {
  const eles = path.toArray();
  const pathNodes = path.nodes().toArray();
  const pathEdges = path.edges().toArray();
  console.debug(
    "generating table for path",
    eles.map((ele) => ele.id())
  );
  const columnDefs = [];
  const columns = pathNodes.map((node) => node.id());
  const cellRenderer = function (params) {
    //const [uri,label] = params.value;
    const [suffix, label] = params.value;
    //const [suffix,label] = params.value.split("|");
    //return `<a href="https:/hitontology.eu/ontology/${suffix}" target="_blank">${suffix}</a>`;
    //return `<a href="https:/hitontology.eu/ontology/${suffix}" target="_blank">${label}</a>`;
    //return `<a href="${uri}" target="_blank">${label}</a>`;
    return `<a href="https:/hitontology.eu/ontology/${suffix}" target="_blank">${label}</a>`;
  };

  const valueFormatter = function (params) {
    const [suffix, label] = params.value;
    return suffix + " " + label;
  };

  for (let node of pathNodes) {
    columnDefs.push({
      field: node.id(),
      valueFormatter, // does not work in defaultColDef
    });
  }

  let query = "SELECT ";
  let isNode = true;
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
  const result = await select(query);
  let rowData = [];
  for (let binding of result) {
    let row = {};
    for (let i = 0; i < pathNodes.length; i++) {
      const node = pathNodes[i];
      // row[node.id()] = binding["n" + (i + 1)].value.replaceAll("http://hitontology.eu/ontology/", ""); // URI Suffix as cell value
      //row[node.id()] = binding["l" + (i + 1)].value; // label as cell value
      //row[node.id()] = `<a href="https:/hitontology.eu/ontology/${suffix}" target="_blank">${label}</a>`;
      const uri = binding["n" + (i + 1)].value;
      const suffix = uri.replaceAll("http://hitontology.eu/ontology/", "");
      const label = binding["l" + (i + 1)].value;
      row[node.id()] = [suffix, label];
      //row[node.id()] = [uri,label];
      //row[node.id()] = suffix + "|" + label;
    }
    rowData.push(row);
  }
  //console.log(columnDefs);
  //console.log(rowData);

  const defaultColDef = {
    editable: false,
    filter: "agTextColumnFilter",
    cellRenderer,
  };
  //const table = document.getElementById("table");
  const gridOptions = {
    rowData,
    columnDefs,
    defaultColDef,
    autoSizeStrategy: { type: "fitCellContents" },
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
        style: { content: "data(name)" },
      },
      {
        selector: "node.source",
        css: { "background-color": "rgb(80,20,200)" },
      },
      {
        selector: "node.target",
        css: { "background-color": "rgb(0,140,200)" },
      },
      {
        selector: "node.isolated",
        css: { "background-color": "rgb(200,200,200)" },
      },
    ],
  });
  for (const [id, node] of Object.entries(nodes)) {
    //console.log("id", id,"node", node);
    cy.add({
      group: "nodes",
      data: {
        id,
        name: node.name,
      },
    });
  }
  for (let edgeId in edges) {
    const data = {
      ...edges[edgeId],
      id: edgeId,
    };
    const query = `SELECT COUNT(*) AS ?count WHERE {?s hito:${edgeId} ?o.}`;
    const result = await select(query);
    const count = result[0].count.value;
    if (count == 0) {
      console.warn("Removing unused property", edgeId);
      continue;
    }
    data.width = Math.log2(count + 2);
    cy.add({
      group: "edges",
      data,
    });
  }
  const isolated = cy.nodes().filter((node) => node.degree() === 0);
  if (isolated.size() > 0) {
    console.warn(
      isolated.size(),
      "isolated nodes:",
      isolated.map((node) => node.id())
    );
    isolated.addClass("isolated");
    //cy.remove(isolated);
  }
  const presetOptions = {
    name: "preset",
    // could use an object map too but this is simpler
    positions: function (node) {
      const id = node.id();
      // point y axis upwards
      return {
        x: nodes[id].x * 22,
        y: nodes[id].y * -10,
      };
    },
  };
  const coseOptions = {
    name: "cose",
    nodeRepulsion: function (node) {
      return 2_000_000;
    },
  };
  const layout = cy.layout(presetOptions);
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
    if (node.classes().includes("isolated")) {
      return;
    }
    //console.log("source: " + node.id());
    if (source) {
      source.removeClass("source");
    }
    source = node;
    source.addClass("source");
    //paths = cy.elements().cytoscapeAllPaths({maxPaths: 1000, rootIds: [source]});
    //paths = cy.elements().cytoscapeAllPaths({ maxPaths: 1000 });
    //console.log(paths.length, "paths found from source", source, ": ", paths);
  });

  cy.on("cxttap", "node", function (evt) {
    var node = evt.target;
    if (node.classes().includes("isolated")) {
      return;
    }
    //console.log("target: " + node.id());
    if (target) {
      target.removeClass("target");
    }
    target = node;
    target.addClass("target");
    if (source) {
      //console.log(`calculating paths from ${source.id()} to ${target.id()}`);
      if (path) path.unselect();
      path = cy.elements().aStar({
        root: source,
        goal: target,
      }).path;
      path.select();
      table(path);
    }
  });

  //{ group: "edges", data: { id: "e0", source: "n0", target: "n1" } },
}

window.addEventListener("load", main);
