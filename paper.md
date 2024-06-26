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

Title: Visualizing Paths for Exploratory Search in the Health IT Ontology

# Introduction
Information systems in hospitals typically consist of hundreds of connected application systems, which are installations of different software products.
Due to a lack of systematization and unbiased information, finding the optimal combination of software products for a particular use case is a challenging endeavour.
The [Health IT Ontology (HITO)](https://hitontology.eu/) allows a precise description and comparation of application systems and software products in health IT
and also includes a knowledge base of exemplary individual products.
TODO: cite Jahn 2023
In order to appropriately separate existing terminologies and common synonyms, several terms categories are divided into catalogues, classified catalogue entries and citations, such as from a product website.
These categories are: application system types, enterprise functions, features, roles, organizational units and study outcome criteria.

Due to the complex nature of a health information system (e.g. the Uniklinikum Leipzig has inserthowmany components and insert source for that), typical information needs of users are also complex, such as "Which authors wrote studies concerning a given enterprise function?"
HITO provides access over several common interfaces: an RDF browser, a SPARQL endpoint for formal queries and faceted search.
However of those options, only SPARQL queries have the necessary expressivity to satisfy the complex information but typical users don't have expertise in the formal RDF query language of SPARQL.

Our goal is to visualize the paths two given classes in HITO are connected and to allow faceted search on a path, showing the individuals along the way and letting users filter them.

- insert hito diagram here -

# Methods

-insert initial mockup here? -

## OWL and RDF

HITO is an OWL domain specific ontology and RDF knowledge graph.
The ontology, as shown in figure ... consists of classes and object properties (relations) between them, where classes represent sets of instances (also called individuals).
Formally, each of our object properties has a domain, respectively range, one of our classes.
According to the principles of the resource description framework (RDF), each class, property and individual possesses a uniform resource identifier (URI), which is abbreviated with a prefix-suffix notation.
An RDF knowledge graph consists of a set of statments of the shape (subject, predicate, object).
For example, the relation <https://hitontology.eu/ontology/evaluatesProduct> is abbreviated to hito:evaluatesProduct or just ":evaluatesProduct" (empty prefix).
:evaluatesProduct has the domain :SoftwareProduct and range :Study.
This means that each triple (statement) that includes :evaluatesProduct in the predicate position has to have an instance of :SoftwareProduct in subject and :Study in object position.
Answers to simple information needs, such as those occuring in standard faceted search, are often represented by single triples.
For example the (positive) answer to "Does GNU Health support HL7 FHIR" is encoded in the triple (:GnuHealth, :interoperability, :HL7_FHIR).

## Graph

A set of RDF triples forms a labelled graph and is thus also called a knowledge graph.
This means that we can use standard graph theory path finding to find complex relationships between resources.
While the RDF graph is directed, the edge direction is sometimes arbitrary (e.g. "uses" vs "used by") so edges are traversed in both directions, treating the graph as undirected for the purpose of path finding here.
While this has been done before for knowledge graphs (cite RelFinder), our approach uses path finding on the ontology level and combines this both with the
individuals of the classes along the chosen path as well as faceted search filters to limit the search space.

![early mockup](https://user-images.githubusercontent.com/43496783/122712136-b8442100-d263-11eb-9e2a-c3414e17db92.png)

Example: Which authors have dealt with a specific EnterpriseFunctionClassified?

- Click on Search Class for Search Input: e.g., EnterpriseFunctionClassified
- Click on Result Class for Results: e.g., FirstAuthor
- Automatically: All paths between Search Class and Result Class, where each class is touched at most once, are calculated and displayed in the meta-model image. Paths are referred to as "search paths." For example, the following search paths would be found:
  - EnterpriseFunctionClassified - EnterpriseFunctionCitation - SoftwareProduct - Feature Classified - FeatureCitation - Study - FirstAuthor
  - EnterpriseFunctionClassified - EnterpriseFunctionCitation - FeatureCitation - Study - FirstAuthor
- Click: Mark a class that must be included (or not) in the search path, e.g., FeatureCitation must be included.
- Automatically: Only the search paths that include/not include the chosen class remain, e.g.,
  - EnterpriseFunctionClassified - EnterpriseFunctionCitation - SoftwareProduct - Feature Classified - FeatureCitation - Study - FirstAuthor
  - EnterpriseFunctionClassified - EnterpriseFunctionCitation - FeatureCitation - Study - FirstAuthor
- Click: Mark a class that must be included (or not) in the search path, e.g., SoftwareProduct should not be included.
- Automatically: Only the search paths that include/not include the chosen class remain, e.g.,
  - EnterpriseFunctionClassified - EnterpriseFunctionCitation - FeatureCitation - Study - FirstAuthor
  - ...
- If only search paths remain that differ only by their edges (because there are multiple edges between two classes), then desired or undesired edges must be clicked or unclicked.
- If only one search path remains, then a table is generated with the names of the classes of the search path and the names of the connecting edge as column headers, e.g.,

  - EnterpriseFunctionClassified

    < functionCitation < EnterpriseFunctionCitation

    > supports > FeatureCitation
    > <evaluate feature < Study
    > firstAuthor > FirstAuthor

- A search string can now be entered for the first column. In the first column, all instances of the corresponding class containing the search string are listed. In column n (n=2,...,LastColumn), all instances of the corresponding class are listed that are related to an entry from column n-1 via the specified edge.

## 

# Results

- insert screenshot of the HITO GUI here

The algorithm described above is implemented in a a web application that is freely available at <https://hitontology.github.io/gui> licensed under the open source MIT license.
We experimented with automatic graph layouting algorithms but the result was visually confusing.
Thus, we use the manually generated HITO ontology diagram that is maximized for visual clarity.
UpperCamelCase suffixes are replaced with title case plural labels for easier consumption by readers not experienced in RDF/OWL, such as "ProgrammingLanguage" -> "Programming Languages".
Also, the Catalogue-Classified-Citation structure is explained in-diagram with named groups and entries called "terminologies", "terminology entries" and
"folks' terms".

Due to the high potential time complexity of SPARQL 1.1 property path queries, which could lead to long waiting times or even crashes (TODO: cite beyond the yottabyte),
HITO is transformed into a graph structure of the Cytoscape.js JavaScript library, which performs the path calculations.
TODO: insert numbers for X and Y:
Between the X classes, there are Y potential (cycle-free) paths, however most of them are empty (the join along the path does not contain any results).
TODO: insert numbers for Y and Z:
Thus, we execute the Y/2 SPARQL queries in preprocessing (accounting for inverse paths), assign hash values to paths and save the Z path hashes with at least one result.
When a user selects a source and target class, the nonempty paths are shown and can be selected.
[Earlier](https://github.com/snikproject/ciono) experiments with similar approaches in the [SNIK](https://www.snik.eu/) project using shortest paths or automatically determining _interesting_ paths did not yield satisfying results as it depends on the information need, so all non-cyclic paths are given to the user to select a single one.
On selection, a SPARQL query is generated that joins all classes along the given path and displays them in a results table, which can then be further filtered,
for example by a specific feature or enterprise function.
TODO: running example?


# Discussion


In contrast to keyword search and question answering, where users enter a query into a text field...
Alternative approaches: question answering

# Conclusions

This approach can be adapted to other domains where users with complex information needs interact with ontologies and knowledge graphs.
The adaptation requires manual effort as automatic graph layouting did not yield usable results in our experience and user facing labels differ from technical
terms.
However this could be implemented or supported by generative AI in the future.

# Acknowledgements

# References
