- json: 프로그래머가 파일에 정보를 저장하기 위해 만든 방식 중 하나
- Node js의 경우에 반드시 파일명 package.json(`npm init`을 통해 package.json를만듬)
- package.json이 있는 자리에서 `npm run {key}`실행하면 package.json의 scrpit의 {value}작동됨
- 해당폴더에서 npm i(install) express하면 서버가 생김
- 설치된 npm은 package.json에 "dependencies"를 남기고, "dependencies"에 있는 npm들은 `npm i` 만쳐도 설치됨
- 협업시에 .gitignore로 /node_modules를 무시하고 `npm i`로 depende~+devDepend~설치하게 하면됨

```bash
고로 중요한것은 package.json과 index.js(의 dependencies+devDep)
```

- 프로젝트에 필요한 "dependencies" `pip list랑 비슷`
- 개발자에게 필요한 "devDependencies"
- 이러나 저러나 둘다 node_modules에 깔림
  `barbel`

```bash
최신 자바스크립트 문법을 구형 브라우저에서도 돌 수 있도록 코드 자체를 변환시킨다.
https://babeljs.io/setup에서 설치
Utilities: Nodemon, Language APIs: Node클릭후 설치
```

`npm install @babel/core @babel/node --save-dev`

- 위를 입력하여 바벨에서 nodemon, node 설치
- 바벨 작동을 위한 스크립트도 패키지에 넣음
- 바벨노드로 index.js를 변환

```bash
{
  "scripts": {
    "dev": "babel-node index.js"
  }
}
```

- npm run dev를 하면 일반 node가 아닌 babel-node가 작동되면서 인터프리터됨

`npm i nodemon --save-dev`

- nodemon은 파일수정을 감시하는 패키지, 매번 npm run {scrpit}없이 저장 후 자동코드 재시작함
- 스크립트 아래와 같이 업데이트

```bash
"dev": "nodemon --exec babel-node index.js"
```

>`(여기까지가 세팅방법)`

---

>`본격적인수업`  

## 서버를 열어보자

> 작동되는 것은 packge.json에서의 script이므로  
> 현재의 node.JS의 작동디렉토리는 최상위폴더임

```bash
import express from "express";
express().listen(4000, () => console.log(`✅ Server listenting on port http://localhost:4000 🚀`));
```

- 열려는 있는데 받아주는것들이 하나도 없음
- npm run dev할경우 서버가 열려있는것을 확인, 끄면 닫힘

## request, response

```bash
const handleHome = (request, response) => {
    return response.send("<h1>안녕하세용!</h1>");
};

const handleLogin = (potato, tomato) => {
    return tomato.send({ messege:"Login here."}); // json으로 전송
};

```app.get(routes, controllers)```
app.get("/", handleHome);
app.get("/login", handleLogin);
```

- 서버가 일을할수 있게 라우터를 열어줌
- "/"를 통해 get요청할경우 handleHome이 작동되고 반을을 보내줌
- `request`에는 쿠키/브라우저정보/ip등 요구자의 정보가 들어있음

```bash
- response.end()는 끝내기
- response.send()는 메세지 보내기
- cookie()
- json()
- redirect()
```

> `응답에 대한 방법들임!!`  

## Middleware

`request, response 의 사이에 있는것`

```bash
const mothodLogger = (req, res, next) => {
  // return res.send("바보야~"); 여기서 리턴해버리면 뒤에함수 2개는 작동안함
  next();
};
const routerLogger = (req, res, next) => {
  next();
};
const home = (req, res, next) => {
  return res.send('hello');
};

app.get("/", methodLogger, routerLogger, home);
```

`get.use()`
> 미들웨어를 전역으로 사용하는 방법

```bash
const mothodLogger = (req, res, next) => {
  // return res.send("바보야~"); 여기서 리턴해버리면 뒤에함수 2개는 작동안함
  next();
};
const routerLogger = (req, res, next) => {
  next();
};
const home = (req, res, next) => {
  return res.send('hello');
};

app.use(methodLogger, routerLogger);
app.get("/", home);
```

## Spilt Module
>
> - 파이썬과 다른점은 `export`를 해줘야함!  
> - clean code를 위해서 파일 분리!
>
```bash
<module.js>

