# Use a SPARQL query on the HITO endpoint to create JSON that can be fed into a JavaScript search engine.
# Queries all classifieds.

import urllib.parse
import requests
import json

sparql_query = """
PREFIX hito: <http://hitontology.eu/ontology/>
SELECT DISTINCT ?s (GROUP_CONCAT(STR(?sl); SEPARATOR="|") AS ?sls) (GROUP_CONCAT(STR(?comment); SEPARATOR="|") AS ?comments)
FROM <http://hitontology.eu/ontology>
{
 ?s a [rdfs:subClassOf hito:Classified].
 ?s rdfs:label ?sl.
 OPTIONAL {?s rdfs:comment ?comment.}
}
GROUP BY ?s
"""

encoded_query = urllib.parse.quote(sparql_query)
endpoint = "https://www.hitontology.eu/sparql"
base_url = endpoint + "?default-graph-uri=http%3A%2F%2Fwww.snik.eu%2Fontology&format=text%2Ftab-separated-values&query="
full_url = base_url + encoded_query

response = requests.get(full_url)
output = response.text

lines = output.strip().split("\n")
for line in lines:
    parts = line.split("\t")
    if len(parts) == 3:
        subject, labelstr, commentstr = [part.strip('"').strip() for part in parts]
        labels = labelstr.split("|")
        comments = commentstr.split("|")
        #transformed_line = f"{subject} {labels} {comments}"
        transformed_line = f"{subject} {labels}"
        print(transformed_line)
