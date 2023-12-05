import express from 'express'
import "./database/index.js"
import Users from "./routes/user.js"
import Post from "./routes/post.js"
import 'dotenv/config'
import passport from './middleware/passport.js'

const app = express()
const port = 3005

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/', Users)
app.use('/app',Post)

app.use(passport.initialize())

app.get(
   "/protected",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
     console.log(req.user)
     res.send("Vous êtes bien connecté !")
   }
)
  

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})