import { graph } from "./graph.js";
import { validate, asyncFilter } from "./stats.js";
import { paths } from "./path.js";
import { expect, test } from "vitest";

test("validates paths correctly", async () => {
  const cy = await graph();
  const source = cy.getElementById("ApplicationSystemTypeCitation");
  const target = cy.getElementById("ApplicationSystemTypeCatalogue");
  const ps = paths(cy, source, target);
  expect(ps.length).toBe(26);
  const validPaths = await asyncFilter(ps, validate);
  expect(validPaths.length).toBe(1);
}, 20000);
