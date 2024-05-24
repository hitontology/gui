/** @module nodes */

/**  @typedef {Object} NodeObject
 * @property {string} name English label of the class, such as "Software Product"
 * @property {number} x x coordinate where the class should be displayed, formerly used with a Cytoscape display but not with the new SVG approach.
 * @property {number} y y coordinate where the class should be displayed, formerly used with a Cytoscape display but not with the new SVG approach.
 */

/** HITO classes along with positions for the Cytoscape based display as
 * object map from a HITO class suffix, such as "SoftwareProduct" for hito:SoftwareProduct, to NodeObject values.
 * @type {Object.<string, NodeObject>}
 */
export const nodes = {
  SoftwareProduct: { name: "Software Product", x: 0, y: 0 },
  EnterpriseFunctionClassified: { name: "Enterprise Function Classified", x: 10, y: 20 },
  EnterpriseFunctionCitation: { name: "Enterprise Function Citation", x: 10, y: 10 },
  EnterpriseFunctionCatalogue: { name: "Enterprise Function Catalogue", x: 10, y: 30 },
  ApplicationSystemTypeCitation: { name: "Application System Type Citation", x: 0, y: 10 },
  ApplicationSystemTypeClassified: { name: "Application System Type Classified", x: 0, y: 20 },
  ApplicationSystemTypeCatalogue: { name: "Application System Type Catalogue", x: 0, y: 30 },
  FeatureCitation: { name: "Feature Citation", x: 20, y: 10 },
  FeatureClassified: { name: "Feature Classified", x: 20, y: 20 },
  FeatureCatalogue: { name: "Feature Catalogue", x: 20, y: 30 },
  Homepage: { name: "Homepage", type: "string", x: 25, y: 35 },
  OutcomeCriteriaCitation: { name: "Outcome Criteria Citation", x: 35, y: 10 },
  OutcomeCriteriaClassified: { name: "Outcome Criteria Classified", x: 35, y: 20 },
  OutcomeCriteriaCatalogue: { name: "Outcome Criteria Catalogue", x: 0, y: 0 },
  OrganizationalUnitCitation: { name: "Organizational Unit Citation", x: 0, y: -10 },
  OrganizationalUnitClassified: { name: "Organizational Unit Classified", x: 0, y: -20 },
  OrganizationalUnitCatalogue: { name: "Organizational Unit Catalogue", x: 0, y: -30 },
  UserGroupCitation: { name: "User Group Citation", x: 10, y: -15 },
  UserGroupClassified: { name: "User Group Classified", x: 10, y: -25 },
  UserGroupCatalogue: { name: "User Group Catalogue ", x: 10, y: -35 },
  Study: { name: "Study", x: 25, y: 0 },
  StudyMethod: { name: "Study Method", x: 35, y: 30 },
  FirstAuthor: { name: "First Author", type: "string", x: 35, y: -10 },
  DatabaseManagementSystem: { name: "Database Management System", x: -15, y: 30 },
  Certification: { name: "Certification", x: -20, y: -30 },
  Client: { name: "Client", x: -15, y: 25 },
  Interoperability: { name: "Interoperability Standard", x: -15, y: 20 },
  Language: { name: "Language", external: "<http://dbpedia.org/ontology/Language>", x: -15, y: 15 },
  License: { name: "License", x: -15, y: 10 },
  OperatingSystem: { name: "Operating System", x: -15, y: 0 },
  PublishedInYear: { name: "Published In Year", type: "string", x: -15, y: -5 }, // external DBPedia class
  ProgrammingLanguage: { name: "Programming Language", external: "<http://dbpedia.org/ontology/ProgrammingLanguage>", x: -15, y: -5 }, // external DBPedia class
  ProgrammingLibrary: { name: "Programming Library", x: -15, y: 5 },
  Pmid: { name: "PMID", type: "string", x: 35, y: -15 },
  Repository: { name: "Repository", type: "string", x: 35, y: -15 },
  //gYear: { name: "Year", type: "string", x: 35, y: -20 },
  Journal: { name: "Journal", x: 35, y: -25 },
};
