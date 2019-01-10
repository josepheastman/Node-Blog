const express = require('express');

const userDb = require('../data/helpers/userDb.js')
const capitalCheck = require('../common/capitalCheckMiddleware.js')

const router = express.Router();

router.get("/", (req, res) => {
    userDb
      .get()
      .then(users => res.status(200).json(users))
      .catch(err => {
        res
          .status(500)
          .json({ error: "The user information could not be retrieved." });
      });
  });
  
  router.get("/:id", (req, res) => {
    const id = req.params.id;
  
    userDb
      .get(id)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res
            .status(404)
            .json({ message: "The user with the specified ID does not exist." });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The user information could not be retrieved." });
      });
  });
  
  router.get("/posts/:userId", (req, res) => {
      const userId = req.params.userId;
  
      userDb
      .getUserPosts(userId)
      .then(userPost => {
          if (!userPost) {
              res
              .status(404)
              .json({ error: "This user does not have any posts." })
          } else {
              res.json(userPost)
          }
      })
      .catch(err => {
          res.status(500)
          .json({ error: "The users post information could not be retrieved. " })
      })
  })
  
  router.post("/", capitalCheck, (req, res) => {
    const userInfo = req.body;
  
    if (!userInfo) {
      return res
        .status(400)
        .json({ errorMessage: "Please provide name for the user." });
    }
    userDb.insert(userInfo).then(result => {
      userDb
        .get(result.id)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(err => {
          res.status(500).json({
            error: "There was an error while saving the user to the database."
          });
        });
    });
  });
  
  router.delete("/:id", (req, res) => {
    const id = req.params.id;
  
    userDb.remove(id).then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        userDb
          .remove(id)
          .then(count => {
            res.status(200).json(user);
          })
          .catch(err => {
            res.status(500).json({ error: "The user could not be removed." });
          });
      }
    });
  });
  
  router.put("/:id", capitalCheck, (req, res) => {
    const id = req.params.id;
    const changes = req.body;
  
    userDb.get(id).then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else if (!changes.name) {
        return res
          .status(400)
          .json({ errorMessage: "Please provide a name for the user." });
      } else {
        userDb
          .update(id, changes)
          .then(count => {
            res.status(200).json(user);
          })
          .catch(err =>
            res
              .status(500)
              .json({ error: "The user information could not be modified." })
          );
      }
    });
  });

module.exports = router