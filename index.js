const { readFileSync } = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate.js");
const data = readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const overiew = readFileSync(`${__dirname}/templates/overview.html`, "utf-8");
const productTemp = readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const card = readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //Overview Page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const cards = dataObj.map((el) => replaceTemplate(card, el)).join("");
    const output = overiew.replace(/{%cards%}/g, cards);
    res.end(output);
    //Api Page
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
    //product Page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(productTemp, product);
    res.end(output);
    //Not Found Page
  } else {
    res.writeHead(404);
    res.end("Page Not Found !!!!");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log(`127.0.0.1:8000`);
});