export const {변수명};
export default {함수명};
```

```bash
<main.js>

import {변수명1, 변수명2} from "{상대경로}"
import 디폴트니까 아무이름 from "{상대경로}"
```

## Router

> 공통부분을 기반으로 url을 설정하는 방법

- "/"에 바로연결되는 글로벌 라우터 /join, /login 등
- /users/edit, /users/delete 등 users라우터
- /videos/watch, /videos/edit 등 videos라우터

> 변수(id)를 추가할수있음

- "/:{변수명}/~~~" 을 통해서 사용
- request.params에서는 {변수명: 입력된id}로 확인가능

```bash
//변수가 아래로 내려가야함
userRouter.get("/remove", remove);
userRouter.get("/:id", see); 
```

`주의`

```bash
//이렇게 작성될경우 remove가 id로 들어가면 밑의 컨트롤러는 작동이안됨
userRouter.get("/:id", see); 
userRouter.get("/remove", remove);
```

## pug(Return rep.send)

html을 편하게 사용하기위해 씀
> 1 Pug를 사용하기위해서 `npm i pug`  
> 2 app.use() 앞에 set으로 설정  
> 3 res.render('home') //controller에서!

```bash
app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views"); //package.script 기본경로 재설정
app.use~~~
~~~~~~~~~~
```

## Pug for Extend

> 중복을 편하게 쓰기위해서 3가지방법  
> partials, block, #{}

```bash
pug 페이지 작성후
~~~~~~~~~~~~~~~~~
include partials/footer.pug
```

`base.pug`

```bash
block {이름}
or
head
    title 안녕하세요! #{name}
or
header
    h1=page
```

`any.pug`

```bash
block {이름}
    {넣을 tag} {내용}
or
res.render('home', {name : '내용'}) //controller에서!
```

## MVP.css

> middleware로서 꾸며줌

## Iteration: each ---- in ----

> for i in list: 와 동일함

## mixins

> partials처럼 블록으로 사용

```bash
mixin video(info)
    div
        h4=info.title
        ul
            li #{info.rating}/5.
            li #{info.comments} comments.
            li Posted #{info.createdAt}.
            li #{info.views} views.
```

> +를 붙여서 사용(for x in y와 같이 사용된 사례임)

```bash
include mixins/video

each potato in videos
            +video(potato)
```

## relative, absoulte URL

> 'edit'와 '/edit'의 차이

```bash
a(href="/video/edit")--->localhost:4000/video/edit
a(href="video/edit")--->localhost:4000/videos/video/edit
a(href=`${video.id}/edit`)--->localhost:4000/videos/1/edit
```

## Ternary operator

> 1줄 if문

```bash
h3 #{video.views} #{video.views === 1 ? "view" : "views"}
h3 #{video.views === 1 ? `${video.views} view` : `${video.views} views` }
```

## (중요) Method GET, POST

`GET`
> 이 경우 localhost:4000/save-changes?title=Third+Video가 주소로 나옴
> 공개적으로 action과 name, value가 전송된것...
> 주로 검색창에서 많이사용

```bash
form(action="/save-changes", method="GET")
        input(name="title", placeholder="Video Title", value=video.title, required)
        input(value="Save",type="submit")
```

> 이 경우 res.query.title로 가져와야 한다

`POST`
> database를 CRUD하는경우
> 파일이나 아이디 비밀번호를 보낼때 주소 변화없이 그대로 보내줌

```bash
form(method="POST")
        input(name="title", placeholder="Video Title", value=video.title, required)
        input(value="Save",type="submit")
```

> 이 경우 res.body.title로 가져와야 한다

## Push

> 파이썬의 append역할

```bash
let videos = []
videos.push(newVideo);
```

## mongoose

> 몽고DB와 Express.js 웹 애플리케이션 프레임워크 간 연결을 생성하는 자바스크립트 객체 지향 프로그래밍 라이브러리이다

mongod: MongoDB 시스템의 기본 데몬 프로세서 (서버와 같은 느낌)
mongosh: MongoDB에 대한 쉘 인터페이스 (클라이언트 같은 느낌)

그래서 mongod로 서버를 키고 -> mongo로 인터페이스를 실행하여 mongoDB와 소통한다

## Models

> noSQL의 문제인 유효성검증을 위해 데이터의 형식을 정해주는 카테고리
> <https://mongoosejs.com/docs/schematypes.html>

```bash
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now() },
        hashtags: [{ type: String }],
        meta: {
          views: { type: Number, default: 0, required: true },
          rating: { type: Number, default: 0, required: true },
        },
      });
            
