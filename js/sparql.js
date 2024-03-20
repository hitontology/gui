const HITO = {
  //GRAPH: "",
  PREFIX: "http://hitontology.eu/ontology/",
  ENDPOINT: "https://hitontology.eu/sparql",
  //ENDPOINT: "http://127.0.0.1:8102/sparql", // local HITO Docker Compose for faster preprocessing
};

/** Query public HITO SPARQL endpoint with a SELECT query.
@param query - A valid SPARQL query.
@returns A promise of a set of SPARQL select result bindings.
*/
export async function select(query) {
  const browser = typeof window !== "undefined";
  let url = HITO.ENDPOINT + "?query=" + encodeURIComponent(query) + "&format=json";
  /*if (graph) {
    url += "&default-graph-uri=" + encodeURIComponent(graph);
  }*/
  try {
    const response = await fetch(url);
    const json = await response.json();
    const bindings = json["results"].bindings;

    if (browser) {
      console.groupCollapsed("SPARQL " + query.split("\n", 1)[0] + "...");
    }
    //is never entered on our data with limitation to 99
    if (browser && bindings.length < 100) {
      console.table(
        bindings.map((b) =>
          Object.keys(b).reduce((result, key) => {
            result[key] = b[key].value;
            return result;
          }, {})
        )
      );
    }
    console.debug(query);
    console.debug(url);
    if (browser) {
      console.groupEnd();
    }

    return bindings;
  } catch (err) {
    console.error(err);
    console.error(`Error executing SPARQL query:\n${query}\nURL: ${url}\n\n`);
    return [];
  }
}
