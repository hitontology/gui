/** @module tooltip */
import { select } from "./sparql.js";
import { SVG } from "https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js/dist/svg.esm.js";

/** Terminologies with catalogue, classified and citation items. */
export const terminologies = [
  {
    name: "application system types",
    base: "ApplicationSystemType",
    tooltip: "<b>Application system</b><br>Installation of a certain →  application software product on a certain computer system.",
  },
  {
    name: "functions",
    base: "EnterpriseFunction",
    tooltip:
      "<b>Information processing function (short: function)</b><br>Directive in a → health care setting on how to use → data on → entity types and how to update data on entity types.",
  },
  {
    name: "features",
    base: "Feature",
    tooltip:
      "<b>Feature</b><br>Functionality offered by the → application software product of an → application system which directly contributes to the fulfillment of one or more → functions.",
  },
  { name: "organizational units", base: "OrganizationalUnit", tooltip: "<b>Organizational unit</b>Part of a → health care facility which can be defined by responsibilities.<br>" },
  { name: "roles", base: "UserGroup", tooltip: "<b>Role</b><br>Sum of expectations addressed to persons or groups of persons." },
  //{ name: "", base:"", tooltip:"<b></b><br>"},
  // Application software product Acquired of self-developed piece of software that can be installed on a → computer system.
];

for (let t of Object.values(terminologies)) {
  t.catalogue = t.base + "Catalogue";
  t.classified = t.base + "Classified";
  t.citation = t.base + "Citation";
}

/** @returns an map from class ID to definition "def".
 * Example: const def = (await nodeDefinitions()).get("SoftwareProduct"); */
// If we need more class attributes from the endpoint in the future, generalize this, so we only use a single query for better performance.
async function selectClassDefs() {
  const query = `SELECT DISTINCT
  (REPLACE(STR(?c), "http://hitontology.eu/ontology/", "") as ?c)
  (STR(SAMPLE(?def)) as ?def)
  {
    ?c a owl:Class; rdfs:comment ?def.
    FILTER(LANGMATCHES(LANG(?def),"en"))
  } GROUP BY ?c`;
  const result = await select(query);
  return new Map(result.map((b) => [b.c.value, b.def.value]));
}

export async function addTooltips() {
  const classDefs = await selectClassDefs();
  /*  for (let t of terminologies) {
    for (let x of ["catalogue", "classified", "citation"]) {
      const g = document.getElementById(t[x]);
      // Title attribute doesn't seem to work in the browser, use title element instead in SVG.
      //g.setAttribute("title", t.tooltip);
    }
  }
  */
  classDefs.forEach((def, id) => {
    const g = document.getElementById(id);
    if (!g) return;
    const titleEle = document.createElementNS("http://www.w3.org/2000/svg", "title");
    const txtNode = document.createTextNode(def);
    titleEle.appendChild(txtNode);
    g.append(titleEle);
  });
}
