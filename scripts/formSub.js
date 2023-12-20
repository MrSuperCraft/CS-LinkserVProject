function validateForm(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const emailIsValid = validEmailRegex.test(email);
    const passwordIsStrong = strongPasswordRegex.test(password);

    if (emailIsValid && passwordIsStrong) {
        // Send login credentials to the server for authentication
        authenticateUser(email, password);
    } else {
        alert("Invalid email or weak password. Please check your inputs.");
    }
}

// Update the client-side authenticateUser function
function authenticateUser(email, password) {
    // Send a fetch request to the server for authentication
    fetch('/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Login response:', data);

        if (data.success) {
            // Redirect to the design page upon successful login
            const emailPrefix = email.split('@')[0];
            window.location.href = `/design/${encodeURIComponent(emailPrefix)}`;
        } else {
            console.error('Login failed:', data.message);
            alert('Invalid email or password. Please check your inputs.');
        }
    })
    .catch(error => {
        console.error(error.message);
        alert('An error occurred during login. Please try again.');
    });
}


function submitSignupForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Make a POST request to the /signup endpoint
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (response.ok) {
            // You can handle success as needed
            const emailPrefix = email.split('@')[0];
            console.log('Signup successful');
            // Optionally, redirect if you want
            window.location.href = `/design/${encodeURIComponent(emailPrefix)}`;
        } else if (response.status === 400) {
            // Handle the case where the email is already in use
            console.log('Email is already in use');
            // You can display a message to the user or handle it as needed
        } else {
            throw new Error('Sign-up failed');
        }
    })
    .catch(error => {
        console.error(error.message);
        // Handle other errors, display a message, etc.
    });
}
