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

export function transform() {
  for (let t of terminologies) {
    for (let x of [
      ["catalogue", "terminologies"],
      ["classified", "terminology items"],
      ["citation", "folks' terms"],
    ]) {
      const g = document.getElementById(t[x[0]]);
      // Tooltip on mouseover not shown in Firefox, not tested in other browsers, TODO: fix.
      g.setAttribute("title", t.tooltip);
      const text = g.lastChild.lastChild.lastChild;
      text.innerHTML = x[1];
    }
  }
}
