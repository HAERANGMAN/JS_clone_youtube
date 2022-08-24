import modelUser from "../models/user";
import bcrypt from "bcrypt";
//모듈 내보낼때 꼭 익스포트 써야함(파이썬이랑 다름!)


export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await modelUser.exists({ $or: [{ username }, { email }] }); //두개쓰는게 더 나을듯
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  try {
    await modelUser.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};


export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });


export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { username, password } = req.body; 
  const user = await modelUser.findOne({ username }); //findOne은 db에서 찾는 함수
  // const exists = await modelUser.exists({ username }); //db에 존재하는지만 확인
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user; //세션에 저장하기
  return res.redirect("/");
};


export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");