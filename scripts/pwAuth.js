function checkPasswordStrength(password) {

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
    if (password.length === 0) {
        document.getElementById("strength-label").innerText = "";
        document.getElementById("strength-label").style.color = "black";
    } else if (strongPasswordRegex.test(password)) {
        document.getElementById("strength-label").innerText = "Strong";
        document.getElementById("strength-label").style.color = "green";
    } else if (password.length >= 8) {
        document.getElementById("strength-label").innerText = "Medium";
        document.getElementById("strength-label").style.color = "orange";
    } else {
        document.getElementById("strength-label").innerText = "Weak";
        document.getElementById("strength-label").style.color = "red";
}
}


