import { select } from "./sparql.js";
import { getPath } from "./index.js";
import { pathQuery, pathHash } from "./path.js";
import { Spinner } from "https://cdn.jsdelivr.net/npm/spin.js@4.1.1/spin.min.js";
import { createGrid, ModuleRegistry } from "https://cdn.jsdelivr.net/npm/@ag-grid-community/core/dist/core.esm.min.js";
// don't use minified version: https://github.com/ag-grid/ag-grid/issues/7755
import { ClientSideRowModelModule } from "https://cdn.jsdelivr.net/npm/@ag-grid-community/client-side-row-model/dist/client-side-row-model.esm.js";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

import { Notyf } from "https://cdn.jsdelivr.net/npm/notyf@3/notyf.es.js";
const notyf = new Notyf();

var grid = null;
var lastPathHash = null;

/**
 * Displays all instances of classes along a given path in a table with search and filter options.
 * @param {Cytoscape.Collection} path alternation of nodes and edges with nodes at both ends
 */
export async function showTable(path) {
  document.getElementById("legend").classList.add("hidden");
  document.getElementById("aggrid").classList.remove("hidden");
  document.getElementById("bottom").classList.add("grow");
  const hash = pathHash(path);
  if (lastPathHash === hash) {
    notyf.success("Already showing this path.");
    return;
  }
  lastPathHash = hash;
  const spinner = new Spinner({ color: "black", lines: 12 });
  spinner.spin(document.body);
  //console.log(path);
  const eles = path.toArray();
  const pathNodes = path.nodes().toArray();
  /*console.debug(
    "generating table for path",
    eles.map((ele) => ele.id())
  );*/
  const columnDefs = [];
  //const columns = pathNodes.map((node) => node.id());
  const cellRenderer = function (params) {
    const [suffix, label] = params.value;
    //return `<a href="https:/hitontology.eu/ontology/${suffix}" target="_blank">${suffix}</a>`;
    //return `<a href="https:/hitontology.eu/ontology/${suffix}" target="_blank">${label}</a>`;
    //return `<a href="${uri}" target="_blank">${label}</a>`;
    return `<a href="https:/hitontology.eu/ontology/${suffix}" target="_blank">${label}</a>`;
  };

  /*  const valueFormatter = function (params) {
    const [suffix, label] = params.value;
    return suffix + " " + label;
  };*/

  const pathEdges = path.edges().toArray();
  let i = 0;
  for (let node of pathNodes) {
    let headerName = node.id();
    if (i < pathEdges.length) headerName += " " + pathEdges[i].id();
    i++;
    columnDefs.push({
      field: node.id(),
      headerName,
      //valueFormatter,
    });
  }

  const query = pathQuery(path);
  const result = await select(query);
  // if new path was selected while waiting for SPARQL query to finish
  /* does not work correctly, disabling
  if (path !== getPath()) {
    notyf.error("New path was selected while SPARQL query was run. Not displaying old path results now.");
    return;
  }
  */
  // display SPARQL query results in table
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
  console.table(columnDefs);
  console.table(rowData);

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
  spinner.stop();
}
