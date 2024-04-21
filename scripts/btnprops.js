// Helper functions


function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}

function showButtonSection() {
    openCustomizeElementModal()
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
    const styleStrengthInput = document.getElementById('style-strength');

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
    function createCustomButton(buttonText, buttonLink, preset, styleStrength, fillColor, textColor, softShadowX, softShadowY, softShadowSpread, hardShadowX, hardShadowY, outlineWidth, outlineColor) {
        // Create a new button element
        const newButton = document.createElement('button');
        newButton.textContent = buttonText;

        // Set data properties for button text and link
        newButton.dataset.buttonText = buttonText;
        newButton.dataset.buttonLink = buttonLink;

        // Create an anchor element
        const newAnchor = document.createElement('a');
        newAnchor.href = buttonLink;
        newAnchor.target = "_blank";

        // Append the button to the anchor element
        newAnchor.appendChild(newButton);
        newButton.classList.add('design__button');

        const shadowColor = hexToRgba(document.getElementById('ButtonColor3').value, 0.5) || 'rgba(0, 0, 0, 0.5)';
        newButton.dataset.shadowColor = shadowColor;


        // Apply additional styles based on the selected preset
        switch (preset) {
            case 'fill':
                newButton.classList.add('fill');
                newButton.style.backgroundColor = fillColor || fillColorInput.value;
                newButton.style.color = textColor || textColorInput.value;
                newButton.dataset.fillColor = fillColor || fillColorInput.value;
                newButton.dataset.textColor = textColor || textColorInput.value;
                newButton.dataset.softShadowX = null;
                newButton.dataset.softShadowY = null;
                newButton.dataset.softShadowSpread = null;
                newButton.dataset.hardShadowX = null;
                newButton.dataset.hardShadowY = null;
                newButton.dataset.outlineWidth = null;
                newButton.dataset.outlineColor = null;
                break;
            case 'soft-shadow':
                newButton.classList.add('soft-shadow');
                newButton.style.boxShadow = `${softShadowX || softShadowXInput.value}px ${softShadowY || softShadowYInput.value}px ${softShadowSpread || softShadowSpreadInput.value}px ${shadowColor}`;
                newButton.dataset.softShadowX = softShadowX || softShadowXInput.value;
                newButton.dataset.softShadowY = softShadowY || softShadowYInput.value;
                newButton.dataset.softShadowSpread = softShadowSpread || softShadowSpreadInput.value;
                newButton.dataset.fillColor = null;
                newButton.dataset.textColor = null;
                newButton.dataset.hardShadowX = null;
                newButton.dataset.hardShadowY = null;
                newButton.dataset.outlineWidth = null;
                newButton.dataset.outlineColor = null;
                break;
            case 'hard-shadow':
                newButton.classList.add('hard-shadow');
                newButton.style.boxShadow = `${hardShadowX || hardShadowXInput.value}px ${hardShadowY || hardShadowYInput.value}px 10px black`;
                newButton.dataset.hardShadowX = hardShadowX || hardShadowXInput.value;
                newButton.dataset.hardShadowY = hardShadowY || hardShadowYInput.value;
                newButton.dataset.fillColor = null;
                newButton.dataset.textColor = null;
                newButton.dataset.softShadowX = null;
                newButton.dataset.softShadowY = null;
                newButton.dataset.softShadowSpread = null;
                newButton.dataset.outlineWidth = null;
                newButton.dataset.outlineColor = null;
                break;
            case 'outline':
                newButton.classList.add('outline');
                newButton.style.outlineWidth = (outlineWidth || outlineWidthInput.value) > 5 ? "5px" : `${outlineWidth || outlineWidthInput.value}px`;
                newButton.style.outlineColor = outlineColor || outlineColorInput.value;
                newButton.dataset.outlineWidth = outlineWidth || outlineWidthInput.value;
                newButton.dataset.outlineColor = outlineColor || outlineColorInput.value;
                newButton.dataset.fillColor = null;
                newButton.dataset.textColor = null;
                newButton.dataset.softShadowX = null;
                newButton.dataset.softShadowY = null;
                newButton.dataset.softShadowSpread = null;
                newButton.dataset.hardShadowX = null;
                newButton.dataset.hardShadowY = null;
                break;
            default:
                break;
        }



        // Apply style strength to the button
        newButton.classList.add(`var-${styleStrength || styleStrengthInput.value}`);

        // Return the anchor element with the button inside
        return newAnchor;
    }




    // Function to add a custom button to the button container
    function addCustomButtonUI(buttonData) {
        let { button_id, buttonText, buttonLink, preset, styleStrength, fillColor, textColor, softShadowX, softShadowY, softShadowSpread, hardShadowX, hardShadowY, outlineWidth, outlineColor } = buttonData;

        buttonText = buttonText || buttonTextInput.value;
        buttonLink = buttonLink || buttonLinkInput.value;

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

            const styleStrengthValue = styleStrength ? `var-${styleStrength}` : `var-1`; // Check if styleStrength exists


            overlay.classList.add(styleStrengthValue);

            const overlayIcon = document.createElement('i');
            overlayIcon.classList.add('fas', `fa-pencil`);

            overlay.appendChild(overlayIcon);

            // Create the custom button HTML structure
            const customButton = createCustomButton(buttonText, buttonLink, preset, styleStrength, fillColor, textColor, softShadowX, softShadowY, softShadowSpread, hardShadowX, hardShadowY, outlineWidth, outlineColor);

            customButton.dataset.id = button_id;

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

            // Applies the styles to match the global style setting
            applyGlobalStyles();

            closeCustomizeElementModal();
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
    addButton.addEventListener('click', createButton);

    // Function to open the edit modal with button data
    function openEditModal(buttonOverlay) {
        document.getElementById('modalTitle').innerText = 'Customize Your Button';
        document.getElementById('customize-element-content').setAttribute("style", "0vh");
        // Get the button element from the overlay
        const buttonElement = buttonOverlay.previousElementSibling.querySelector('button');

        // Get the button data from the button element
        const buttonText = buttonElement.dataset.buttonText;
        const buttonLink = buttonElement.dataset.buttonLink;
        const preset = buttonElement.classList[1]; // Assuming the preset class is the second class in the classList
        let styleStrengthClass = buttonElement.classList[2]; // Assuming the style strength class is the third class in the classList
        let styleStrength = '';

        // Check if the style strength class exists and contains 'var-' prefix
        if (styleStrengthClass && styleStrengthClass.startsWith('var-')) {
            // Extract the style strength by removing 'var-' prefix
            styleStrength = styleStrengthClass.replace('var-', '');
        }

        // Set the values in the edit modal form fields
        document.getElementById('buttonText').value = buttonText;
        document.getElementById('buttonLink').value = buttonLink;
        document.getElementById('buttonPreset').value = preset;
        document.getElementById('style-strength').value = styleStrength;

        // Show the modal here
        showButtonSection();
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

        // Apply additional styles based on the selected preset
        switch (preset) {
            case 'fill':
                buttonElement.classList.add('fill');
                buttonElement.style.backgroundColor = fillColorInput.value;
                buttonElement.style.color = textColorInput.value;
                buttonElement.dataset.fillColor = fillColorInput.value;
                buttonElement.dataset.textColor = textColorInput.value;
                buttonElement.dataset.softShadowX = null;
                buttonElement.dataset.softShadowY = null;
                buttonElement.dataset.softShadowSpread = null;
                buttonElement.dataset.hardShadowX = null;
                buttonElement.dataset.hardShadowY = null;
                buttonElement.dataset.outlineWidth = null;
                buttonElement.dataset.outlineColor = null;
                break;
            case 'soft-shadow':
                buttonElement.classList.add('soft-shadow');
                buttonElement.style.boxShadow = `${softShadowXInput.value}px ${softShadowYInput.value}px ${softShadowSpreadInput.value}px rgba(0, 0, 0, 0.5)`;
                buttonElement.dataset.softShadowX = softShadowXInput.value;
                buttonElement.dataset.softShadowY = softShadowYInput.value;
                buttonElement.dataset.softShadowSpread = softShadowSpreadInput.value;
                buttonElement.dataset.fillColor = null;
                buttonElement.dataset.textColor = null;
                buttonElement.dataset.hardShadowX = null;
                buttonElement.dataset.hardShadowY = null;
                buttonElement.dataset.outlineWidth = null;
                buttonElement.dataset.outlineColor = null;
                break;
            case 'hard-shadow':
                buttonElement.classList.add('hard-shadow');
                buttonElement.style.boxShadow = `${hardShadowXInput.value}px ${hardShadowYInput.value}px 10px  ${buttonElement.dataset.shadowColor || black}`;
                buttonElement.dataset.hardShadowX = hardShadowXInput.value;
                buttonElement.dataset.hardShadowY = hardShadowYInput.value;
                buttonElement.dataset.fillColor = null;
                buttonElement.dataset.textColor = null;
                buttonElement.dataset.softShadowX = null;
                buttonElement.dataset.softShadowY = null;
                buttonElement.dataset.softShadowSpread = null;
                buttonElement.dataset.outlineWidth = null;
                buttonElement.dataset.outlineColor = null;
                break;
            case 'outline':
                buttonElement.classList.add('outline');
                buttonElement.style.outlineWidth = outlineWidthInput.value > 5 ? "5px" : `${outlineWidthInput.value}px`;
                buttonElement.style.outlineColor = outlineColorInput.value;
                buttonElement.dataset.outlineWidth = outlineWidthInput.value;
                buttonElement.dataset.outlineColor = outlineColorInput.value;
                buttonElement.dataset.fillColor = null;
                buttonElement.dataset.textColor = null;
                buttonElement.dataset.softShadowX = null;
                buttonElement.dataset.softShadowY = null;
                buttonElement.dataset.softShadowSpread = null;
                buttonElement.dataset.hardShadowX = null;
                buttonElement.dataset.hardShadowY = null;
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

    async function updateButton(activerOverlay) {
        const buttonOverlay = document.querySelector(`.btn__overlay[data-design-state="edit"]`) || activerOverlay;
        const formValues = getFormValues();

        // Get the button element from the overlay
        const buttonElement = buttonOverlay.previousElementSibling;

        const button_id = buttonElement.dataset.id;
        // Extract values from formValues object

        // Make a fetch request to update the button data on the server
        try {
            const response = await fetch(`/api/button/update/${button_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    button_id: button_id, // Assuming button_id is stored in dataset
                    buttonText: formValues[0],
                    buttonLink: formValues[1],
                    preset: formValues[2],
                    styleStrength: formValues[3],
                    fillColor: formValues[4],
                    textColor: formValues[5],
                    softShadowX: formValues[6],
                    softShadowY: formValues[7],
                    softShadowSpread: formValues[8],
                    hardShadowX: formValues[9],
                    hardShadowY: formValues[10],
                    outlineWidth: formValues[11],
                    outlineColor: formValues[12]
                })
            });

            if (response.ok) {
                editButton(buttonOverlay);
                showMessage('Button updated successfully.', 'success');
            } else {
                showMessage('Failed to update button.', 'error');
            }
        } catch (error) {
            console.error('Error updating button:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        }
    }






    const saveEditButton = document.getElementById('saveEditButton');
    // Event listener for saving edits in the modal
    saveEditButton.addEventListener('click', () => {
        if (activeOverlay) {
            updateButton(activeOverlay);
            showMessage('Successfully edited.', 'success');
            setOverlayState(activeOverlay, 'design'); // Reset the state of the active overlay to 'design' after editing
            activeOverlay = null; // Clear the active overlay after editing
        } else {
            showMessage('An error occurred while trying to edit this button.', 'error');
        }
    });


    function deleteCustomButtonUI() {
        const btnContainer = activeOverlay.closest('.btn__container'); // Find the closest parent with class 'btn__container'

        if (btnContainer) {
            btnContainer.remove(); // Remove the button container from the DOM
            closeCustomizeElementModal();
        } else {
            showMessage('Error: Button container not found.', 'error');
        }
    }

    const deleteBtn = document.getElementById('deleteCustomButton');
    deleteBtn.addEventListener("click", deleteButton);




    async function createButton() {
        const formValues = getFormValues();

        const button_id = generateUniqueId(); // Generate a unique ID for the card
        const user_id = await getUserIdWithFallback();

        const buttonData = {
            button_id: button_id,
            buttonText: formValues[0],
            buttonLink: formValues[1],
            preset: formValues[2],
            styleStrength: formValues[3],
            fillColor: formValues[4],
            textColor: formValues[5],
            shadowColor: formValues[6], // Add the shadow color from formValues
            outlineWidth: formValues[7], // Add the outline width from formValues
            outlineColor: formValues[8] // Add the outline color from formValues
        };

        try {
            const response = await fetch('/api/button/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user_id,
                    button_id: button_id,
                    buttonText: formValues[0],
                    buttonLink: formValues[1],
                    preset: formValues[2],
                    styleStrength: formValues[3],
                    fillColor: formValues[4],
                    textColor: formValues[5],
                    softShadowX: formValues[6],
                    softShadowY: formValues[7],
                    softShadowSpread: formValues[8],
                    hardShadowX: formValues[9],
                    hardShadowY: formValues[10],
                    outlineWidth: formValues[11],
                    outlineColor: formValues[12],
                })
            });

            if (response.ok) {
                showMessage('Button created successfully.', 'success');
                addCustomButtonUI(buttonData);
            } else {
                showMessage('Failed to create button.', 'error');
            }
        } catch (error) {
            console.error('Error creating button:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        }
    }

    // Function to fetch all buttons from the server
    async function fetchButtons() {
        const user_id = await getUserIdWithFallback();
        try {
            const response = await fetch(`/api/buttons/${user_id}`); // Assuming this is your endpoint to fetch buttons
            if (!response.ok) {
                throw new Error('Failed to fetch buttons.');
            }
            const buttonsData = await response.json(); // Parse the JSON response

            // Iterate through the buttonsData array and pass each button's data to addCustomButtonUI
            buttonsData.forEach(button => {
                addCustomButtonUI(button);
            });

        } catch (error) {
            console.error('Error fetching buttons:', error);
            // Handle error, show a message, etc.
        }
    }


    async function deleteButton() {
        const button_id = activeOverlay.closest('.btn__container').querySelector('a').dataset.id; // Find the closest parent with class 'btn__container'

        try {
            const response = await fetch(`/api/button/delete/${button_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Handle success, e.g., remove the button from the UI
                showMessage('Button deleted successfully.', 'success');
                deleteCustomButtonUI();
            } else {
                // Handle error
                showMessage('Failed to delete button.', 'error');
            }
        } catch (error) {
            console.error('Error deleting button:', error);
        }
    }


    window.addEventListener('DOMContentLoaded', () => {
        fetchButtons();
    })

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


function getFormValues() {
    const buttonText = document.getElementById('buttonText').value;
    const buttonLink = document.getElementById('buttonLink').value;
    const preset = document.getElementById('buttonPreset').value;
    const styleStrength = document.getElementById('style-strength').value;

    let fillColor = null;
    let textColor = null;
    let softShadowX = null;
    let softShadowY = null;
    let softShadowSpread = null;
    let hardShadowX = null;
    let hardShadowY = null;
    let outlineWidth = null;
    let outlineColor = null;

    switch (preset) {
        case 'fill':
            fillColor = document.getElementById('fillColor').value;
            textColor = document.getElementById('textColor').value;
            break;
        case 'soft-shadow':
            softShadowX = document.getElementById('soft-shadow-x').value;
            softShadowY = document.getElementById('soft-shadow-y').value;
            softShadowSpread = document.getElementById('soft-shadow-spread').value;
            break;
        case 'hard-shadow':
            hardShadowX = document.getElementById('hard-shadow-x').value;
            hardShadowY = document.getElementById('hard-shadow-y').value;
            break;
        case 'outline':
            outlineWidth = document.getElementById('outline-width').value;
            outlineColor = document.getElementById('outline-color').value;
            break;
        default:
            break;
    }

    return [buttonText, buttonLink, preset, styleStrength, fillColor, textColor, softShadowX, softShadowY, softShadowSpread, hardShadowX, hardShadowY, outlineWidth, outlineColor];
}






function applyGlobalStyles() {



    const buttons = document.querySelectorAll('.btn__container button');

    buttons.forEach(button => {
        let buttonFillColor = document.getElementById('ButtonColor1').value;
        let buttonTextColor = document.getElementById('ButtonColor2').value;
        let buttonShadowColor = document.getElementById('ButtonColor3').value;
        let font = document.querySelector('.font-name').textContent;
        button.dataset.fillColor = buttonFillColor;
        button.style.backgroundColor = buttonFillColor;

        button.dataset.textColor = buttonTextColor;
        button.style.color = buttonTextColor;

        button.dataset.font = font;
        button.style.fontFamily = font;

        // Check if the button has a hard-shadow or soft-shadow class
        if (button.classList.contains('hard-shadow') || button.classList.contains('soft-shadow')) {
            // Check if there is an existing box shadow style
            if (button.style.boxShadow) {
                // Replace the RGBA color value with HEX value
                let modifiedBoxShadow = button.style.boxShadow.replace(/rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)/, buttonShadowColor);

                // Apply the modified box shadow style to the button
                button.style.boxShadow = modifiedBoxShadow;
            }
        } else {
            // No specific shadow class, do nothing or add other conditions if needed
        }

    });
}


async function updateStyles() {
    try {
        const user_id = await getUserIdWithFallback();
        const response = await fetch('/api/style/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                button_color: document.getElementById('ButtonColor1').value,
                text_color: document.getElementById('ButtonColor2').value,
                shadow_color: document.getElementById('ButtonColor3').value,
                button_font: document.querySelector('.font-name').textContent
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        applyGlobalStyles();
        showMessage('Style data updated successfully.', 'success');
    } catch (error) {
        showMessage('Style data update is unsuccessful.', 'error');
    }
}


async function fetchGlobalStyles() {
    const user_id = await getUserIdWithFallback();
    fetch(`/api/style/${user_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Global styles fetched successfully:', data);
            fillInputFields(data);
        })
        .catch(error => {
            console.error('Error fetching global styles:', error);
        });
}

function fillInputFields(data) {
    document.getElementById('ButtonColor1').value = data.button_color;
    document.getElementById('ColorSelectorButton1').style.backgroundColor = data.button_color;

    document.getElementById('ButtonColor2').value = data.text_color;
    document.getElementById('ColorSelectorButton2').style.backgroundColor = data.text_color;


    document.getElementById('ButtonColor3').value = data.shadow_color;
    document.getElementById('ColorSelectorButton3').style.backgroundColor = data.shadow_color;


    document.querySelector('.font-name').textContent = data.button_font;
    document.querySelector('.font-name').style.fontFamily = data.button_font;

}


document.addEventListener('DOMContentLoaded', fetchGlobalStyles);




function hexToRgba(hex, alpha) {
    // Remove the '#' from the beginning of the hex color
    hex = hex.replace('#', '');

    // Convert the hex values to decimal
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Return the rgba color with the specified alpha
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}




// Function to handle class changes based on design selections
function handleButttonSelection(preset, styleStrength) {

    // Get all buttons inside the .container
    const buttons = document.querySelectorAll('.btn__container button');

    // Loop through all buttons
    buttons.forEach(button => {
        // Remove existing classes
        button.classList.remove('fill', 'soft-shadow', 'hard-shadow', 'outline', 'var-1', 'var-2', 'var-3');

        // Add classes based on preset and style strength
        button.classList.add(preset);
        button.classList.add(`var-${styleStrength}`);

        // Find the overlay for the current button
        const overlay = button.closest('.btn__container').querySelector('.btn__overlay');
        if (overlay) {
            // Remove existing classes from the overlay
            overlay.classList.remove('fill', 'soft-shadow', 'hard-shadow', 'outline', 'var-1', 'var-2', 'var-3');

            overlay.classList.add(`var-${styleStrength}`);
        }
    });
    showMessage(`selected: ${preset} , strength: ${styleStrength}`);
}



async function updateAllButtonsStyles(preset, styleStrength) {
    try {
        const userId = await getUserIdWithFallback(); // Get the user's ID
        const apiUrl = `/api/buttons/update/${userId}`; // Assuming your API endpoint for updating all user buttons is '/api/buttons/user/:userId'

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                preset: preset,
                styleStrength: styleStrength,
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update buttons style');
        }

        const data = await response.json();
        console.log('Buttons style updated successfully:', data);
    } catch (error) {
        console.error('Error updating buttons style:', error);
    }
}
