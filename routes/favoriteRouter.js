const express = require("express");
const Favorite = require("../models/favorite");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const cors = require("./cors");
const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    bodyParser.json(),
    (req, res, next) => {
      Favorite.findOne(
        { user: req.user._id },
        function (err, favoriteDocument) {
          if (err) {
            console.log(err);
          }
          if (!favoriteDocument) {
            //create a new one
            const campsites = req.body;
            const user = req.user._id;
            const favorites = { user, campsites };

            Favorite.create(favorites)
              .then((favorite) => {
                console.log("Favorite Created ", favorite);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
          } else {
            //find ones that don't already exist and add to the back (push)
            console.log("existing favorites: ", favoriteDocument);
            const newFavorites = req.body;
            newFavorites.forEach((newCampsite) => {
              console.log("new campsite: ", newCampsite._id);
              console.log(
                "favoriteDocument.campsites: ",
                favoriteDocument.campsites
              );

              if (!favoriteDocument.campsites.includes(newCampsite._id)) {
                //push to favoriteDocument
                favoriteDocument.campsites.push(newCampsite);
              }
            });
            favoriteDocument
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
          }
        }
      ); //findOne
    }
  )
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(`POST operation not supported on /favorites`);
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findOneAndDelete({ user: req.user._id })
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `GET operation not supported on /favorites/${req.params.campsiteId}`
      );
    }
  )
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on /favorites/${req.params.campsiteId}`
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    bodyParser.json(),
    (req, res, next) => {
      Favorite.findOne(
        { user: req.user._id },
        function (err, favoriteDocument) {
          if (err) {
            console.log(err);
          }
          if (!favoriteDocument) {
            //create a new one
            const campsites = [{ _id: req.params.campsiteId }];
            const user = req.user._id;
            const favorites = { user, campsites };

            Favorite.create(favorites)
              .then((favorite) => {
                console.log("Favorite Created ", favorite);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
          } else {
            //if doesn't already exist then add to the back (push)
            if (!favoriteDocument.campsites.includes(req.params.campsiteId)) {
              favoriteDocument.campsites.push({ _id: req.params.campsiteId });
            }
            favoriteDocument
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favoriteDocument);
              })
              .catch((err) => next(err));
          }
        }
      );
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findOne(
        { user: req.user._id },
        function (err, favoriteDocument) {
          if (err) {
            console.log(err);
          }
          if (!favoriteDocument) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("there are no favorites to delete");
          } else {
            //if exists then remove
            favoriteDocument.campsites.splice(
              favoriteDocument.campsites.indexOf(req.params.campsiteId),
              1
            );
            favoriteDocument
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favoriteDocument);
              })
              .catch((err) => next(err));
          }
        }
      );
    }
  );

module.exports = favoriteRouter;
