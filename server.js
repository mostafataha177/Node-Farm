const fs = require("fs");
const http = require("http");
const { json } = require("stream/consumers");
const url = require("url");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const card = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productTem = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const dataobj = JSON.parse(data);
function replaceTemplate(tem, data) {
  let outputtem = tem.replace(/{%image%}/g, data.image);
  outputtem = outputtem.replace(/{%productName%}/g, data.productName);
  outputtem = outputtem.replace(/{%quantity%}/g, data.quantity);
  outputtem = outputtem.replace(/{%price%}/g, data.price);
  outputtem = outputtem.replace(/{%id%}/g, data.id);
  outputtem = outputtem.replace(/{%description%}/g, data.description);
  if (!data.organic)
    outputtem = outputtem.replace(/{%organic%}/g, "not-organic");
  return outputtem;
}

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url);
  if (req.method == "GET") {
    if (pathname == "/" || pathname == "/overview") {
      res.writeHead(200, { "content-type": "text/html" });
      let cardshtml = dataobj.map((el) => replaceTemplate(card, el)).join("");
      const newCards = tempOverview.replace("{%cards%}", cardshtml);
      res.end(newCards);
    } else if (pathname == "/api") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(data);
    } else if (pathname == `/product`) {
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      console.log("i", query.split(":"));
      const productDetial = replaceTemplate(
        productTem,
        dataobj[query.split(":")[1]]
      );
      res.end(productDetial);
    } else {
      res.end("not found");
    }
  }
});

server.listen(7001, () => {
  console.log("listening");
});
