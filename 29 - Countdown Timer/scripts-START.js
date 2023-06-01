const timerBtns = [...document.querySelectorAll(".timer__button")];
const input = document.querySelector("input[type='text']");
const timeLeftDisplay = document.querySelector(".display__time-left");
const endTimeDisplay = document.querySelector(".display__end-time");
const form = document.querySelector("#custom");

let intervalId;

timerBtns.forEach((btn) => btn.addEventListener("click", handleBtnClick));

function handleBtnClick(e) {
  const time = this.dataset.time;
  setEndTime(time);
  setTimeLeft(time);
}

function setEndTime(time) {
  clearInterval(intervalId);
  const currentDate = new Date();
  currentDate.setSeconds(currentDate.getSeconds() + parseInt(time));
  let hour = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  endTimeDisplay.textContent = `Be back at ${hour}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}

function setTimeLeft(time) {
  let hour = Math.floor(time / 3600);
  let mins = time / 60 < 1 ? 0 : time / 60;
  let seconds = mins < 1 ? time : 0;

  renderTimeLeft({ mins, seconds });

  let duration = time;

  intervalId = setInterval(() => {
    if (seconds === 0) {
      seconds = 60;
      mins -= 1;
      renderTimeLeft({ mins, seconds });
    }

    if (--duration <= 0) {
      seconds--;
      renderTimeLeft({ mins, seconds });
      clearInterval(intervalId);
      return;
    }
    seconds--;
    renderTimeLeft({ mins, seconds });
  }, 1000);
}

function renderTimeLeft({ mins, seconds }) {
  timeLeftDisplay.textContent = `${mins}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
}

function handleSubmit(e) {
  e.preventDefault();
  const input = this.querySelector("input[name='minutes']");
  setEndTime(parseInt(input.value, 10) * 60);
  setTimeLeft(parseInt(input.value, 10) * 60);
}

form.addEventListener("submit", handleSubmit);
