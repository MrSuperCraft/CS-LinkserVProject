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

    // Get references to the input fields and sections
    const fillStyleSection = document.getElementById('fillStyleSection');
    const softShadowSection = document.getElementById('softShadowSection');
    const hardShadowSection = document.getElementById('hardShadowSection');
    const outlineSection = document.getElementById('outlineSection');
    const fillColorInput = document.getElementById('fillColor');
    const textColorInput = document.getElementById('textColor');
    const softShadowXInput = document.getElementById('soft-shadow-x');
    const softShadowYInput = document.getElementById('soft-shadow-y');
    const softShadowSpreadInput = document.getElementById('soft-shadow-spread');
    const hardShadowXInput = document.getElementById('hard-shadow-x');
    const hardShadowYInput = document.getElementById('hard-shadow-y');
    const outlineWidthInput = document.getElementById('outline-width');
    const outlineColorInput = document.getElementById('outline-color');

    // Function to show or hide the fill style section based on the selected preset
    function toggleSections() {
        const preset = document.getElementById('buttonPreset').value;
        if (preset === 'fill') {
            fillStyleSection.style.display = 'block';
            softShadowSection.style.display = 'none';
            hardShadowSection.style.display = 'none';
            outlineSection.style.display = 'none';
        } else if (preset === 'soft-shadow') {
            fillStyleSection.style.display = 'none';
            softShadowSection.style.display = 'block';
            hardShadowSection.style.display = 'none';
            outlineSection.style.display = 'none';
        } else if (preset === 'hard-shadow') {
            fillStyleSection.style.display = 'none';
            softShadowSection.style.display = 'none';
            hardShadowSection.style.display = 'block';
            outlineSection.style.display = 'none';
        } else if (preset === 'outline') {
            fillStyleSection.style.display = 'none';
            softShadowSection.style.display = 'none';
            hardShadowSection.style.display = 'none';
            outlineSection.style.display = 'block';
        }
    }

    // Event listener to toggle fill style section visibility
    const buttonPreset = document.getElementById('buttonPreset');
    buttonPreset.addEventListener('change', toggleSections);
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

            // Set additional data properties based on the selected preset
            switch (preset) {
                case 'fill':
                    newButton.dataset.fillColor = fillColorInput.value;
                    newButton.dataset.textColor = textColorInput.value;
                    break;
                case 'soft-shadow':
                    newButton.dataset.softShadowX = softShadowXInput.value;
                    newButton.dataset.softShadowY = softShadowYInput.value;
                    newButton.dataset.softShadowSpread = softShadowSpreadInput.value;
                    break;
                case 'hard-shadow':
                    newButton.dataset.hardShadowX = hardShadowXInput.value;
                    newButton.dataset.hardShadowY = hardShadowYInput.value;
                    break;
                case 'outline':
                    newButton.dataset.outlineWidth = outlineWidthInput.value;
                    newButton.dataset.outlineColor = outlineColorInput.value;
                    break;
                default:
                    break;
            }

            // Function to add styles to the button element based on the selected preset and style
            function applyButtonStyles(button, preset) {
                switch (preset) {
                    case 'fill':
                        button.style.backgroundColor = fillColorInput.value;
                        button.style.color = textColorInput.value;
                        break;
                    case 'soft-shadow':
                        button.style.boxShadow = `${softShadowXInput.value}px ${softShadowYInput.value}px ${softShadowSpreadInput.value}px ${fillColorInput.value}`;
                        break;
                    case 'hard-shadow':
                        button.style.boxShadow = `${hardShadowXInput.value}px ${hardShadowYInput.value}px 0px ${fillColorInput.value}`;
                        break;
                    case 'outline':
                        button.style.borderWidth = `${outlineWidthInput.value}px`;
                        button.style.borderStyle = 'solid';
                        button.style.borderColor = outlineColorInput.value;
                        break;
                    default:
                        break;
                }
            }

            // Apply styles to the button based on the selected preset
            applyButtonStyles(newButton, preset);


            // Create an anchor element
            const newAnchor = document.createElement('a');
            newAnchor.href = buttonLink;
            newAnchor.target = "_blank";

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




