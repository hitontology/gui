---
title: 'Visualizing Paths for Exploratory Search in Health IT Ontologies'
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

The [Health IT Ontology (HITO)](https://hitontology.eu/) is used to describe software products and application systems in health environments and studies describing them.
The [master's thesis of Andreea Somesan](https://hitontology.eu/public/studenttheses/Masterarbeit_Andreea_Somesan.pdf) presents mockups and wireframes for improving the user interface for the existing HITO faceted search,
but we ultimately aim to explore a more expressive and intuitive search approaches to satisfy more complex information needs, such as which authors wrote studies concerning a given enterprise function.
In contrast to keyword search and question answering, where users enter a query into a text field, our goal is to visualize the paths two given classes in HITO are connected and to allow faceted search on a path, showing the individuals along the way and letting users filter them.
[Earlier](https://github.com/snikproject/ciono) experiments with similar approaches in the [SNIK](https://www.snik.eu/) project using shortest paths or automatically determining _interesting_ paths did not yield satisfying results, so all non-cyclic paths are given to the user to select a single one.
While the RDF graph is directed, the edge direction is sometimes arbitrary (e.g. "uses" vs "used by") so edges are traversed in both directions, treating the graph as undirected for the purpose of path finding.

Andreea Somesan ... analyzing the user experience. @andreeama

# Statement of need
HITO offers an [RickView RDF browser](https://hitontology.eu/ontology/), a [SPARQL endpoint](https://hitontology.eu/sparql/) and faceted search for [studies](https://hitontology.eu/search/) and [software](https://hitontology.eu/search/softwareproduct.html),
but we weren't satisified with the search and exploration user experience.

While initial enthusiasm in the Semantic Web field has led to a large amount of published knowledge bases, mainstream adoption has stagnated due to a lack of freely available performant, accessible, robust and adaptable tools [@semanticwebreview]. 
Instead, limited duration research grants motivate the proliferation of countless research prototypes, which are not optimized for any of those criteria, are not maintained after the project ends and compete for resources on crowded servers if they do not break down completely.
While there are are several existing RDF browsers, they are not optimized for performance.


# Acknowledgements

# References
