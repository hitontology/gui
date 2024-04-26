function loadXML(filename) {
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", filename, false);
  xhttp.send("");
  return xhttp.responseXML;
}

export function preprocessing() {
  svg = loadXML("/img/diagram.svg");
  xsl = loadXML("/scripts/preprocessing.xsl");
  xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  document = xsltProcessor.transformToDocument(xml, document);
  writeToFile(document);
}

function writeToFile(document) {
  const fs = require("node:fs");

  fs.writeFile("/img/diagram.svg", document, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });
}
