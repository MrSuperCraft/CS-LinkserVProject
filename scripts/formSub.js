function validateForm(event) {
    event.preventDefault();
    const identifier = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailIsValid = validEmailRegex.test(identifier);

    if (emailIsValid) {
        // Send login credentials to the server for authentication
        authenticateUser(identifier, password);
    } else {
        // Assume it's a username if not a valid email
        authenticateUserByUsername(identifier, password);
    }
}

function authenticateUserByUsername(username, password) {
    // Send a fetch request to the server for authentication with the username
    fetch('/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: username, password }),
    })
        .then(response => response.json())
        .then(data => handleAuthenticationResponse(data))
        .catch(handleAuthenticationError);
}

// Add the following function
function authenticateUser(email, password) {
    // Send a fetch request to the server for authentication with the email
    fetch('/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email, password }),
    })
        .then(response => response.json())
        .then(data => handleAuthenticationResponse(data))
        .catch(handleAuthenticationError);
}

function handleAuthenticationResponse(data) {
    console.log('Login response:', data);

    if (data.success) {
        const identifier = document.getElementById('email').value;

        if (data.redirect) {
            // Redirect using JavaScript
            window.location.href = data.redirect;
        } else {
            // Fallback: redirect to the design page
            const redirectPath = `/design/${encodeURIComponent(identifier)}`;
            window.location.href = redirectPath;
        }

    } else {
        console.error('Login failed:', data.message);
        alert('Invalid email, username, or password. Please check your inputs.');
    }
}

function submitSignupForm() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Make a POST request to the /signup endpoint
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }), // Include username in the payload
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // You can handle success as needed
                const emailPrefix = email.split('@')[0];
                console.log('Signup successful');
                // Optionally, redirect if you want
                window.location.href = `/design/${encodeURIComponent(emailPrefix)}`;
            } else {
                // Handle other cases, e.g., display a message to the user
                console.error('Signup failed:', data.message);
                alert('Signup failed. ' + data.message);
            }
        })
        .catch(error => {
            console.error(error.message);
            // Handle other errors, display a message, etc.
            alert('An error occurred during signup. Please try again.');
        });
}

function handleAuthenticationError(error) {
    console.error(error.message);
    let errorMessage = 'An error occurred during login. Please try again.';

    if (error.status === 401) {
        errorMessage = 'Invalid email, username, or password. Please check your inputs.';
    } else if (error.status === 404) {
        errorMessage = 'User not found. Please check your email or username.';
    } else if (error.status === 500) {
        errorMessage = 'Internal Server Error. Please try again later.';
    }

    alert(errorMessage);
}
