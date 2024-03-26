import { graph } from "./graph.js";
import { validate, asyncFilter } from "./stats.js";
import { paths, pathHash } from "./path.js";
import { expect, test } from "vitest";

test("validates paths correctly", async () => {
  const cy = await graph();
  {
    const swp = cy.getElementById("SoftwareProduct");
    const study = cy.getElementById("Study");
    const ps = paths(cy, swp, study);
    expect(ps.length).toBe(13);
    const swpStudyValidPaths = await asyncFilter(ps, validate);

    expect(swpStudyValidPaths.length).toBe(1);
    const p = swpStudyValidPaths[0];
    expect(p.size()).toBe(3);
    const pa = p.toArray();
    console.log(pa.map((x) => x.id()));
    expect(pa[0]).toBe(swp);
    expect(pa[2]).toBe(study);
  }
  {
    const astCit = cy.getElementById("ApplicationSystemTypeCitation");
    const astCat = cy.getElementById("ApplicationSystemTypeCatalogue");
    const ps = paths(cy, astCit, astCat);
    expect(ps.length).toBe(26);
    const astValidPaths = await asyncFilter(ps, validate);

    expect(astValidPaths.length).toBe(1);
    const pa = astValidPaths[0].toArray();
    expect(pa.length).toBe(5);
    expect(pa[0]).toBe(astCit);
    expect(pa[4]).toBe(astCat);
  }
}, 20000);
