export const style = [
  {
    selector: "edge[name]",
    style: {
      "curve-style": "straight",
      "target-arrow-shape": "triangle",
      width: "data(width)",
      content: "data(name)",
    },
  },
  {
    selector: "node[name]",
    style: { content: "data(name)" },
  },
  {
    selector: "node.source",
    css: { "background-color": "rgb(80,20,200)" },
  },
  {
    selector: "node.target",
    css: { "background-color": "rgb(0,140,200)" },
  },
  {
    selector: "node.isolated",
    css: { "background-color": "rgb(200,200,200)" },
  },
];
