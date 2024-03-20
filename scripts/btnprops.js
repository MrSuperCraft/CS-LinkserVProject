// Helper functions

function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}

function showButtonSection() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'none';
    document.getElementById('buttonSection').style.display = 'block';
}




////////////////////






document.addEventListener('DOMContentLoaded', () => {


    // Get references to the input fields and fill style section
    const fillStyleSection = document.getElementById('fillStyleSection');
    const fillColorInput = document.getElementById('fillColor');
    const textColorInput = document.getElementById('textColor');

    // Function to show or hide the fill style section based on the selected preset
    function toggleFillStyleSection() {
        const preset = document.getElementById('buttonPreset').value;
        if (preset === 'fill') {
            fillStyleSection.style.display = 'block';
        } else {
            fillStyleSection.style.display = 'none';
        }
    }

    // Event listener to toggle fill style section visibility
    const buttonPreset = document.getElementById('buttonPreset');
    buttonPreset.addEventListener('change', toggleFillStyleSection);
    // Get references to the input fields, error message element, and button container
    const buttonTextInput = document.getElementById('buttonText');
    const buttonLinkInput = document.getElementById('buttonLink');
    const errorButton = document.getElementById('errorButton');
    const buttonContainer = document.getElementById('customButtonsContainer');

    // Function to add a custom button
    function addCustomButton() {
        // Reset error message and input styles after 3 seconds
        setTimeout(() => {
            errorButton.textContent = '';
            buttonTextInput.classList.remove('invalid-input');
            buttonLinkInput.classList.remove('invalid-input');
        }, 3000);

        // Get the values from the input fields
        const buttonText = buttonTextInput.value.trim();
        let buttonLink = buttonLinkInput.value.trim();
        const styleStrength = document.getElementById("style-strength").value;
        const preset = document.getElementById("buttonPreset").value;

        // Check if the button text and link are not empty
        if (buttonText && buttonLink) {
            // Check if the link starts with "http://" or "https://"
            if (!/^https?:\/\//i.test(buttonLink)) {
                // If not, prepend "https://"
                buttonLink = 'https://' + buttonLink;
            }

            // Create a new button element
            const newButton = document.createElement('button');
            newButton.textContent = buttonText;

            // Set data properties for button text and link
            newButton.dataset.buttonText = buttonText;
            newButton.dataset.buttonLink = buttonLink;
            newButton.dataset.fillColor = fillColorInput.value;
            newButton.dataset.textColor = textColorInput.value;

            // Create an anchor element
            const newAnchor = document.createElement('a');
            newAnchor.href = buttonLink;

            // Append the button to the anchor element
            newAnchor.appendChild(newButton);
            newButton.classList.add('design__button');
            newButton.classList.add(`${preset}`);
            newButton.classList.add(`var-${styleStrength}`);

            // Append the anchor element to the button container
            buttonContainer.appendChild(newAnchor);

            // Clear the input fields after adding the button
            buttonTextInput.value = '';
            buttonLinkInput.value = '';
        } else {
            // Display error message and apply red outline to invalid inputs
            errorButton.textContent = 'Please enter both button text and button link.';
            if (!buttonText) {
                buttonTextInput.classList.add('invalid-input');
            }
            if (!buttonLink) {
                buttonLinkInput.classList.add('invalid-input');
            }

            // Reset error message and input styles after 3 seconds
            setTimeout(() => {
                errorButton.textContent = '';
                buttonTextInput.classList.remove('invalid-input');
                buttonLinkInput.classList.remove('invalid-input');
            }, 3000);
        }
    }

    // Event listener for the "Add Button" button
    const addButton = document.getElementById('addButton');
    addButton.addEventListener('click', addCustomButton);
});




