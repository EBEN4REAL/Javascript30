const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const context = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");
let snapshotImages;

const options = {
  video: true,
  audio: false,
};

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia(options)
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
      renderVideo();
    })
    .catch(function (error) {
      console.error("Error accessing the webcam:", error);
    });
} else {
  console.error("Webcam access not supported in this browser.");
}

function takePhoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height); 

  const dataURL = canvas.toDataURL("image/jpeg", 1); 

  const randomDeg = Math.floor(Math.random() * 21) - 10;

  const snapshotImg = document.createElement("img");
  snapshotImg.style.transform = `rotate(${randomDeg}deg)`;
  snapshotImg.classList.add("snapshot");
  snapshotImg.src = dataURL;
  strip.append(snapshotImg);
  snap.play();

  snapshotImages = [...document.querySelectorAll(".strip img")];

  snapshotImages.forEach((snapshot) =>
    snapshot.addEventListener("click", handleSnapshotDownload)
  );
}

function handleSnapshotDownload(e) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(this, 0, 0, video.videoWidth, video.videoHeight);

  const link = document.createElement("a"); 
  link.href = canvas.toDataURL("image/png");
  link.download = "image.png";
  link.setAttribute('download', 'handsome EB');

  link.click();
}

function renderVideo() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw the current frame of the video onto the canvas

  requestAnimationFrame(renderVideo); // Call the renderVideo function recursively to continuously update the canvas
}
