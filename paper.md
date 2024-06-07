---
title: 'Visualizing Paths for Exploratory Search in the Health IT Ontology'
tags:
  - Semantic Web
  - faceted search
  - JavaScript
authors:
  - name: Konrad Höffner
    orcid: 0000-0001-7358-3217
    corresponding: true
    affiliation: 1
  - name: Hannes Raphael Brunsch
    orcid: https://orcid.org/0009-0004-5081-9820
    affiliation: 1
  - name: Alfred Winter
    orcid: 0000-0003-0179-954X
    affiliation: "1"
affiliations:
 - name: Institute for Medical Informatics, Statistics and Epidemiology, Medical Faculty, Leipzig University, Germany
   index: 1
date: 31 May 2024
bibliography: paper.bib
---

# Summary


![HITOM](img/hitogui.pdf)

HITOM is a web application designed to interactively explore complex relationships between different classes in the Health IT Ontology (HITO) and their instances.




The [master's thesis of Andreea Somesan](https://hitontology.eu/public/studenttheses/Masterarbeit_Andreea_Somesan.pdf) presents mockups and wireframes for improving the user interface for the existing HITO faceted search,
but we ultimately aim to explore a more expressive and intuitive search approaches to satisfy more complex information needs, such as which authors wrote studies concerning a given enterprise function.
In contrast to keyword search and question answering, where users enter a query into a text field, our goal is to visualize the paths two given classes in HITO are connected and to allow faceted search on a path, showing the individuals along the way and letting users filter them.
[Earlier](https://github.com/snikproject/ciono) experiments with similar approaches in the [SNIK](https://www.snik.eu/) project using shortest paths or automatically determining _interesting_ paths did not yield satisfying results, so all non-cyclic paths are given to the user to select a single one.
While the RDF graph is directed, the edge direction is sometimes arbitrary (e.g. "uses" vs "used by") so edges are traversed in both directions, treating the graph as undirected for the purpose of path finding.

Andreea Somesan ... analyzing the user experience. @andreeama

# Statement of need
Information systems in hospitals typically consist of hundreds of connected application systems, which are installations of different software products.
Due to a lack of systematization and unbiased information, finding the optimal combination of software products for a particular use case is a challenging endeavour.
The [Health IT Ontology (HITO)](https://hitontology.eu/) allows a precise description and comparation of application systems and software products in health IT, but satisfying the information need of typical users is difficult because they don't have expertise in formal RDF query languages like SPARQL.

describe software products and application systems in health environments and studies describing them.
Properties of software products, such as features, enterprise functions and 
However typical information for HITO are not covered by existing exploration and search methods.



The HITO project offers an [RickView RDF browser](https://hitontology.eu/ontology/), a [SPARQL endpoint](https://hitontology.eu/sparql/) and faceted search for [studies](https://hitontology.eu/search/) and [software](https://hitontology.eu/search/softwareproduct.html), but none of those 
but we weren't satisified with the search and exploration user experience.



# Acknowledgements

# References
