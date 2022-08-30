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


//그냥 url만들어서 request해준거뿐
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_ID,
    allow_signup: false,
    scope: "read:user user:email", //내가필요한정보량
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
    const emailObj = emailData.find( 
      (email) => email.primary === true && email.verified === true
    ); //조건문을 통해서 여러이메일중 가장 메인 이메일만 뽑아냄
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
  return res.redirect("/");
};


export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};


export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username },
    file,
  } = req;
  // 위와 아래는 동일함
  // const id = req.session.user.id
  // const { name, email, username } = req.body;
  let errors = [];
  let errorMessage = `This ${errors} is already exists.`

  // email, username 유효성 검사
  const loggedInUser = await modelUser.findById(_id);
  if ((loggedInUser.email !== email) && (await modelUser.exists({ email }))) {
    errors.push('(Email)');
  }
  if ((loggedInUser.username !== username) && (await modelUser.exists({ username }))) {
    errors.push('(Username)');
  }
  console.log(errorMessage, errors.length)
  // email, username 둘 중 하나라도 유효성 검사에 통과하지 못하면, 프론트에 에러 반환
  if (errors.length !== 0) {
      return res.render("edit-profile", { pageTitle: "Edit Profile", errorMessage:errorMessage});
  }
  //findByIdAndUpdate는 3개의 arguement(user의 ID, 업데이트하려는 정보, option)
  const updatedUser = await modelUser.findByIdAndUpdate(
    _id,
    { //if else file이 있으면 file.path 없으면 avatarUrl
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username
    },
    { new: true } //업데이트된 내용을 return해주는 방식
  ); //DB에서의 업데이트
  req.session.user = updatedUser; //브라우저에서의 업데이트
  return res.redirect("/users/edit");
};

//깃허브 로그인한계정은 홈으로 리다이렉션
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await modelUser.findById(_id); // session에서 사용자 본인확인후
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) { // input.oldPW와 DB의 일치여부 확인
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  } // input.newPW 일치여부 확인
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }
  user.password = newPassword; // input을 db에 보내줌
  await user.save(); //save
  return res.redirect("/users/logout");
  //만약 로그아웃을 안시켰다면 다시 session을 업데이트 해줘야함
}; 
  
  
  
  


export const see = (req, res) => res.send("See User");



// 카카오 로그인 구현하기 (REST API)

// 카카오 로그인 구현하실 분들은 아래 링크들을 참조하시면 됩니다.
// 구현 방식은 깃허브 로그인과 거의 동일합니다.
// https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api

// 0. 애플리케이션 등록
// https://developers.kakao.com/docs/latest/ko/getting-started/app

// 1. 인가 코드 받기
// https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code

// 2. 토큰 받기
// https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token

// 3. 사용자 정보 가져오기
// https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info