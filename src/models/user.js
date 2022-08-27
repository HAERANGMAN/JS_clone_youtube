import bcrypt from "bcrypt";
import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  avatarUrl: String, //위아래 동일함
  socialOnly: { type: Boolean, default: false },
  name: { type: String, required: true },
});


userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});


const modelUser = mongoose.model("User", userSchema);

export default modelUser;