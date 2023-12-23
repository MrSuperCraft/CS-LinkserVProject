function checkPasswordStrength(password) {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;
    const strengthLabel = document.getElementById("strength-label");

    if (password.length === 0) {
        strengthLabel.innerText = "";
        strengthLabel.style.color = "black";
    } else if (strongPasswordRegex.test(password)) {
        strengthLabel.innerText = "\n Strong";
        strengthLabel.style.color = "green";
    } else if (password.length >= 8) {
        strengthLabel.innerText = "\n Medium";
        strengthLabel.style.color = "orange";
    } else {
        strengthLabel.innerText = "\n Weak";
        strengthLabel.style.color = "red";
    }
}


