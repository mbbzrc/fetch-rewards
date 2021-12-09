const apiRouter = require("express").Router();

apiRouter.get("/health", (req, res, next) => {
  res.send("Healthy!");
});

module.exports = apiRouter;
