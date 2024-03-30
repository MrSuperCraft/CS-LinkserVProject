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
    document.getElementById('addButton').style.display = 'block';
    document.getElementById('saveEditButton').style.display = 'none';
    document.getElementById('deleteCustomButton').style.display = 'none';

}




////////////////////


// Variable to store the active overlay
let activeOverlay = null;




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
    const buttonContainer = document.getElementById('customButtonsContainer');
    const buttonTextInput = document.getElementById('buttonText');
    const buttonLinkInput = document.getElementById('buttonLink');
    const errorButton = document.getElementById('errorButton');

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



    // Function to create the HTML structure for a custom button
    function createCustomButton(buttonText, buttonLink, preset, styleStrength) {

        // Create a new button element
        const newButton = document.createElement('button');
        newButton.textContent = buttonText;

        // Set data properties for button text and link
        newButton.dataset.buttonText = buttonText;
        newButton.dataset.buttonLink = buttonLink;

        styleStrength = document.getElementById('style-strength').value;



        // Create an anchor element
        const newAnchor = document.createElement('a');
        newAnchor.href = buttonLink;
        newAnchor.target = "_blank";

        // Append the button to the anchor element
        newAnchor.appendChild(newButton);
        newButton.classList.add('design__button');
        newButton.classList.add(`${preset}`);

        // Apply style strength to the button
        newButton.classList.add(`var-${styleStrength}`);

        // Apply additional styles based on the selected preset
        switch (preset) {
            case 'fill':
                newButton.classList.add('fill');
                newButton.style.backgroundColor = fillColorInput.value;
                newButton.style.color = textColorInput.value;
                newButton.dataset.fillColor = fillColorInput.value; // Include fill color in dataset
                newButton.dataset.textColor = textColorInput.value; // Include text color in dataset
                break;
            case 'soft-shadow':
                newButton.classList.add('soft-shadow');
                newButton.style.boxShadow = `${softShadowXInput.value}px ${softShadowYInput.value}px ${softShadowSpreadInput.value}px rgba(0, 0, 0, 0.5)`;
                newButton.dataset.softShadowX = softShadowXInput.value; // Include soft shadow X value in dataset
                newButton.dataset.softShadowY = softShadowYInput.value; // Include soft shadow Y value in dataset
                newButton.dataset.softShadowSpread = softShadowSpreadInput.value; // Include soft shadow spread value in dataset
                break;
            case 'hard-shadow':
                newButton.classList.add('hard-shadow');
                newButton.style.boxShadow = `${hardShadowXInput.value}px ${hardShadowYInput.value}px 10px rgba(0, 0, 0, 0.5)`;
                newButton.dataset.hardShadowX = hardShadowXInput.value; // Include hard shadow X value in dataset
                newButton.dataset.hardShadowY = hardShadowYInput.value; // Include hard shadow Y value in dataset
                break;
            case 'outline':
                newButton.classList.add('outline');
                newButton.style.outlineWidth = `${outlineWidthInput.value}px`;
                newButton.style.outlineColor = outlineColorInput.value;
                newButton.dataset.outlineWidth = outlineWidthInput.value; // Include outline width in dataset
                newButton.dataset.outlineColor = outlineColorInput.value; // Include outline color in dataset
                break;
            default:
                break;
        }


        // Return the anchor element with the button and overlay inside
        return newAnchor;
    }


    // Function to add a custom button to the button container
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
        const preset = document.getElementById("buttonPreset").value;

        // Check if the button text and link are not empty
        if (buttonText && buttonLink) {
            // Check if the link starts with "http://" or "https://"
            if (!/^https?:\/\//i.test(buttonLink)) {
                // If not, prepend "https://"
                buttonLink = 'https://' + buttonLink;
            }

            // Create a new div for the button container
            const btnContainer = document.createElement('div');
            btnContainer.classList.add('btn__container');

            // Create an overlay element for the new button
            const overlay = document.createElement('div');
            overlay.classList.add('btn__overlay');

            const styleStrength = document.getElementById('style-strength').value;
            overlay.classList.add(`var-${styleStrength}`);

            const overlayIcon = document.createElement('i');
            overlayIcon.classList.add('fas', `fa-pencil`);

            overlay.appendChild(overlayIcon);


            // Create the custom button HTML structure
            const customButton = createCustomButton(buttonText, buttonLink, preset, styleStrength);

            btnContainer.append(customButton);
            btnContainer.append(overlay);

            overlay.addEventListener('click', () => {
                openEditModal(overlay);
                setOverlayState(overlay, 'edit'); // Set the state to 'edit' when opening the edit modal
            });


            // Append the custom button to the button container
            buttonContainer.appendChild(btnContainer);

            // Clear the input fields after adding the button
            buttonTextInput.value = '';
            buttonLinkInput.value = '';

            closeCustomizeElementModal();
            showMessage('Successfully created a button.', 'success');
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

    // Function to open the edit modal with button data
    function openEditModal(buttonOverlay) {
        // Get the button element from the overlay
        const buttonElement = buttonOverlay.previousElementSibling.querySelector('button');

        // Get the button data from the button element
        const buttonText = buttonElement.dataset.buttonText;
        const buttonLink = buttonElement.dataset.buttonLink;
        const preset = buttonElement.classList[1]; // Assuming the preset class is the second class in the classList
        const styleStrengthClass = buttonElement.classList[2]; // Assuming the style strength class is the third class in the classList
        const styleStrength = styleStrengthClass.replace('var-', '');

        // Set the values in the edit modal form fields
        document.getElementById('buttonText').value = buttonText;
        document.getElementById('buttonLink').value = buttonLink;
        document.getElementById('buttonPreset').value = preset;
        document.getElementById('style-strength').value = styleStrength;

        // Show the modal here
        openCustomizeElementModal();
        document.getElementById('saveEditButton').style.display = 'block';
        document.getElementById('addButton').style.display = 'none';
        document.getElementById('deleteCustomButton').style.display = 'block';

        toggleSections();

        // Update the active overlay
        activeOverlay = buttonOverlay;
        setOverlayState(activeOverlay, 'edit'); // Set the state of the active overlay to 'edit'
    }





    buttonContainer.addEventListener('click', (event) => {
        const overlay = event.target.closest('.btn__overlay');
        if (overlay) {
            const button = overlay.closest('.design__button[data-design-state="edit"]');
            if (button) {
                openEditModal(button);
            }
        }
    });





    // Function to handle editing an existing button
    function editButton(buttonOverlay) {


        // Get the button element from the overlay
        const buttonElement = buttonOverlay.previousElementSibling.querySelector('button');



        // Get the button data from the form fields
        const buttonText = document.getElementById('buttonText').value.trim();
        const buttonLink = document.getElementById('buttonLink').value.trim();
        const preset = document.getElementById('buttonPreset').value;
        const styleStrength = document.getElementById('style-strength').value;

        // Update the button data
        buttonElement.textContent = buttonText;
        buttonElement.dataset.buttonText = buttonText;
        buttonElement.dataset.buttonLink = buttonLink;
        buttonElement.parentNode.href = buttonLink;


        buttonElement.dataset.styleStrength = styleStrength; // Update style strength


        // Remove old preset class and add new preset class
        buttonElement.classList.remove('fill', 'soft-shadow', 'hard-shadow', 'outline');
        buttonElement.classList.add(preset);

        // Apply additional styles based on the selected preset
        switch (preset) {
            case 'fill':
                buttonElement.style.backgroundColor = fillColorInput.value;
                buttonElement.style.color = textColorInput.value;
                buttonElement.dataset.fillColor = fillColorInput.value; // Include fill color in dataset
                buttonElement.dataset.textColor = textColorInput.value; // Include text color in dataset
                break;
            case 'soft-shadow':
                buttonElement.style.boxShadow = `${softShadowXInput.value}px ${softShadowYInput.value}px ${softShadowSpreadInput.value}px rgba(0, 0, 0, 0.5)`;
                buttonElement.dataset.softShadowX = softShadowXInput.value; // Include soft shadow X value in dataset
                buttonElement.dataset.softShadowY = softShadowYInput.value; // Include soft shadow Y value in dataset
                buttonElement.dataset.softShadowSpread = softShadowSpreadInput.value; // Include soft shadow spread value in dataset
                break;
            case 'hard-shadow':
                buttonElement.style.boxShadow = `${hardShadowXInput.value}px ${hardShadowYInput.value}px 10px rgba(0, 0, 0, 0.5)`;
                buttonElement.dataset.hardShadowX = hardShadowXInput.value; // Include hard shadow X value in dataset
                buttonElement.dataset.hardShadowY = hardShadowYInput.value; // Include hard shadow Y value in dataset
                break;
            case 'outline':
                buttonElement.style.outlineWidth = `${outlineWidthInput.value}px`;
                buttonElement.style.outlineColor = outlineColorInput.value;
                buttonElement.dataset.outlineWidth = outlineWidthInput.value; // Include outline width in dataset
                buttonElement.dataset.outlineColor = outlineColorInput.value; // Include outline color in dataset
                break;
            default:
                break;
        }


        buttonElement.classList.remove('var-1', 'var-2', 'var-3');
        buttonElement.classList.add(`var-${styleStrength}`);

        buttonOverlay.classList.remove('var-1', 'var-2', 'var-3');
        buttonOverlay.classList.add(`var-${styleStrength}`);




        // Close the modal
        const customizeElementModal = document.getElementById('customizeElementModal');
        customizeElementModal.style.display = 'none';
    }





    const saveEditButton = document.getElementById('saveEditButton');
    // Event listener for saving edits in the modal
    saveEditButton.addEventListener('click', () => {
        if (activeOverlay) {
            editButton(activeOverlay);
            showMessage('Successfully edited.', 'success');
            setOverlayState(activeOverlay, 'design'); // Reset the state of the active overlay to 'design' after editing
            activeOverlay = null; // Clear the active overlay after editing
        } else {
            showMessage('An error occurred while trying to edit this button.', 'error');
        }
    });


    function deleteCustomButton() {
        const btnContainer = activeOverlay.closest('.btn__container'); // Find the closest parent with class 'btn__container'

        if (btnContainer) {
            btnContainer.remove(); // Remove the button container from the DOM
            showMessage('Deleted the button successfully.', 'success');
            closeCustomizeElementModal();
        } else {
            showMessage('Error: Button container not found.', 'error');
        }
    }

    const deleteBtn = document.getElementById('deleteCustomButton');
    deleteBtn.addEventListener("click", deleteCustomButton);



});


function setOverlayState(overlay, state) {
    overlay.dataset.state = state;
}



// Event listener for clicks outside the overlays
document.addEventListener('click', function (event) {
    const clickedOverlay = event.target.closest('.btn__overlay');
    const customizeElementModal = document.getElementById('customizeElementModal');

    if (!clickedOverlay && customizeElementModal.style.display === 'none') {
        // Click is outside any overlay and the modal is not open
        if (activeOverlay) {
            setOverlayState(activeOverlay, 'design'); // Reset the active overlay's state to 'design'
            activeOverlay = null; // Clear the active overlay
        }
    }
});
