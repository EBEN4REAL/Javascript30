const play_toggle = document.querySelector(".toggle");
const player_video = document.querySelector(".player_video");

const player_volume = document.querySelector(
  ".player_controls input[name='volume']"
);

const player_playbackRate = document.querySelector(
  ".player_controls input[name='playbackRate']"
);

const player_skips = [...document.querySelectorAll(".player_controls .skip")];
const duration = document.querySelector(".duration");
const progress = document.querySelector(".progress");

function handlePlayToggle() {
  if (player_video.paused) {
    player_video.play();
    play_toggle.innerHTML = "❚ ❚";
    play_toggle.setAttribute("title", "pause video");
  } else {
    player_video.pause();
    play_toggle.innerHTML = "►";
    play_toggle.setAttribute("title", "play video");
  }
}

function handleVolumeChange(e) {
  player_video.volume = this.value;
}

function handlePlayBackRate(e) {
  player_video.playbackRate = this.value;
}

function formatTime(secs) {
  const milliseconds = secs * 1000;
  const currentDate = new Date(milliseconds);
  const hours = currentDate.getUTCHours();
  const minutes = currentDate.getUTCMinutes();

  const seconds =
    currentDate.getUTCSeconds() < 10
      ? `0${currentDate.getUTCSeconds()}`
      : currentDate.getUTCSeconds();

  const time = `${hours ? hours + ":" : ""}${
    minutes ? minutes + ":" : ""
  }${seconds}`;

  return time;
}

function handleSkip(e, skip = 0) {
  player_video.currentTime += skip || parseInt(this.dataset.skip, 10);
  handleProgress();
}

function handleProgress() {
  const progressPercent = `${
    (player_video.currentTime / player_video.duration) * 100
  }%`;

  document.documentElement.style.setProperty(
    "--progress-filled-width",
    progressPercent
  );
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * player_video.duration;
  player_video.currentTime = scrubTime;
  handleProgress();
}

function onMediaLoad(e) {
  if (this.readyState >= 2) {
    const fullPeriod = formatTime(player_video.duration);

    setInterval(() => {
      const currentSecondTick = formatTime(player_video.currentTime);
      
      const timeSplit = currentSecondTick
        .split(":")
        .map((time) => parseInt(time));

      const timeArr = fullPeriod.split(":").map((_) => 0);

      if (timeSplit.length === 1) {
        timeArr[timeArr.length - 1] =
          timeSplit[0] < 10 ? `0${timeSplit[0]}` : timeSplit[0];
      } else if (timeSplit.length === 2) {
        timeArr[timeArr.length - 1] =
          timeSplit[timeArr.length - 1] < 10
            ? `0${timeSplit[timeArr.length - 1]}`
            : timeSplit[timeArr.length - 1];
        timeArr[timeArr.length - 2] = timeSplit[timeArr.length - 2];
      } else {
        timeArr[timeArr.length - 1] =
          timeSplit[timeArr.length - 1] < 10
            ? `0${timeSplit[timeArr.length - 1]}`
            : timeSplit[timeArr.length - 1];
        timeArr[timeArr.length - 2] =
          timeSplit[timeArr.length - 2] < 10
            ? `0${timeSplit[timeArr.length - 2]}`
            : timeSplit[timeArr.length - 1];
        timeArr[timeArr.length - 3] = timeSplit[timeArr.length - 3];
      }

      const displayTime = `${timeArr.join(":")} / ${fullPeriod}`;

      duration.textContent = displayTime;
    }, 1000);
  }
}

function checkKey(e) {
  e = e || window.event;
  const activeElement =
    player_volume === document.activeElement ||
    player_playbackRate === document.activeElement;

  if (e.keyCode == "37") {
    !activeElement && handleSkip(e, -10);
  } else if (e.keyCode == "39") {
    !activeElement && handleSkip(e, 25);
  } else if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
    handlePlayToggle();
  }
}

player_video.addEventListener("loadeddata", onMediaLoad);
play_toggle.addEventListener("click", handlePlayToggle);
player_volume.addEventListener("input", handleVolumeChange);
player_skips.forEach((skipButton) =>
  skipButton.addEventListener("click", handleSkip)
);
player_video.addEventListener("click", handlePlayToggle);
player_playbackRate.addEventListener("input", handlePlayBackRate);
player_video.addEventListener("timeupdate", handleProgress);

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
progress.addEventListener("mousedown", (e) => (mousedown = true));
progress.addEventListener("mouseup", (e) => (mousedown = false));

document.onkeydown = checkKey;
