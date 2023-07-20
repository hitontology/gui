function search(query) {
  document.getElementById("query").innerText = `${query}`;
  document.getElementById("primaryname").innerText = "Laborinformationssystem";
  document.getElementById("synonyms").innerText = "Laboratory Information System, Laborsystem, Labormanagement-System";
  document.getElementById("definition").innerText =
    "Das LIS unterstützt alle Schritte der Laboruntersuchung: die Verwaltung von Aufträgen und Proben, die Verteilung der Proben auf die vorhandenen Analysegeräte, das Abrufen und Validieren der Ergebnisse und die abschließende Übermittlung der Ergebnisse an den Auftraggeber. Dadurch wird der nahezu vollautomatische Laborbetrieb ermöglicht, welcher die hohen Durchsatzraten in modernen medizinischen Laborinstituten erlaubt. Analysegeräte können direkt an das Informationssystem angeschlossen werden, um die Werte direkt in das System zu übernehmen.";
}
