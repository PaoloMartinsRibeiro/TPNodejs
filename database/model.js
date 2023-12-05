import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

const postSchema = new Schema({
  title: String,
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const User = mongoose.model("User", userSchema);
export const Post = mongoose.model("Post", postSchema);


