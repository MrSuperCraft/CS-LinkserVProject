
function validateAndSubmit() {
    // Validate the form fields
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const topic = document.getElementById('topic').value.trim();
    const message = document.getElementById('message').value.trim();
    const formResultContainer = document.getElementById('formResult');
    const title = document.getElementById('title').value.trim();

    // If Title is not provided, use Topic as the title
    const finalTitle = title !== '' ? title : topic;

    if (name === '' || email === '' || topic === '' || message === '') {
        alert('Please fill out all required fields before submitting the form.');
        return;
    }

    contactSub(finalTitle);
    // Display a success message
    formResultContainer.innerHTML = '<p style="color: green;">Form submitted successfully! Thank you!</p>';

    // If all fields are filled, proceed to submit the form
    clearFormFields();
}


async function contactSub() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const topic = document.getElementById('topic').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('http://localhost:3000/api/submit-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, topic, message }),
        });

        if (response.ok) {
            console.log('Contact form submitted successfully');
            // You can add any client-side logic or redirect after successful submission
        } else {
            console.error('Error submitting contact form:', response.status, response.statusText);
            // Handle errors on the client side if needed
        }
    } catch (error) {
        console.error('Error submitting contact form:', error.message);
        // Handle errors on the client side if needed
    }
}

function clearFormFields() {
    // Clear the form fields
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('topic').value = '';
    document.getElementById('message').value = '';
}