function validateForm(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const emailIsValid = validEmailRegex.test(email);
    const passwordIsStrong = strongPasswordRegex.test(password);

    if (emailIsValid && passwordIsStrong) {
        // LOGIN! WIP.
    } else {
        alert("Invalid email or weak password. Please check your inputs.");
    }
}
