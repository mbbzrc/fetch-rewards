const express = require("express");
const server = express();

// install cors

const morgan = require("morgan");
server.use(morgan("dev"));

server.use(express.json());

server.use("/api", require("./routes"));

const { client } = require("./db/client");

server.use((error, req, res, next) => {
  res.status(500).send(error);
  // build out error logging
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}.`);

  try {
    client.connect();
    console.log("Database is connected.");
  } catch (error) {
    console.error("Database unable to load!\n", error);
  }
});
