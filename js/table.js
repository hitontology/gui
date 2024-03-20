import { nodes } from "./nodes.js";
import { edges } from "./edges.js";
import { select } from "./sparql.js";
import { createGrid, ModuleRegistry } from "https://cdn.jsdelivr.net/npm/@ag-grid-community/core/dist/core.esm.min.js";
// don't use minified version: https://github.com/ag-grid/ag-grid/issues/7755
import { ClientSideRowModelModule } from "https://cdn.jsdelivr.net/npm/@ag-grid-community/client-side-row-model/dist/client-side-row-model.esm.js";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

var grid = null;

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

/**
 * Displays all instances of classes along a given path in a table with search and filter options.
 * @param {Cytoscape.Collection} path alternation of nodes and edges with nodes at both ends
 */
export async function table(path) {
  console.log(path);
  const eles = path.toArray();
  const pathNodes = path.nodes().toArray();
  console.debug(
    "generating table for path",
    eles.map((ele) => ele.id())
  );
  const columnDefs = [];
  //const columns = pathNodes.map((node) => node.id());
  const cellRenderer = function (params) {
    const [suffix, label] = params.value;
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

  const query = pathQuery(path);
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
  const gridOptions = {
    rowData,
    columnDefs,
    defaultColDef,
    autoSizeStrategy: { type: "fitCellContents" },
  };
  const gridEle = document.getElementById("aggrid");
  if (grid) {
    grid.destroy();
  }
  grid = createGrid(gridEle, gridOptions);
}
