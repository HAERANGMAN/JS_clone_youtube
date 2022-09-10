import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";


const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");


// 영상키고 저장까지의 과정
// 가짜링크(함수)를 통해서 다운로드

// 변수 선언순대로 진행
let stream;
let recorder;
let videoFile;


//가상으로 만들어서 클릭해주고 진행되게함
const handleDownload = async () => {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click(); //유저가아닌 직접클릭해서 실행
};


const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};


const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data); //브라우저에 데이터가 있는곳
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};


const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};



init();



startBtn.addEventListener("click", handleStart);