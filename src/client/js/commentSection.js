const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const deleteBtn = form.querySelector("button");


const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};



const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;  
  if (text === "") {
    return;
  }
  //백엔드로 보냄
  //새로고침햇는데 fetch안됐으면큰일이니 await를 건다
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";//submit후 댓글내역 초기화
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};


if (form) {
  form.addEventListener("submit", handleSubmit);
};


// const deleteComment = async (event) => {
//   await fetch(`/api/comments/${commentId}`, {
//     method: "DELETE",

//   })
// }


// deleteBtn.addEventListener("click", deleteComment);