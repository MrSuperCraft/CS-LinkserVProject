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

        // Check if the error is related to a duplicate signup
        if (data.message && data.message.toLowerCase().includes('already in use')) {
            displayErrorMessage('Email or username is already in use. Please choose a different one.');
        } else {
            displayErrorMessage('Invalid email, username, or password. Please check your inputs.');
        }
    }
}

function submitSignupForm(event) {
    event.preventDefault(); // Add this line to prevent the default form submission
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
                window.location.href = `/design/${username}`;
            } else {
                // Handle other cases, e.g., display a specific message to the user
                console.error('Signup failed:', data.message);
                displaySignupErrorMessage(data.message || 'Signup failed. Please try again.');
            }
        })
        .catch(error => {
            console.error(error.message);
            // Handle other errors, display a message, etc.
            displaySignupErrorMessage('An error occurred during signup. Please try again.');
        });
}


// Modify the displaySignupErrorMessage function to handle client-side display
function displaySignupErrorMessage(message) {
    const signupErrorMessage = document.getElementById('signup-error-message');

    // Update the container with the error message
    signupErrorMessage.innerText = message;
    signupErrorMessage.style.display = 'block';

    // Set a timeout to hide the error message after a specific duration (e.g., 5 seconds)
    setTimeout(() => {
        signupErrorMessage.style.display = 'none';
    }, 5000); // Adjust the duration as needed
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

    displayErrorMessage(errorMessage);
}

// Add the following function to display error messages
function displayErrorMessage(message) {
    const errorMessageContainer = document.getElementById('login-error-message');
    errorMessageContainer.innerText = message;
    errorMessageContainer.style.display = 'block';

    setTimeout(() => {
        errorMessageContainer.style.display = 'none';
    }, 5000); // Adjust the duration as needed
}

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const charCountSpan = document.getElementById('charCount');

    // Update character count on input
    usernameInput.addEventListener('input', () => {
        const charCount = usernameInput.value.length;
        charCountSpan.textContent = `${charCount} / 15`;

        // Check if the username exceeds 15 characters and notify the user
        if (charCount > 15) {
            usernameInput.setCustomValidity('Username cannot exceed 15 characters.');
        } else {
            usernameInput.setCustomValidity('');
        }
    });

    // Handle form submission
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            event.preventDefault(); // Prevent form submission if validation fails
            alert('Please enter a valid username.');
        }
    });
});
