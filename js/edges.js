/** @module edges */

/**  @typedef {Object} EdgeObject
 * @property {string} source suffix of the RDFS domain of the property, such as "SoftwareProduct"
 * @property {string} target suffix of the RDFS range of the property, such as "EnterpriseFunctionCitation"
 * @property {string} name English label of the property, such as "supports"
 * @property {string} iname Inverse formulation of the label for when an edge is followed in reverse direction.
 * Mostly through passive voice, for example "supports" -> "is supported by".
 */

/** Object map from a HITO property suffix, such as "spSupportsEfCit" for hito:spSupportsEfCit, to EdgeObject values.
 * @type {Object.<string, EdgeObject>}
 */
export const edges = {
  spIsOfAstCit: { source: "SoftwareProduct", target: "ApplicationSystemTypeCitation", name: "is of", iname: "is type of" },
  spSupportsEfCit: { source: "SoftwareProduct", target: "EnterpriseFunctionCitation", name: "supports", iname: "is supported by" },
  spOffersFCit: { source: "SoftwareProduct", target: "FeatureCitation", name: "offers", iname: "is offered by" },
  spUsedInOuCit: { source: "SoftwareProduct", target: "OrganizationalUnitCitation", name: "used in", iname: "uses" },
  spUsedByUserCit: { source: "SoftwareProduct", target: "UserGroupCitation", name: "used by", iname: "uses" },
  evaluatesProduct: { source: "Study", target: "SoftwareProduct", name: "evaluates", iname: "is evaluated by" },
  evaluatesApplicationSystemType: { source: "Study", target: "ApplicationSystemTypeCitation", name: "evaluates", iname: "is evaluated by" },
  evaluatesApplicationSystemTypeHavingFeature: { source: "Study", target: "FeatureCitation", name: "evaluates", iname: "is evaluated by" },
  ocEvaluatesOcCit: { source: "Study", target: "OutcomeCriteriaCitation", name: "evaluates", iname: "is evaluated by" },
  evaluatesApplicationSystemTypeHavingUserGroup: {
    source: "Study",
    target: "UserGroupCitation",
    name: "evaluates application system or software product used by",
    iname: "uses application system or software product evaluated in",
  },
  evaluatesApplicationSystemTypeUsedInUnit: {
    source: "Study",
    target: "OrganizationalUnitCitation",
    name: "evaluates application system or software product used in",
    iname: "uses application system or software product evaluated in",
  },
  efCitClassifiedAs: { source: "EnterpriseFunctionCitation", target: "EnterpriseFunctionClassified", name: "classified as", iname: "classifies" },
  efClaFrom: { source: "EnterpriseFunctionClassified", target: "EnterpriseFunctionCatalogue", name: "from catalogue", iname: "contains" },
  //"supportedByFeatureCitation": {source: "EnterpriseFunctionCitation", target: "FeatureCitation", name: "supported by feature citation",, iname: ""}, // overlap in display
  astCitClassifiedAs: { source: "ApplicationSystemTypeCitation", target: "ApplicationSystemTypeClassified", name: "classified as", iname: "classifies" },
  astClaFrom: { source: "ApplicationSystemTypeClassified", target: "ApplicationSystemTypeCatalogue", name: "from catalogue", iname: "contains" },
  astClaSupportsEfCla: { source: "ApplicationSystemTypeClassified", target: "EnterpriseFunctionClassified", name: "supports", iname: "is supported by" },
  fCitClassifiedAs: { source: "FeatureCitation", target: "FeatureClassified", name: "classified as", iname: "classifies" },
  fClaFrom: { source: "FeatureClassified", target: "FeatureCatalogue", name: "from catalogue", iname: "contains" },
  ocCitClassifiedAs: { source: "OutcomeCriteriaCitation", target: "OutcomeCriteriaClassified", name: "classified as", iname: "classifies" },
  ocClaFrom: { source: "OutcomeCriteriaClassified", target: "OutcomeCriteriaCatalogue", name: "from catalogue", iname: "contains" },
  ouCitClassifiedAs: { source: "OrganizationalUnitCitation", target: "OrganizationalUnitClassified", name: "classified as", iname: "classifies" },
  ouClaFrom: { source: "OrganizationalUnitClassified", target: "OrganizationalUnitCatalogue", name: "from catalogue", iname: "classifies" },
  userCitClassifiedAs: { source: "UserGroupCitation", target: "UserGroupClassified", name: "classified as", iname: "classifies" },
  userClaFrom: { source: "UserGroupClassified", target: "UserGroupCatalogue", name: "from catalogue", iname: "contains" },
  supportsFunction: { source: "FeatureCitation", target: "EnterpriseFunctionCitation", name: "supports function citation", iname: "is supported by" },
  supportsFunctionClassified: { source: "FeatureClassified", target: "EnterpriseFunctionClassified", name: "supports classified function", iname: "is supported by" },
  studyMethod: { source: "Study", target: "StudyMethod", name: "study method", iname: "is study method of" },
  //"": {source: "ApplicationSystemTypeCitation", target: "EnterpriseFunctionCitation", name: "supports",, iname: ""}, // in dia 22.05 but not in ontology
  interoperability: { source: "SoftwareProduct", target: "Interoperability", name: "interoperability", iname: "is interoperability of" },
  firstAuthor: { source: "Study", target: "FirstAuthor", name: "first author", iname: "is first author of" },
  databaseManagementSystem: { source: "SoftwareProduct", target: "DatabaseManagementSystem", name: "uses DBMS", iname: "is used by" },
  certification: { source: "SoftwareProduct", target: "Certification", name: "certified by", iname: "certifies" },
  language: { source: "SoftwareProduct", target: "Language", name: "available in", iname: "is language of" },
  homepage: { source: "SoftwareProduct", target: "Homepage", name: "has homepage", iname: "is homepage of" },
  repository: { source: "SoftwareProduct", target: "Repository", name: "has repository", iname: "is repository of" },
  license: { source: "SoftwareProduct", target: "License", name: "uses license", iname: "governs the use of" },
  client: { source: "SoftwareProduct", target: "Client", name: "available for", iname: "can use" },
  operatingSystem: { source: "SoftwareProduct", target: "OperatingSystem", name: "available for", iname: "runs" },
  programmingLanguage: { source: "SoftwareProduct", target: "ProgrammingLanguage", name: "written in", iname: "is programming language of" }, // external DBpedia class
  programmingLibrary: { source: "SoftwareProduct", target: "ProgrammingLibrary", name: "uses library", iname: "is integrated into" },
  pmid: { source: "Study", target: "Pmid", name: "has PMID", iname: "is PMID of" },
  publishedInYear: { source: "Study", target: "PublishedInYear", name: "published in year", iname: "year of publication of" },
  publishedInJournal: { source: "Study", target: "Journal", name: "published in journal", iname: "published" },
};
