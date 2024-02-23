function search(query) {
  document.getElementById("query").innerText = `${query}`;
  document.getElementById("primaryname").innerText = "Laborinformationssystem";
  document.getElementById("synonyms").innerText = "Laboratory Information System, Laborsystem, Labormanagement-System";
  document.getElementById("definition").innerText =
    "Das LIS unterstützt alle Schritte der Laboruntersuchung: die Verwaltung von Aufträgen und Proben, die Verteilung der Proben auf die vorhandenen Analysegeräte, das Abrufen und Validieren der Ergebnisse und die abschließende Übermittlung der Ergebnisse an den Auftraggeber. Dadurch wird der nahezu vollautomatische Laborbetrieb ermöglicht, welcher die hohen Durchsatzraten in modernen medizinischen Laborinstituten erlaubt. Analysegeräte können direkt an das Informationssystem angeschlossen werden, um die Werte direkt in das System zu übernehmen.";
}

let showSoftware = true;
let showStudy = true;

function software(title, text, link) {
  return `<div class="box">
          <img class="boximg" src="img/software.svg">
          <h3>${title}</h3>
          ${text}
          <a href="${link}">More Info</a>
        </div>`;
}

function study(title, text, link) {
  return `<div class="box">
          <img class="boximg" src="img/paper.svg">
          <h3>${title}</h3>
          ${text}
          <a href="${link}">More Info</a>
        </div>`;
}

function refresh() {
  const container = document.getElementById("classifieds");
  container.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    if (showSoftware) {
      let html = software("Software" + i, "this software can be used for the thing selected above" + i, "software.html?suffix=Senaite");
      let fragment = document.createRange().createContextualFragment(html);
      container.appendChild(fragment);
    }

    if (showStudy) {
      html = study("Study" + i, "this study writes about the thing selected above" + i, "catalogue.html?cat=BbApplicationSystemTypeCatalogue");
      fragment = document.createRange().createContextualFragment(html);
      container.appendChild(fragment);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => refresh(), false);
