const feedbackForm = document.querySelector(".feedback-form");
let feedbackEmail = document.getElementById("feedback-email");
let feedbackMessage = document.getElementById("feedback-message");
let feedbackFormBtn = document.getElementById("feedback-form-btn");
let feedbackBtn = document.getElementById("feedback-btn");
let feedbackContainer = document.getElementById("feedback-container");
let feedbackCloseButton = document.getElementById("fa-circle-xmark");

feedbackBtn.addEventListener("click", () => {
  feedbackContainer.style.display = "block";
  feedbackBtn.style.display = "none";
});
feedbackCloseButton.addEventListener("click", () => {
  feedbackContainer.style.display = "none";
  feedbackBtn.style.display = "flex";
});

feedbackForm.addEventListener("submit", (e) => {
  feedbackFormBtn.innerText = "Sending...";
  e.preventDefault();
  let formData = {
    email: feedbackEmail.value,
    message: feedbackMessage.value,
  };
  console.log(formData);
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/feedback");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.onload = function () {
    console.log(xhr.responseText);
    if (xhr.responseText == "success") {
      configurationSuccess();
      feedbackEmail.value = "";
      feedbackMessage.value = "";
      feedbackFormBtn.innerText = "Send";
    } else {
      configurationError();
      feedbackFormBtn.innerText = "Send";
    }
  };
  xhr.send(JSON.stringify(formData));
});
