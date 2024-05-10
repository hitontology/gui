/** Unit tests for the {@link stats} module.*/

import { graph } from "./graph.js";
import { validate, asyncFilter, allPaths } from "./stats.js";
import { paths, pathHash, toString } from "./path.js";
import { pathHashes } from "./pathHashes.js";
import { expect, test } from "vitest";

const cy = await graph();
const swp = cy.getElementById("SoftwareProduct");
const study = cy.getElementById("Study");

test("all paths", () => {
  // care: allPaths only gives ones one of each symmetric path pair but in this case they are contained
  const ps = allPaths(cy).filter((p) => {
    const pa = p.toArray();
    return pa[0].id() == "SoftwareProduct" && pa[pa.length - 1].id() == "Study";
  });
  const pss = ps.map(toString);
  const swpStudyPaths = paths(cy, swp, study);
  const stringStudyPaths = swpStudyPaths.map(toString);
  expect(stringStudyPaths).toMatchObject(pss);
});

test("validates paths correctly", async () => {
  const hashArray = Array.from(pathHashes); // expect does not have a native Set membership check
  {
    const ps = paths(cy, swp, study);
    expect(ps.length).toBe(13);
    const swpStudyValidPaths = await asyncFilter(ps, validate);

    expect(swpStudyValidPaths.length).toBe(1);
    const p = swpStudyValidPaths[0];
    expect(p.size()).toBe(3);
    const pa = p.toArray();
    //console.log(pa.map((x) => x.id()));
    expect(pa[0]).toBe(swp);
    expect(pa[2]).toBe(study);
    const swpStudyHash = pathHash(p);
    expect(hashArray).toContain(swpStudyHash);
  }
  {
    const astCit = cy.getElementById("ApplicationSystemTypeCitation");
    const astCat = cy.getElementById("ApplicationSystemTypeCatalogue");
    const ps = paths(cy, astCit, astCat);
    expect(ps.length).toBe(26);
    const astValidPaths = await asyncFilter(ps, validate);

    expect(astValidPaths.length).toBe(1);
    const p = astValidPaths[0];
    expect(p.size()).toBe(5);
    const pa = p.toArray();
    expect(pa[0]).toBe(astCit);
    expect(pa[4]).toBe(astCat);
    const hash = pathHash(p);
    expect(pathHashes.has(hash)).toBeTruthy();
  }
}, 20000);
