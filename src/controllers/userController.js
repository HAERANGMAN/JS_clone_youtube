import modelUser from "../models/user";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
//모듈 내보낼때 꼭 익스포트 써야함(파이썬이랑 다름!)


export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2 } = req.body;
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
  // const exists = await modelUser.exists({ username }); //db에 존재하는지만 확인 //socialOnly까지 찾기
  const pureUser = await modelUser.findOne({ username, socialOnly: true }); 
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  } else if (pureUser) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "You already joined with Github!",
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


export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_ID,
    allow_signup: false,
    scope: "read:user user:email",
  }; //필요햔 scope는 여기에 넣고 URLSearchParams을 사용
  const params = new URLSearchParams(config).toString(); //toString을 꼭 해야함
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};


export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_ID,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  //결국 access_token 요청을 위한 url만들기의 과정임
  //아래는 github양식대로 fetch하는 과정
  //await2번과 json을 잘보자
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  //결국 최종 access_token을 위해서 하는일
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await ( //scope[0]인 유저데이터
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();//유저정보  
    const emailData = await ( //scope[1]인 이메일
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find( //조건문을 통해서 여러이메일중 가장 메인 이메일만 뽑아냄
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login"); //메인이메일 없으면 로그인으로 다시
    }
    const user = await modelUser.findOne({ email: emailObj.email });
    if (!user) {      
      const user = await modelUser.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "", //비게하기위해서 modelUser.pw는 unrequired 어차피 pug input과정에서 required임
        socialOnly: true,
      });
    } //있으면 찾고 없으면 만들어서 세션에 넣기
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login"); //토큰없으면 로그인으로 다시
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/")
};


export const edit = (req, res) => res.send("Edit User");
export const see = (req, res) => res.send("See User");