const modelVideo = mongoose.model("Video", videoSchema);

export default modelVideo;
```

> type, required, default 가능, 그리고 [리스트]로도 넣음

## mongo callback explanation

video.find({search terms}, ) // search terms가 비었을경우 모든형식

## callback vs promise

> 순서의 차이, 직관의 차이가 엄청남

`callback`

```bash
console.log("start")
Video.find({}, (error, videos) => {
  return res.render("home", { pageTitle: "Home", videos });
});
console.log("finished")
```

> 위의 실행순서는 start -> finished -> Video의순서
> 순차대로 실행되었다가 Video에서 데이터가 올때까지 대기함
> 직관적이지 않고 현재 어디에서 실행중인지 모름  

> await는 func안에서 사용되기 때문에
> async를 적어줘서 함수안에 쓰이도록 만들어줌

`promise`

```bash
export const home = async (req, res) => {  
  try{
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  };
};
```

> await를 통해 Video가 실행될때까지 계속 기다리면서 작동한후 return
> 안되면 catch 작동함

## Express와 function.return

> Express에서 가장 중요한 기능은 res.render를 통해서 렌더링을 하는것임

```
export const home = async (req, res) => {  
  const potato = await modelVideo.find({});
  return res.render("home", {pageTitle: "Home", videos});
};
```

`return`은 단순히 함수를 종료시키는 기능일뿐임
하지만 실수(렌더를 2번하거나 등)를 줄이기 위해 함수를 종료시켜버리는것

```
export const watch = async (req, res) => {
  const { id } = req.params; //ES6문법
  const video = await modelVideo.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};
```

> 만약 여기서 404에 return이 없다면 if에서 실행되고 끝나는 것이 아니라
> if아래 render.watch 끝줄까지 실행되었을 것임

## MongoDB실행후 확인

> cmd에서 `mongosh`로 실행
> `show dbs`  
> `use {DB명}`
> `show collections`하면 const modelVideo = mongoose.model("Video", videoSchema); //(dbname, 형식) dbname의 document가 나옴  

`Database > Collection > Document > {key:value} 순`  
`Database`

- Database생성 : use DATABASE_NAME
- 사용 중인 DB 확인 : db
- DB리스트 확인 : show dbs(확인하려면 최소 한개의 document를 추가해야 함)
- Database제거 : db.dropDatabase() → 제거하고 싶은 데이터베이스를 선택 후, 삭제

`Collection`

- Collection 확인 : show collections
- Collection 삭제 : db.COLLECTION_NAME.drop()
- Collection 내용보기 : db.{콜렉션}.find()

## Model의 Update

> <https://mongoosejs.com/docs/api#model_Model>

> 참고 : exists({ 원하는key : value})로 검색가능  
  
`수정방법 1`

```bash
const video = await modelVideo.findById(id);
// exists({ 원하는property : value})로 검색가능, id는 id만
if (!video) {
  return res.render("404", { pageTitle: "Video not found." });
}
video.title = title;
video.description = description;
video.hashtags = hashtags
  .split(",")
  .map((word) => (word.startsWith("#") ? word : `#${word}`)); // #으로 시작하면 전자 아니면 후자
