# HITO GUI

New GUI for HITO with better user experience.
Under heavy development, prototype available at <https://hitontology.github.io/gui/>.

## Usage/Help/Summary

The new GUI automatically shows every available path between the source and target node
and then displays all instances which fulfill one path of the users' selection.
To select the source node, the primary mouse button is used.
To select the target node, the secondary mouse button is used.

## Local Development

`git clone` this repository, run the `scripts/diagram-prepare.sh` shell script, `npm install` and open `index.html` in a browser.
You need a webserver, for example locally with serve, `npm run dev` and then open <http://localhost:3000/>.
We recommend against `python -m http.server` because this will cache local files and can thus show you outdated versions.

    git clone git@github.com:hitontology/gui.git
    cd gui
    scripts/downloadimage
    npm install
    npm run dev

## Contribute

Pull requests are encouraged.
Please use [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) prefixes: fix, feat, build, chore, ci, docs, style, refactor, perf, test...
For example: `git commit -m "fix: useful commit message, resolves #123"`.
Format before committing: `npm run fmt` or `prettier -w .`.

## Background

![HITO ontology diagram v24.03](https://hitontology.eu/public/2024-03-hito_diagram.svg)

The [Health IT Ontology (HITO)](https://hitontology.eu/) is used to describe software products and application systems in health environments and studies describing them.
HITO offers an [RickView RDF browser](https://hitontology.eu/ontology/), a [SPARQL endpoint](https://hitontology.eu/sparql/) and faceted search for [studies](https://hitontology.eu/search/) and [software](https://hitontology.eu/search/softwareproduct.html),
but we weren't satisified with the search and exploration user experience.
The [master's thesis of Andreea Somesan](https://hitontology.eu/public/studenttheses/Masterarbeit_Andreea_Somesan.pdf) presents mockups and wireframes for improving the user interface for the existing HITO faceted search,
but we ultimately aim to explore a more expressive and intuitive search approaches to satisfy more complex information needs, such as which authors wrote studies concerning a given enterprise function.
In contrast to keyword search and question answering, where users enter a query into a text field, our goal is to visualize the paths two given classes in HITO are connected and to allow faceted search on a path, showing the individuals along the way and letting users filter them.
[Earlier](https://github.com/snikproject/ciono) experiments with similar approaches in the [SNIK](https://www.snik.eu/) project using shortest paths or automatically determining _interesting_ paths did not yield satisfying results, so all non-cyclic paths are given to the user to select a single one.
While the RDF graph is directed, the edge direction is sometimes arbitrary (e.g. "uses" vs "used by") so edges are traversed in both directions, treating the graph as undirected for the purpose of path finding.

### Algorithm Idea

![early mockup](https://user-images.githubusercontent.com/43496783/122712136-b8442100-d263-11eb-9e2a-c3414e17db92.png)

Pseudocode, automatically translated:
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

    <functionCitation <EnterpriseFunctionCitation

    > supports>FeatureCitation
    > <evaluate feature <Study
    > firstAuthor>FirstAuthor

- A search string can now be entered for the first column. In the first column, all instances of the corresponding class containing the search string are listed. In column n (n=2,...,LastColumn), all instances of the corresponding class are listed that are related to an entry from column n-1 via the specified edge.

## Technologies Used

- **JavaScript:** Vanilla JS with ES6 modules
- **Compatibility** latest versions of Firefox and Chrome (earlier probably work a long while back but aren't targeted or explicitly tested)
- **Testing:** Vitest for unit testing
- **Formatting:** Prettier
- **Linting** Oxlint
- **Dependencies:**
  Directly imported from CDNs for easy deployment to GitHub Pages (no build step needed)
  _ AG Grid (results table)
  _ svg.js (SVG manipulation)
  _ Cytoscape.js (graph functionality)
  _ Micromodal (for path selection, currently being replaced) \* notyf (pop-up notifications)
- **Build:** No bundling process involved
