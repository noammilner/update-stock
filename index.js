const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sql = require("./sql");
const users = require("./users.js");
const fs = require("fs");

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
var activeUser;

// Routes

app.get("/", function (req, res) {
  res.render("login", { message: "" });
});

app.get("/success", function (req, res) {
  res.render("ending");
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
  console.log(
    activeUser +
      " has successfully updated the stock table! " +
      new Date().toLocaleString()
  );
  let changes = {
    r010: req.body.r010,
    r050: req.body.r050,
    r100: req.body.r100,
    r200: req.body.r200,
    r500: req.body.r500,
    r1000: req.body.r1000,
    c010: req.body.c010,
    c100: req.body.c100,
    n2000x1: req.body.n2000x1,
    n2000x2: req.body.n2000x2,
  };
  console.log("New stock status is- " + JSON.stringify(changes));
  res.redirect("/success");
});

app.post("/login", async function (req, res) {
  let { username, password } = req.body;
  let permittedUsers = users.permittedUsers;
  let authenticated = false;

  permittedUsers.forEach(async function (user) {
    if (
      username.toLowerCase() === user.username &&
      password === user.password
    ) {
      authenticated = true;
      console.log(
        username +
          " has successfuly authenticated! " +
          new Date().toLocaleString()
      );
      await getData();
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
      activeUser = username;
      return;
    }
  });

  if (!authenticated) {
    res.render("login", { message: "Wrong username or password!" });
    console.log("Failed login attempt " + new Date().toLocaleString());
  }
});

async function getData() {
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
}

// Logger

const logFile = fs.createWriteStream("system_logs.txt", { flags: "a" });

console.log = function (output) {
  logFile.write(`${output}\n`);
  process.stdout.write(`${output}\n`);
};

app.listen(3030, function () {
  console.log("Server started on port 3030 on " + new Date().toLocaleString());
});
