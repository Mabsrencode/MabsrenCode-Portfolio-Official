// refresh the page when logo is clicked
document.querySelector(".logo-home").addEventListener("click", () => {
  window.location.reload(true);
});
document.querySelector(".logo-about").addEventListener("click", () => {
  window.location.reload(true);
});
document.querySelector(".logo-projects").addEventListener("click", () => {
  window.location.reload(true);
});
document.querySelector(".logo-contact").addEventListener("click", () => {
  window.location.reload(true);
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

let progress = 0;
const loaderInterval = window.setInterval(function () {
  const $lp = $(".loading-progress");
  progress = progress + getRandomArbitrary(10, 25);
  $lp.css("transform", `translateX(${progress}%)`);

  if (progress >= 75) {
    window.clearInterval(loaderInterval);
    $lp.css("transform", "translateX(100%)");
    setTimeout(
      () => $(".loading").css("transform", "translateY(calc(100% + 10px))"),
      400
    );
  }
}, getRandomArbitrary(200, 1000));

const clocksElement = document.querySelectorAll(`.status`);

function updateTime() {
  const date = new Date();
  const phTime = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Manila" })
  );
  const hour = phTime.getHours();
  if (hour > 7 || hour < 3) {
    clocksElement.forEach((e) => (e.style.backgroundColor = "#0fcc45"));
  } else {
    clocksElement.forEach((e) => (e.style.backgroundColor = "red"));
  }
}

setInterval(updateTime, 1000);

// setInterval(updateTime, 1000);
// function iconDarkMode() {
//   document.body.classList.toggle("dark-theme");
//   if (document.body.classList.contains("dark-theme")) {
//     let iconSun = document.querySelector(".fa-sun");
//     let iconMoon = document.querySelector(".fa-moon");
//     iconSun.style.display = "inline";
//     iconMoon.style.display = "none";
//   } else {
//     iconSun.style.display = "none";
//     iconMoon.style.display = "inline";
//   }
// }

document.addEventListener("DOMContentLoaded", function () {
  var contentElement = document.getElementById("center-screen");
  setTimeout(function () {
    contentElement.style.display = "block";
  }, 750);
});
