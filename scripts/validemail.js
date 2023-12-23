function validate() {
  const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const email = document.getElementById('email').value;
  const validationStatus = document.getElementById('emailValidationStatus');

  if (email.trim() === "") {
    validationStatus.innerText = "";
  } else if (validRegex.test(email)) {
    validationStatus.innerText = "Valid ✔";
    validationStatus.style.color = "green";
  } else {
    validationStatus.innerText = "Invalid ✖";
    validationStatus.style.color = "red";
  }
}
