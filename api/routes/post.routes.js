const express = require("express");

const postControllers = require("../controllers/post.controllers");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

//Post a post
router.post("/create", checkAuth, postControllers.createPost);

//Get all posts
router.get("/all", postControllers.getAllPosts);

//Get an post by ID
router.get("/", postControllers.getPostByID);

//Search posts
router.get("/search", postControllers.searchPosts);

//Delete an post
router.delete("/", checkAuth, postControllers.deletePost);

module.exports = router;
