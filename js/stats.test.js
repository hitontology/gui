/** Unit tests for the {@link stats} module.*/

import { graph } from "./graph.js";
import { validate, asyncFilter, allPaths } from "./stats.js";
import { paths, pathHash, toString } from "./path.js";
import { pathHashes } from "./pathHashes.js";
import { expect, test } from "vitest";

const cy = await graph();
const swp = "SoftwareProduct";
const study = "Study";
const astCit = "ApplicationSystemTypeCitation";
const astCat = "ApplicationSystemTypeCatalogue";
const ocCla = "OutcomeCriteriaClassified";
const ocCat = "OutcomeCriteriaCatalogue";

test("all paths", () => {
  // care: allPaths only gives ones one of each symmetric path pair but in this case they are contained
  const ps = allPaths(cy).filter((p) => {
    const pa = p.toArray();
    return pa[0].id() == "SoftwareProduct" && pa[pa.length - 1].id() == "Study";
  });
  const pss = ps.map(toString);
  const swpStudyPaths = paths(cy, cy.getElementById(swp), cy.getElementById(study));
  const stringStudyPaths = swpStudyPaths.map(toString);
  expect(stringStudyPaths).toMatchObject(pss);
});

test.each([
  [swp, "Repository", 1, 1, 3],
  [swp, "Homepage", 1, 1, 3],
  [swp, "FirstAuthor", 13, 1, 5],
  [swp, "Pmid", 13, 1, 5],
  [swp, "PublishedInYear", 13, 1, 5],
  [study, "Pmid", 1, 1, 3],
  [study, "FirstAuthor", 1, 1, 3],
  [swp, "Language", 1, 1, 3],
  [swp, "ProgrammingLanguage", 1, 1, 3],
  [ocCla, ocCat, 1, 1, 3],
  [astCit, astCat, 26, 1, 5],
  [swp, study, 13, 1, 3],
])(
  "count and validate paths between %s and %s",
  async (sourceId, targetId, count, validCount, firstPathLength) => {
    const hashArray = Array.from(pathHashes); // expect does not have a native Set membership check
    const source = cy.getElementById(sourceId);
    const target = cy.getElementById(targetId);
    const ps = paths(cy, source, target);
    expect(ps.length).toBe(count);
    const validPaths = await asyncFilter(ps, validate);

    expect(validPaths.length).toBe(validCount);
    const p = validPaths[0];
    expect(p.size()).toBe(firstPathLength);
    const pa = p.toArray();
    expect(pa[0]).toBe(source);
    expect(pa[pa.length - 1]).toBe(target);
    const hash = pathHash(p);
    expect(pathHashes.has(hash), "does not contain hash " + hash).toBeTruthy();
  },
  20000
);