await video.save();
```

`수정방법 2`

```bash
const video = await modelVideo.exists({ _id: id });
// exists({ 원하는property : value})로 검색가능, id는 id만
if (!video) {
  return res.render("404", { pageTitle: "Video not found." });
}
await Video.findByIdAndUpdate(id, {
  title,
  description,
  hashtags: hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`)),
});
```

## Model의 Middleware처리(3가지)

> <https://mongoosejs.com/docs/middleware.html>  
> mongoose.model()로 저장되기전에 처리해야함  
> `this` : 저장하고자 하는 document

`해시태그처리 방법1(middleware로 처리)`

```bash
(models/video.js)

videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const modelVideo = mongoose.model("Video", videoSchema);
```

`해시태그처리 방법2(변수로 처리)`

```bash
export const formatHashtags = (potato) => potato.split(",").map((tomato)=>(tomato.startsWith("#") ? word : `#${word}`))
```

`해시태그처리 방법3(Static Way)`

```bash
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const modelVideo = mongoose.model("Video", videoSchema);
```

## 백데이터 오름차순으로 보이기

```bash
export const home = async (req, res) => {  
  const potato = await modelVideo.find({}).sort({ createdAt: "desc" });
  const videos = potato;
  return res.render("home", {pageTitle: "Home", videos});
};
```

## 정규식 검색(regex operator)

> MongoDB에서 지원해주는것

```bash
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await modelVideo.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
```

여기에서 `let videos = [];`는 if가 실행안될경우 return에서 videos의 변수선언이 안되어 오류가 나기때문에 공란으로 선언한번 해준것임. if가 True라면 공란이 아니라 업데이트 될것임

## DB-pw처리

> `해싱` : 일방향 출력(결정적 함수)
> 같은 입력값 => 같은 해시값

`node.bcrypt`를 사용
saltorRound : 몇번 해시할것인가

```bash
('models/user.js')

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});
```

> this는 create되는 {}
> 중간에서 pre를 사용해서 미들웨어처리함

## DB-중복피하기

> 아래의 exists를 활용, 2개를 동시에 쓰기위해 $or문법활용
> 근데 이경우에는 그냥 2개 개별로 쓰는게 나을듯

```bash
(userController.js)

const exists = await modelUser.exists({ $or: [{ username }, { email }] });
```

## 브라우저에 상태전송

> 오류가 날 상황일 경우, 렌더시 상태도 같이 전송해준다

```
return res.status(404).render("404", { pageTitle: "Video not found." });
```

## DB-pw체크하기

> findOne(db에서 인자로 찾음), exists(확인만함)의 차이를 구분해야함

```
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
  return res.redirect("/");
};
```

## 쿠키, 세션

> 브라우저와 백엔드간의 정보
> 쿠키: 정보를 주고받는 방법

```
서버-> 브라우저로 쿠키를 보냄
브라우저는 그 쿠키를 저장하고 같은 서버(백엔드)로 요청을 보낼때 
같이보내서 백엔드에 저장된 세션으로 브라우저를 기억함
세션과 세션ID는 브라우저를 기억하는 방식(DB에 저장됨)
```

> session ID : 쿠키, 백엔드(session store)에 저장

`{req.session.id}`

```
(userController.js)
req.session.loggedIn = true;
req.session.user = user;
```

`connect-mongo`를 통해서 세션을 mongoDB에 저장

```
//secret과 store는 따로 저장해서 보호할것 

