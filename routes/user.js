import express from "express"
import { Post, User } from "../database/model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

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

router.post("/signIn", async function (req, res) {
    const { email, password } = req.body
  
    try {
      const user = await User.findOne({ email })
  
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" })
      }
  
      const isSamePassword = await bcrypt.compare(password, user.password)
  
      if (!isSamePassword) {
        return res.status(401).json({ error: "Invalid email or password" })
      }
  
      const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      })
  
      res.json({ token })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
  

router.post("/users", async (req, res) => {
  const { firstname, lastname, email, password } = req.body
  try {
    const newUser = await User.create({ firstname, lastname, email, password })
    res.status(201).json(newUser)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get("/users", async (req, res) => {
    try {
      const users = await User.find()
      res.json(users)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
  
  router.get("/users/:userId", async (req, res) => {
    const userId = req.params.userId
    try {
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }
      res.json(user)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
  
  router.put("/users/:userId", authenticateUser, async (req, res) => {
    const userId = req.params.userId
    const { firstname, lastname, email, password } = req.body
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { firstname, lastname, email, password },
        { new: true }
      )
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" })
      }
      res.json(updatedUser)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
  
  router.delete("/users/:userId", async (req, res) => {
    const userId = req.params.userId
    try {
      const deletedUser = await User.findByIdAndDelete(userId)
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" })
      }
      res.json(deletedUser)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

export default router