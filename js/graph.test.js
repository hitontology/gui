import { graph } from "./graph.js";
import { expect, test } from "vitest";

test("loads the Cytoscape graph", async () => {
  const cy = await graph();
  expect(cy.nodes().size()).toBe(33);
  expect(cy.edges().size()).toBe(39);
});
