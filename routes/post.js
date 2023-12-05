import express from "express"
import { Post, User } from "../database/model.js"
import jwt from "jsonwebtoken"

const router = express.Router()

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing token" })
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized - Invalid token" })
      }
      req.user = decoded.user
      next()
    })
  }

router.post("/posts", authenticateUser, async (req, res) => {
  const { title, content, image } = req.body
  const userId = req.user._id 

  try {
    const newPost = await Post.create({ title, content, image, user: userId })
    res.status(201).json(newPost)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "firstname lastname")
    res.json(posts)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get("/posts/:postId", async (req, res) => {
  const postId = req.params.postId
  try {
    const post = await Post.findById(postId).populate("user", "firstname lastname")
    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }
    res.json(post)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put("/posts/:postId", authenticateUser, async (req, res) => {
  const postId = req.params.postId
  const { title, content, image } = req.body

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content, image },
      { new: true }
    ).populate("user", "firstname lastname")

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" })
    }
    res.json(updatedPost)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete("/posts/:postId", authenticateUser, async (req, res) => {
  const postId = req.params.postId
  try {
    const deletedPost = await Post.findByIdAndDelete(postId).populate("user", "firstname lastname")
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" })
    }
    res.json(deletedPost)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