app.use(session({
          secret: //나의 ID 및 증명, 내가 줬다는것을 보장하기위해 길게어렵게
          resave: false, //true일경우 일반접속자까지 쿠키저장
          saveUninitialized: false, //true일경우 일반접속자까지 쿠키저장
          store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/youtube_clone" }),})
);
```

> 모든 방문자를 저장하는건 좋지않음 => 로그인한 사람에 한정하자

## res.locals.하위변수

> locals object는 pug에 import된 object임
> 별다른 선언 없이 하위변수를 전역변수로 활용가능함
> #{하위변수} 형식으로 그냥 사용


## Secret Key제어

0. npm i dotenv
1. .env
2. gitignore에 .eng추가
3. `변수=내용` 형식으로 추가
4. `import "dotenv/config";`를 최상위파일 맨위에써줘야 하위에서 작동
5. `process.env.변수` 형식으로 사용

## 로그인(Via Github)
`순서`
```bash
로그인페이지에서 github로 유저정보들(scope)권한 요청(res.redirect(finalUrl)) -> 이용자가 수락후 지정링크(깃허브홈피에서)로 리다이렉션 -> 지정링크로 가면 controller의 finishGithubLogin발동 -> access_token 요청후 확인되면 사용자의 정보를 (https://api.github.com/user)여기에서 fetch해서 가져옴 -> 정보가 DB에있으면 세션true하고 로그인 -> 정보가 없으면 새로 만들어줌
```

`참고링크`
- https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps

`깃허브 주소+클라이언트 아이디&원하는기능`
https://github.com/login/oauth/authorize?client_id=c122c1b88309c0f62793&allow_signup=true
- 전부 url에 기반함

`scope`
> 원하는 내용들을 가져오기

`간소화`
```bash
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "9fac726866be2ff14f36",
    allow_signup: false,
    scope: "read:user user:email",
  }; //필요햔 scope는 여기에 넣고 URLSearchParams을 사용
  const params = new URLSearchParams(config).toString(); //toString을 꼭 해야함
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
```
> 이 내용들을 통해서 scope 개별편집함

> 이후 깃허브에 request후 access token을 받아오면 깃허브에서 이용자정보등을 가져올수 있음

## fetch
> 서버에는 없고 브라우저에만 존재하는 fetch


## 로그인프로세스
```bash
로그인 프로세스를 결정해야함
<< 자체회원가입 vs API >>
예컨데 API는 verified되었고, 
DB에 메일이 있다면? 찾아야지
없다면? 새로 DB추가(비번을 줄까, socialonly를 줄까 등)
```


## Edit
> 로그인안하고 주소를 직접쳐서 들어온다면? 두가지 문제가 생김
> 1. 페이지상의 오류
`res.locals.loggedInUser = req.session.user`에서 req.session.user가 없기때문에 오류가 발생함 고로
```
res.locals.loggedInUser = req.session.user || {};
or을 의미하는 ||를 넣어 빈 딕셔너리를 반환해줌
```
> 2. 권한문제
`미들웨어`로 문제해결
로그인이 안되어있다면 로그인페이지로 강제전환
로그인이 되어있으면 next()로 진행

## Edit

> DB도 업데이트 해야하고, 세션도 업데이트 해야함

## JS 작성법

`위와 아래는 동일함`
```bash
const {
  session: {
    user: { _id },
  },
  body: { name, email, username },
} = req;
```
```bash
const id = req.session.user.id
const { name, email, username } = req.body;
```

## findByIdAndUpdate
> 3개의 arguement(user의 ID, 업데이트하려는 정보, option)
```bash
const updatedUser = await modelUser.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username
    },
    { new: true } //업데이트된 내용을 return해주는 방식
); //DB에서의 업데이트
```

## Change Password

> 깃허브 로그인의 경우 최초 비밀번호가 없음
> (socialOnly)애초에 비밀번호 앵커로 접근 불가능하게 함  

1. input을 DB에 업데이트 하기전에 session에서 id 체크먼저(본인확인)
2. 새로운패스워드1 확인2가 맞는지 확인 아니면 400 return
3. 

8.5강 3분 45초부터

## Change Profile Picture(multer)

> https://www.npmjs.com/package/multer

1. 삽입을 위한 input만들기("image/*")
2. middleware : `npm i multer`
3. multer는 req.file을 제공함
4. 백엔드로 파일을 보내기 위해 encoding type(enctype), 임의의 id도부여함
5. db에는 파일의 주소(id)만 쓰는 것임(파일저장소가 아님!)

```bash
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(uploadFiles.single("avartar"), postEdit);
//포스트 앞에 uploadFiles미들웨어를 써줌으로 해서 input.file인 avartar를 처리함
```

6. 파일을 보여주기 위해서 폴더 자체를 노출시켜야함 express.static
7. 만약 누군가가 /uploads로 접근한다면 uploads 라는 폴더를 보여주라고 함

> uploads폴더에 저장하는건 서버에 저장한다는 소리인데
> 서버가 종료되거나 바뀌면 기존에 저장된 사진들은 다 날아간다는 소리
> 다른곳에 저장하는 방법이 필요함


## JS if else

> file이 있으면 file.path 없으면 avatarUrl

```bash
avatarUrl: file ? file.path : avatarUrl
```


## mongoos relationship

```bash
<<video.js>>

owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
```

> ref: "User"에서 ObjectId를 가져옴

`populate`

```bash
<<videoController.js>>

const video = await modelVideo.findById(id).populate("owner");
```

> modelVideo.owner = {from "User" 데이터} 역참조




크게 템플릿, 컨트롤러, 라우터
