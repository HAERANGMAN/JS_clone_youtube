import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";


const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");


// 영상키고 저장까지의 과정
// 가짜링크(함수)를 통해서 다운로드

// 변수 선언순대로 진행
let stream;
let recorder;
let videoFile;


//스트링 오류를 피하기 위해 변수를 지정함
const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};


//가상으로 만들어서 클릭해주고 진행되게함
const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;


  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();


  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  //브라우저에서 작업, videoFile = blob(JS에서 file을 지칭)

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  //인코딩후 

  await ffmpeg.run( "-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb );
  //썸네일

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);
  //파일로 

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  //blob(JS에서 file을 지칭), buffer를 통해 실제파일로 접근

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);
  //실제링크추가

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");
  
  // const thumbA = document.createElement("a");
  // thumbA.href = thumbUrl;
  // thumbA.download = "MyThumbnail.jpg";
  // document.body.appendChild(thumbA);
  // thumbA.click(); //유저가 직접클릭하는것이 아닌 함수에서 실행

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);
  //느려지는것을 방지하기 위해서 다운후 파일삭제

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
  //URL도 삭제

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
  //함수 재실행
};


// const handleStop = () => {
//   actionBtn.innerText = "Download Recording";
//   actionBtn.removeEventListener("click", handleStop);
//   actionBtn.addEventListener("click", handleDownload);
//   recorder.stop();
// };


const handleStart = () => {
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;
  // actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  // actionBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data); //브라우저에 데이터가 있는곳
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 1000);
};


const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.play();
};


init();


actionBtn.addEventListener("click", handleStart);