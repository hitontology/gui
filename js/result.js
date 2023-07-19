function search(query) {
  document.getElementById("query").innerText = `${query}`;
}

function result(title, text, link) {
  return `<div class="result">
          <h3>${title}</h3>
          ${text}
          <a href="${link}">More Info</a>
        </div>`;
}

function results() {
  const container = document.getElementById("results");
  for (let i = 1; i <= 10; i++) {
    let html = result("Commercial RIS " + i, "Commercial Radiology Information System (RIS) Dummy " + i, "details.html?swp=Commercial RIS " + i);
    let fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
  document.getElementById("primaryname").innerText = "Laborinformationssystem";
  document.getElementById("synonyms").innerText = "Laboratory Information System, Laborsystem, Labormanagement-System";
  document.getElementById("definition").innerText =
    "Das LIS unterstützt alle Schritte der Laboruntersuchung: die Verwaltung von Aufträgen und Proben, die Verteilung der Proben auf die vorhandenen Analysegeräte, das Abrufen und Validieren der Ergebnisse und die abschließende Übermittlung der Ergebnisse an den Auftraggeber. Dadurch wird der nahezu vollautomatische Laborbetrieb ermöglicht, welcher die hohen Durchsatzraten in modernen medizinischen Laborinstituten erlaubt. Analysegeräte können direkt an das Informationssystem angeschlossen werden, um die Werte direkt in das System zu übernehmen.";
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");
    search(query);
    results();
  },
  false
);
