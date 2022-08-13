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