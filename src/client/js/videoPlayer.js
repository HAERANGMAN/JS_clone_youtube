const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
// const time = document.getElementById("time");// 위에2개로 대체
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");


let controlsMovementTimeout = null; //마우스초기화
let controlsTimeout = null;
let volumeValue = 0.5; //다시 해제한 후에 본래값으로 돌아가기 위해서
video.volume = volumeValue;


const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
// const handlePause = () => (playBtn.innerText = "Play");
// const handlePlay = () => (playBtn.innerText = "Pause");


const handleMuteClick = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
  ? "fas fa-volume-mute"
  : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};


const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};


const formatTime = (seconds) =>  {
  const startIdx = seconds >= 3600 ? 11 : 14;
  return new Date(seconds * 1000).toISOString().substring(startIdx, 19);
};


const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
};


const handleTimeUpdate = () => {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};


const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};


const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};


// 마우스가 왓다갔다할때 let controlsTimeout 유무가 중요함
const hideControls = () => videoControls.classList.remove("showing");


const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 1000);
};


const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 1000);
  // controlsTimeout = setTimeout(() => {
  //   videoControls.classList.remove("showing");
  // }, 3000);
};


const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};



playBtn.addEventListener("click", handlePlayClick); //플레이
muteBtn.addEventListener("click", handleMuteClick); //뮤트
volumeRange.addEventListener("input", handleVolumeChange); //볼륨
video.addEventListener("loadedmetadata", handleLoadedMetadata); //종료시간
video.addEventListener("timeupdate", handleTimeUpdate); //현재시간
video.addEventListener("mousemove", handleMouseMove); //컨트롤러
video.addEventListener("mouseleave", handleMouseLeave); //컨트롤러4
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange); //타임라인조절
fullScreenBtn.addEventListener("click", handleFullscreen); //풀스크린
// video.addEventListener("pause", handlePause);
// video.addEventListener("play", handlePlay);