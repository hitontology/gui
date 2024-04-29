import fs from "fs/promises";
import { Xslt, XmlParser } from "xslt-processor";
const parser = new XmlParser();
const xslt = new Xslt();

async function loadXML(filename) {
  const text = await fs.readFile(filename, "utf8");
  return parser.xmlParse(text, "text/xml");
}

async function main() {
  console.log("Downloading image...");
  const input = parser.xmlParse(await (await fetch("https://hitontology.eu/public/2024-03-hito_diagram.svg")).text());
  console.log("Transforming image...");
  const xsl = await loadXML("node/preprocess.xsl");
  const output = xslt.xsltProcess(input, xsl);
  await fs.writeFile("/tmp/test.svg", output);
}

main();
