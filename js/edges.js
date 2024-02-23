export const edges = {
  spIsOfAstCit: { source: "SoftwareProduct", target: "ApplicationSystemTypeCitation", name: "is of" },
  spSupportsEfCit: { source: "SoftwareProduct", target: "EnterpriseFunctionCitation", name: "supports" },
  spOffersFCit: { source: "SoftwareProduct", target: "FeatureCitation", name: "offers" },
  spUsedInOuCit: { source: "SoftwareProduct", target: "OrganizationalUnitCitation", name: "used in" },
  spUsedByUserCit: { source: "SoftwareProduct", target: "UserGroupCitation", name: "used by" },
  evaluatesProduct: { source: "Study", target: "SoftwareProduct", name: "evaluates" },
  efCitClassifiedAs: { source: "EnterpriseFunctionCitation", target: "EnterpriseFunctionClassified", name: "classified as" },
  //"supportedByFeatureCitation": {source: "EnterpriseFunctionCitation", target: "FeatureCitation", name: "supported by feature citation", }, // overlap in display
  astCitClassifiedAs: { source: "ApplicationSystemTypeCitation", target: "ApplicationSystemTypeClassified", name: "classified as" },
  fCitClassifiedAs: { source: "FeatureCitation", target: "FeatureClassified", name: "classified as" },
  supportsFunction: { source: "FeatureCitation", target: "EnterpriseFunctionCitation", name: "supports function citation" },
  supportsFunctionClassified: { source: "FeatureClassified", target: "EnterpriseFunctionClassified", name: "supports classified function" },
  ouCitClassifiedAs: { source: "OrganizationalUnitCitation", target: "OrganizationalUnitClassified", name: "classified as" },
  userCitClassifiedAs: { source: "UserGroupCitation", target: "UserGroupClassified", name: "classified as" },
  //"": {source: "ApplicationSystemTypeCitation", target: "EnterpriseFunctionCitation", name: "supports", }, // in dia 22.05 but not in ontology
  astClaSupportsEfCla: { source: "ApplicationSystemTypeClassified", target: "EnterpriseFunctionClassified", name: "supports" },
  interoperability: { source: "SoftwareProduct", target: "Interoperability", name: "interoperability" },
  firstAuthor: { source: "Study", target: "FirstAuthor", name: "first author" },
};
