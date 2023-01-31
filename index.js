const express = require("express");
const { MongoClient } = require("mongodb");
const eta = require("eta");
const axios = require("axios").default;

const url =
  "mongodb://azureproject1:j2nlropiNqSB9549UD3Q3rByYPx3CPffuQ9IEN1y5kurXD9Eqnu6P7Nej69Mabge2XuwK4rOT8rvACDbYDFzvw==@azureproject1.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@azureproject1@";
const client = new MongoClient(url);
const app = express();

const port = process.env.PORT || 3000;
const dbName = "OskarN";

app.use(express.urlencoded({ extended: false }));
app.engine("eta", eta.renderFile);
eta.configure({ views: "./views", cache: true });
app.set("views", "./views");
app.set("view cache", true);
app.set("view engine", "eta");

app.get("/", async (req, res) => {
  const response = await axios.get("https://api.quotable.io/random");
  const db = client.db(dbName);
  const collection = db.collection("todos");
  const todos = await collection.find({}).toArray();
  console.log(response.data.quote);
  res.render("index", {
    quote: response.data.content,
    todos: todos,
  });
});

app.post("/add", async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("todos");
  const todo = req.body;
  await collection.insertOne(todo);
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server started on port: " + port);
});

(async () => {
  await client.connect();
})();
