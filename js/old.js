import { nodes } from "./nodes.js";
import { paths } from "./path.js";
import { table } from "./table.js";
import { graph } from "./graph.js";

var source = null;
var target = null;
//var path = null;
var cy = null;

/** Debugging function to get the IDs in a Cytoscape Collection 
@param {Cytoscape.Collection} collection
*/
function toString(collection) {
  return collection.toArray().map((e) => e.id());
}

/** entry point */
async function main() {
  cy = await graph(true);
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
      table(path);
    }
  });
}

window.addEventListener("load", main);
