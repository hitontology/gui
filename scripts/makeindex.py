# Use a SPARQL query on the HITO endpoint to create JSON that can be fed into a JavaScript search engine.
# Queries all classifieds.

import urllib.parse
import requests
import json

sparql_query = """
PREFIX hito: <http://hitontology.eu/ontology/>
SELECT DISTINCT ?s SAMPLE(?type)
(GROUP_CONCAT(DISTINCT STR(?sl); SEPARATOR="|") AS ?sls)
(GROUP_CONCAT(DISTINCT STR(?cl); SEPARATOR="|") AS ?cls)
(GROUP_CONCAT(DISTINCT STR(?comment); SEPARATOR="|") AS ?comments)
FROM <http://hitontology.eu/ontology>
{
 ?s a ?type.
 ?type rdfs:subClassOf hito:Classified.
 ?s rdfs:label|skos:altLabel ?sl.
 OPTIONAL {?p rdfs:subPropertyOf hito:classified. ?cit ?p ?s. ?cit rdfs:label|skos:altLabel ?cl.}  
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
entries = []

# first line is table header
lines = output.strip().split("\n")[1:]
for line in lines:
    parts = line.split("\t")
    if len(parts) == 5:
        subject, type, labelstr, citationstr, commentstr  = [part.strip('"').strip() for part in parts]
        # split converts "" to [""]
        labels = labelstr.split("|") if labelstr else []
        citations = citationstr.split("|") if citationstr else []
        comments = commentstr.split("|") if commentstr else []
        #transformed_line = f"{subject} {labels}"
        #print(transformed_line)
        entries.append({"s": subject, "t": type, "l": labels, 'cit': citations})# , "com": comments})

filename = "index.json"
with open(filename, 'w') as file:
    file.write(json.dumps(entries).replace("]}, {","]},\n{"))
print(f"{len(entries)} results written to {filename}")
