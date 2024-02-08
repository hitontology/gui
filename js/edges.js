export const edges = [
  { source: "SoftwareProduct", target: "ApplicationSystemTypeCitation", name: "is of", id: "spIsOfAstCit" },
  { source: "SoftwareProduct", target: "EnterpriseFunctionCitation", name: "supports", id: "spIsOfEfCit" },
  { source: "SoftwareProduct", target: "FeatureCitation", name: "offers", id: "spIsOfFCit" },
  { source: "SoftwareProduct", target: "OrganizationalUnitCitation", name: "used in", id: "spUsedInOuCit" },
  { source: "SoftwareProduct", target: "UserGroupCitation", name: "used by", id: "spUsedByUserCit" },
  { source: "Study", target: "SoftwareProduct", name: "evaluates", id: "evaluatesProduct" },
  { source: "EnterpriseFunctionCitation", target: "EnterpriseFunctionClassified", name: "classified as", id: "efCitClassifiedAs" },
  //{ source: "EnterpriseFunctionCitation", target: "FeatureCitation", name: "supported by feature citation", id: "supportedByFeatureCitation" }, // overlap in display
  { source: "ApplicationSystemTypeCitation", target: "ApplicationSystemTypeClassified", name: "classified as", id: "astCitClassifiedAs" },
  { source: "FeatureCitation", target: "FeatureClassified", name: "classified as", id: "fCitClassifiedAs" },
  { source: "FeatureCitation", target: "EnterpriseFunctionCitation", name: "supports function citation", id: "supportsFunction" },
  { source: "FeatureClassified", target: "EnterpriseFunctionClassified", name: "supports classified function", id: "supportsFunctionClassified" },
  { source: "OrganizationalUnitCitation", target: "OrganizationalUnitClassified", name: "classified as", id: "ouCitClassifiedAs" },
  { source: "UserGroupCitation", target: "UserGroupClassified", name: "classified as", id: "userCitClassifiedAs" },
  //{ source: "ApplicationSystemTypeCitation", target: "EnterpriseFunctionCitation", name: "supports", id: "" }, // in dia 22.05 but not in ontology
  { source: "ApplicationSystemTypeClassified", target: "EnterpriseFunctionClassified", name: "supports", id: "astClaSupportsEfCla" },
];
