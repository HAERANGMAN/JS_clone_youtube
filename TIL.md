npm install @babel/core @babel/node --save-dev# 깃 연결후 `npm init`을 통해 package.json를만듬

- json: 프로그래머가 파일에 정보를 저장하기 위해 만든 방식 중 하나
- Node js의 경우에 반드시 파일명 package.json
- package.json이 있는 자리에서 `npm run {key}`실행하면 package.json의 scrpit의 {value}작동됨
- 해당폴더에서 npm i(install) express하면 서버가 생김
- 설치된 npm은 package.json에 "dependencies"를 남기고, "dependencies"에 있는 npm들은 npm i 만쳐도 설치됨

```
고로 중요한것은 package.json과 index.js(의 dependencies)
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

`(여기까지가 세팅방법)`

---

`본격적인수업`

```
import express from "express";
express().listen(4000, () =>
  console.log(`✅ Server listenting on port http://localhost:4000 🚀`));
```

- npm run dev할경우 서버가 열려있는것을 확인, 끄면 닫힘
