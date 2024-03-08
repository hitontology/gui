import { nodes } from "./nodes.js";
import { edges } from "./edges.js";
import { select } from "./sparql.js";
import { style } from "./style.js";
import { paths } from "./path.js";
import { table } from "./table.js";

var source = null;
var target = null;
//var path = null;
var grid = null;
var cy = null;

function toString(collection) {
  return collection.toArray().map((e) => e.id());
}

async function main() {
  cy = cytoscape({
    container: document.getElementById("cy"),
    style,
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
    breakme: if (source) {
      console.log(`calculating paths from ${source.id()} to ${target.id()}`);
      //const path = shortestPath(source,target);
      const allPaths = paths(cy, source, target);
      if (allPaths.length === 0) {
        console.warn(`No paths found between ${source.id()} and ${target.id()}}`);
        break breakme;
      } else {
        console.info(allPaths.length, "paths found");
        console.table(allPaths.map((p) => p.toArray().map((x) => x.id())));
      }
      const path = allPaths[0];
      //path.select();
      table(path);
    }
  });

  //{ group: "edges", data: { id: "e0", source: "n0", target: "n1" } },
}

window.addEventListener("load", main);
