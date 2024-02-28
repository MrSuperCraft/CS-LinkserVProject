// Helper functions

function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}

function showButtonSection() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('textColorSection').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'none';
    document.getElementById('buttonSection').style.display = 'block';
}




// Function to show the button selection modal


// Function to add a custom button
function addCustomButton() {
    // Code to handle adding the button with user-selected properties
    // You can use JavaScript to create elements and append them to #customButtonsContainer

    // Get user-selected properties
    const buttonText = document.getElementById('buttonText').value;
    const buttonStyle = document.getElementById('buttonStyle').value;
    const buttonLink = document.getElementById('buttonLink').value;
    const buttonTransition = document.getElementById('buttonTransition').value;

    // Create a new button element
    const newButton = document.createElement('button');
    newButton.innerHTML = buttonText;
    newButton.className = 'customButton ' + buttonStyle;
    newButton.setAttribute('data-link', buttonLink);
    newButton.setAttribute('data-transition', buttonTransition);
    newButton.onclick = function () {
        // Handle button click event (e.g., redirect to the specified link with the chosen transition)
        const link = this.getAttribute('data-link');
        // Add your custom logic here
    };

    // Append the new button to the container
    document.getElementById('customButtonsContainer').appendChild(newButton);

    // Hide the modal after adding the button
    closeCustomizeElementModal();
}

// Function to edit a custom button
function editCustomButton(buttonId) {
    // Code to handle editing the button with the specified ID
    // You can use the same modal, pre-filling it with the button's current properties
    const buttonToEdit = document.getElementById(buttonId);

    // Pre-fill the modal with the button's current properties
    document.getElementById('buttonText').value = buttonToEdit.innerHTML;
    document.getElementById('buttonStyle').value = buttonToEdit.className.split(' ')[1];
    document.getElementById('buttonLink').value = buttonToEdit.getAttribute('data-link');
    document.getElementById('buttonTransition').value = buttonToEdit.getAttribute('data-transition');

    // Show the modal for editing
    showButtonSection();

    // Remove the existing button from the container
    buttonToEdit.parentNode.removeChild(buttonToEdit);
}