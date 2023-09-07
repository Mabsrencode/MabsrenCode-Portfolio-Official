const contactForm = document.querySelector(".cnt-form");
let message = document.getElementById("message");
let name = document.getElementById("name");
let email = document.getElementById("email");
let subject = document.getElementById("subject");
let phone = document.getElementById("phone");
let config = document.getElementById("configuration");
let configSuccess = document.getElementById("configuration-container");
let configError = document.getElementById("configuration-container-error");
let btnSuccess = document.getElementById("btn-success");
let btnError = document.getElementById("btn-error");
let btnSubmit = document.getElementById("btn-submit");
let loaderSubmit = document.getElementById("loader-submit");

function submitFunction() {
  loaderSubmit.style.visibility = "visible";
}
function loadHidden() {
  loaderSubmit.style.visibility = "hidden";
}

function configurationSuccess() {
  config.style.display = "flex";
  configSuccess.style.display = "block";
}
function configurationError() {
  config.style.display = "flex";
  configError.style.display = "block";
  configSuccess.style.display = "none";
  btnSubmit.value = "Submit";
}
config.addEventListener("click", () => {
  btnSubmit.disabled = false;
  config.style.display = "none";
  loadHidden();
});
btnSuccess.addEventListener("click", () => {
  btnSubmit.disabled = false;
  config.style.display = "none";
  loadHidden();
});
btnError.addEventListener("click", () => {
  btnSubmit.disabled = false;
  config.style.display = "none";
  loadHidden();
});

contactForm.addEventListener("submit", (e) => {
  submitFunction();
  // btnSubmit.value = "Sending...";
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = "Sending...";
  e.preventDefault();
  let formData = {
    message: message.value,
    name: name.value,
    email: email.value,
    subject: subject.value,
    phone: phone.value,
  };
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.onload = function () {
    console.log(xhr.responseText);
    if (xhr.responseText == "success") {
      configurationSuccess();
      message.value = "";
      name.value = "";
      email.value = "";
      subject.value = "";
      phone.value = "";
      // btnSubmit.value = "Submit";
      btnSubmit.innerText = "Submit";
    } else {
      configurationError();
    }
  };
  xhr.send(JSON.stringify(formData));
});
