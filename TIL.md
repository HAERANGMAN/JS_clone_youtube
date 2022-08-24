- json: 프로그래머가 파일에 정보를 저장하기 위해 만든 방식 중 하나
- Node js의 경우에 반드시 파일명 package.json(`npm init`을 통해 package.json를만듬)
- package.json이 있는 자리에서 `npm run {key}`실행하면 package.json의 scrpit의 {value}작동됨
- 해당폴더에서 npm i(install) express하면 서버가 생김
- 설치된 npm은 package.json에 "dependencies"를 남기고, "dependencies"에 있는 npm들은 `npm i` 만쳐도 설치됨
- 협업시에 .gitignore로 /node_modules를 무시하고 `npm i`로 depende~+devDepend~설치하게 하면됨

```
고로 중요한것은 package.json과 index.js(의 dependencies+devDep)
```

- 프로젝트에 필요한 "dependencies" `pip list랑 비슷`
- 개발자에게 필요한 "devDependencies"
- 이러나 저러나 둘다 node_modules에 깔림
  `barbel`

```
최신 자바스크립트 문법을 구형 브라우저에서도 돌 수 있도록 코드 자체를 변환시킨다.
https://babeljs.io/setup에서 설치
Utilities: Nodemon, Language APIs: Node클릭후 설치
```

`npm install @babel/core @babel/node --save-dev`

- 위를 입력하여 바벨에서 nodemon, node 설치
- 바벨 작동을 위한 스크립트도 패키지에 넣음
- 바벨노드로 index.js를 변환

```
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

```
"dev": "nodemon --exec babel-node index.js"
```

>`(여기까지가 세팅방법)`

---

>`본격적인수업`  
## 서버를 열어보자
> 작동되는 것은 packge.json에서의 script이므로  
> 현재의 node.JS의 작동디렉토리는 최상위폴더임
```
import express from "express";
express().listen(4000, () => console.log(`✅ Server listenting on port http://localhost:4000 🚀`));
```

- 열려는 있는데 받아주는것들이 하나도 없음
- npm run dev할경우 서버가 열려있는것을 확인, 끄면 닫힘

## request, response
```
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
```
- response.end()는 끝내기
- response.send()는 메세지 보내기
- cookie()
- json()
- redirect()
```
> `응답에 대한 방법들임!!`  
## Middleware
`request, response 의 사이에 있는것`
```
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
```
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
> - 파이썬과 다른점은 `export`를 해줘야함!  
> - clean code를 위해서 파일 분리!
```
<module.js>

export const {변수명};
export default {함수명};
```
```
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
```
//변수가 아래로 내려가야함
userRouter.get("/remove", remove);
userRouter.get("/:id", see); 
```
`주의`
```
//이렇게 작성될경우 remove가 id로 들어가면 밑의 컨트롤러는 작동이안됨
userRouter.get("/:id", see); 
userRouter.get("/remove", remove);
```


## pug(Return rep.send)
html을 편하게 사용하기위해 씀
> 1 Pug를 사용하기위해서 `npm i pug`  
> 2 app.use() 앞에 set으로 설정  
> 3 res.render('home') //controller에서!
```
app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views"); //package.script 기본경로 재설정
app.use~~~
~~~~~~~~~~
```

## Pug for Extend
> 중복을 편하게 쓰기위해서 3가지방법  
> partials, block, #{}
```
pug 페이지 작성후
~~~~~~~~~~~~~~~~~
include partials/footer.pug
```
`base.pug`
```
block {이름}
or
head
    title 안녕하세요! #{name}
or
header
    h1=page
```

`any.pug`
```
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
```
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
```
include mixins/video

each potato in videos
            +video(potato)
```

## relative, absoulte URL
> 'edit'와 '/edit'의 차이
```
a(href="/video/edit")--->localhost:4000/video/edit
a(href="video/edit")--->localhost:4000/videos/video/edit
a(href=`${video.id}/edit`)--->localhost:4000/videos/1/edit
```

## Ternary operator
> 1줄 if문
```
h3 #{video.views} #{video.views === 1 ? "view" : "views"}
h3 #{video.views === 1 ? `${video.views} view` : `${video.views} views` }
```


## (중요) Method GET, POST
`GET`
> 이 경우 localhost:4000/save-changes?title=Third+Video가 주소로 나옴
> 공개적으로 action과 name, value가 전송된것...
> 주로 검색창에서 많이사용
```
form(action="/save-changes", method="GET")
        input(name="title", placeholder="Video Title", value=video.title, required)
        input(value="Save",type="submit")
```
> 이 경우 res.query.title로 가져와야 한다

`POST`
> database를 CRUD하는경우
> 파일이나 아이디 비밀번호를 보낼때 주소 변화없이 그대로 보내줌
```
form(method="POST")
        input(name="title", placeholder="Video Title", value=video.title, required)
        input(value="Save",type="submit")
```
> 이 경우 res.body.title로 가져와야 한다


## Push
> 파이썬의 append역할
```
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
> https://mongoosejs.com/docs/schematypes.html
```
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
```
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
```
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
> https://mongoosejs.com/docs/api#model_Model

> 참고 : exists({ 원하는key : value})로 검색가능  
  
`수정방법 1`
```
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
```
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
> https://mongoosejs.com/docs/middleware.html  
> mongoose.model()로 저장되기전에 처리해야함  
> `this` : 저장하고자 하는 document

`해시태그처리 방법1(middleware로 처리)`
```
(models/video.js)

videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const modelVideo = mongoose.model("Video", videoSchema);
```

`해시태그처리 방법2(변수로 처리)`
```
export const formatHashtags = (potato) => potato.split(",").map((tomato)=>(tomato.startsWith("#") ? word : `#${word}`))
```

`해시태그처리 방법3(Static Way)`
```
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const modelVideo = mongoose.model("Video", videoSchema);
```

## 백데이터 오름차순으로 보이기
```
export const home = async (req, res) => {  
  const potato = await modelVideo.find({}).sort({ createdAt: "desc" });
  const videos = potato;
  return res.render("home", {pageTitle: "Home", videos});
};
```

## 정규식 검색(regex operator)
> MongoDB에서 지원해주는것
```
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
```
('models/user.js')

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});
```
> this는 create되는 {}
> 중간에서 pre를 사용해서 미들웨어처리함


## DB-중복피하기






크게 템플릿, 컨트롤러, 라우터