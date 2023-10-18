const express = require("express");
const promotionRouter = express.Router();

promotionRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    console.log("router GET");
    res.end("Will send all the promotions to you");
  })
  .post((req, res) => {
    res.end(
      `Will add the promotion: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res) => {
    res.end("Deleting all promotions");
  });

promotionRouter
  .route("/:promotionId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(
      `Will send the promotion with the given id: ${req.params.promotionId}`
    );
  })
  .post((req, res) => {
    res.end(
      `Will add the promotion: ${req.body.name} with description: ${req.body.description} and the given id: ${req.params.promotionId}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(
      `Will update the promotion: ${req.body.name} with description: ${req.body.description} and the given id: ${req.params.promotionId}`
    );
  })
  .delete((req, res) => {
    res.end(
      `Deleting the promotion with the given id: ${req.params.promotionId}`
    );
  });

module.exports = promotionRouter;
