const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sql = require("./sql");

// Express Configuration

const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes

var r010;
var r050;
var r100;
var r200;
var r500;
var r1000;
var c010;
var c100;
var n2000x1;
var n2000x2;

app.get("/", async function (req, res) {
  var currentStatus = await sql.getStocks();
  currentStatus.forEach((denom) => {
    switch (true) {
      case denom.denomination === 118:
        r010 = denom.numberOfItems;
        break;
      case denom.denomination === 119:
        r050 = denom.numberOfItems;
        break;
      case denom.denomination === 120:
        r100 = denom.numberOfItems;
        break;
      case denom.denomination === 121:
        r200 = denom.numberOfItems;
        break;
      case denom.denomination === 122:
        r500 = denom.numberOfItems;
        break;
      case denom.denomination === 123:
        r1000 = denom.numberOfItems;
        break;
      case denom.denomination === 128:
        c010 = denom.numberOfItems;
        break;
      case denom.denomination === 130:
        c100 = denom.numberOfItems;
        break;
      case denom.denomination === 124 && denom.device === 120:
        n2000x1 = denom.numberOfItems;
        break;
      case denom.denomination === 124 && denom.device === 121:
        n2000x2 = denom.numberOfItems;
        break;
      default:
        break;
    }
  });
  res.render("home", {
    r010: r010,
    r050: r050,
    r100: r100,
    r200: r200,
    r500: r500,
    r1000: r1000,
    c010: c010,
    c100: c100,
    n2000x1: n2000x1,
    n2000x2: n2000x2,
  });
});

app.post("/update", async function (req, res) {
  await sql.updateStocks(
    req.body.r010,
    req.body.r050,
    req.body.r100,
    req.body.r200,
    req.body.r500,
    req.body.r1000,
    req.body.c010,
    req.body.c100,
    req.body.n2000x1,
    req.body.n2000x2
  );
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
