const express = require('express');

const postDb = require("./../data/helpers/postDb.js");

const router = express.Router();

router.get('/', (req, res) => {
    postDb.get()
    .then(posts => res.status(200).json(posts))
    .catch(err => {
        res
        .status(500)
        .json({ error: "The posts information could not be retrieved." })
    }) 
})

router.get('/:id', (req, res) => {
    const id = req.params.id;

    postDb.get(id)
    .then(post => {
        if(post) {
            res.status(200).json(post);
        } else {
            res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res
        .status(500)
        .json({ error: "The post information could not be retrieved." })
    })
})

router.get('/tags/:id', (req, res) => {
    const id = req.params.id;

    postDb.getPostTags(id)
    .then(tags => {
        if (!tags) {
            res
            .status(404)
            .json({ error: "No tags found for this post." })
        } else {
            res.status(200).json(tags);
        }
    })
    .catch(err => {
        res
        .status(500)
        .json({ error: "The tag information could not be retrieved." })
    })
})

router.post('/', (req, res) => {
    const postInfo = req.body;

    if(!postInfo.userId || !postInfo.text) {
        return res
        .status(400)
        .json({ errorMessage: "Please provide title and contents for the post." })
    }

    postDb.insert(postInfo).then(result => {
        postDb.get(result.id)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            res
            .status(500)
            .json({ error: "There was an error while saving the post to the database." })
        })
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    postDb.get(id)
    .then(post => {
        if(!post) {
            res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." })
        } else {
            postDb.remove(id)
            .then(count => {
                res.status(200).json(post);
            })
            .catch(err => {
                res
                .status(500)
                .json({ error: "The post could not be removed." })
            })
        }
    })
})

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    postDb.get(id)
    .then(post => {
        if (!post) {
            res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." })
        } else if (!changes.userId || !changes.text) {
            res
            .status(400)
            .json({ errorMessage: "Please provide title and contents for the post." })
        } else {
            postDb.update(id, changes)
            .then(count => {
                res.status(200).json(post);
            })
            .catch(err => {
                res
                .status(500)
                .json({ error: "The post information could not be modified." })
            })
        }
    })
})

module.exports = router;