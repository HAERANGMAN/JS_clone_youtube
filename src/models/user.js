import bcrypt from "bcrypt";
import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  avatarUrl: String, //위아래 동일함
  socialOnly: { type: Boolean, default: false },
  name: { type: String, required: true },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], //유저의 비디오 리스트 중 _id를 가져옴
});


userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
  // this.password = await bcrypt.hash(this.password, 5);
  // 이경우 save()가 실행될 때마다 비밀번호가 또 5번씩 해쉬되서 로긴비번이 계속바뀜
});


const modelUser = mongoose.model("User", userSchema);

export default modelUser;