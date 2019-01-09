const postDb = require("./../data/helpers/postDb");
const tagDb = require("./../data/helpers/tagDb");
const userDb = require("./../data/helpers/userDb");

const express = require("express");
const server = express();

const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

server.use(express.json());
server.use(morgan("short"));
server.use(helmet());
server.use(cors());

// ** Custom Middleware **


// ** USERS **

server.get("/api/users", (req, res) => {
  userDb
    .get()
    .then(users => res.status(200).json(users))
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

server.get("/api/users/:id", (req, res) => {
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

server.post("/api/users", (req, res) => {
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

server.delete("/api/users/:id", (req, res) => {
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

server.put("/api/users/:id", (req, res) => {
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

// ** POSTS **

module.exports = server;
