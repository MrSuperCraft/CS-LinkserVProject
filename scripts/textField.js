// from addElement.js


function closeCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'none';

}

function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}

function showTextFieldSection() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'block';
    document.getElementById('buttonSection').style.display = 'none';
    document.getElementById('addTextField').style.display = 'block';
    document.getElementById('save-text').style.display = 'none';
    document.getElementById('delete-text').style.display = 'none';
    document.getElementById('modalTitle').textContent = "Add a New Text Field";

}

////////////////////////////////////////


function showTextFieldSectionEdit() {
    openCustomizeElementModal();
    showTextFieldSection();
    document.getElementById("save-text").style.display = "block";
    document.getElementById("delete-text").style.display = "block";
    document.getElementById("addTextField").style.display = "none";
    document.getElementById('modalTitle').textContent = "Edit Your Text Field";
}







document.addEventListener("DOMContentLoaded", function () {

    let optionsButtons = document.querySelectorAll(".option-button");
    let advancedOptionButton = document.querySelectorAll(".adv-option-button");
    let fontSizeRef = document.getElementById("fontSize");
    let linkButton = document.getElementById("createLink");
    let alignButtons = document.querySelectorAll(".align");
    let spacingButtons = document.querySelectorAll(".spacing");
    let formatButtons = document.querySelectorAll(".format");
    let scriptButtons = document.querySelectorAll(".script");

    //Initial Settings
    const initializer = () => {
        //function calls for highlighting buttons
        //No highlights for link, unlink,lists, undo,redo since they are one time operations
        highlighter(alignButtons, true);
        highlighter(spacingButtons, true);
        highlighter(formatButtons, false);
        highlighter(scriptButtons, true);


        //fontSize allows only till 7
        for (let i = 1; i <= 7; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.innerHTML = i;
            fontSizeRef.appendChild(option);
        }

        //default size
        fontSizeRef.value = 3;
    };

    //main logic
    const modifyText = (command, defaultUi, value) => {
        //execCommand executes command on selected text
        document.execCommand(command, defaultUi, value);
    };

    //For basic operations which don't need value parameter
    optionsButtons.forEach((button) => {
        button.addEventListener("click", () => {
            modifyText(button.id, false, null);
        });
    });

    //options that require value parameter (e.g colors, fonts)
    advancedOptionButton.forEach((button) => {
        button.addEventListener("change", () => {
            modifyText(button.id, false, button.value);
        });
    });

    //link
    linkButton.addEventListener("click", () => {
        let userLink = prompt("Enter a URL");
        //if link has http then pass directly else add https
        if (/http/i.test(userLink)) {
            modifyText(linkButton.id, false, userLink);
        } else {
            userLink = "http://" + userLink;
            modifyText(linkButton.id, false, userLink);
        }
    });

    //Highlight clicked button
    const highlighter = (className, needsRemoval) => {
        className.forEach((button) => {
            button.addEventListener("click", () => {
                //needsRemoval = true means only one button should be highlight and other would be normal
                if (needsRemoval) {
                    let alreadyActive = false;

                    //If currently clicked button is already active
                    if (button.classList.contains("active")) {
                        alreadyActive = true;
                    }

                    //Remove highlight from other buttons
                    highlighterRemover(className);
                    if (!alreadyActive) {
                        //highlight clicked button
                        button.classList.add("active");
                    }
                } else {
                    //if other buttons can be highlighted
                    button.classList.toggle("active");
                }
            });
        });
    };

    const highlighterRemover = (className) => {
        className.forEach((button) => {
            button.classList.remove("active");
        });
    };

    window.onload = initializer();

});

const cardsContainer = document.getElementById('text-field-container');
let activeEditCard = null; // Track the currently active edit card

// Function to create a new card with formatted content and handle ID generation
function createCardUI(TextField_id, content) {
    if (!TextField_id) {
        console.error(`couldn't load a card`)
        return;
    }

    const textContent = content; // Trim leading and trailing whitespace

    if (!textContent) {
        console.error('Text content is empty.');
        return;
    }

    const generatedId = TextField_id;
    // Create a new card element
    const card = document.createElement('div');
    card.classList.add('textfield-card');
    card.dataset.cardId = generatedId; // Assign the unique ID as a data attribute

    // Create card content div with HTML content
    const cardContent = document.createElement('div');
    cardContent.classList.add('text-content');
    cardContent.innerHTML = textContent;

    // Add design state attribute to the card content
    cardContent.setAttribute('data-design-state', 'design');

    const icon = document.createElement('i');
    icon.classList.add('fa', 'fa-pencil');

    // Add overlay icon to the card
    const overlay = document.createElement('div');
    overlay.appendChild(icon);
    overlay.classList.add('text-overlay');
    overlay.addEventListener('click', () => {
        if (activeEditCard) {
            activeEditCard.setAttribute('data-design-state', 'design'); // Reset previous edit state
        }
        activeEditCard = cardContent; // Set the current card as active for editing
        // Open customizeElementModal with the card's text content
        showTextFieldSectionEdit();
        document.getElementById('text-input').innerHTML = cardContent.innerHTML;
        // Switch the design state attribute to edit mode
        cardContent.setAttribute('data-design-state', 'edit');
    });

    // Append card content and overlay icon to the card
    card.appendChild(overlay);
    card.appendChild(cardContent);

    // Append the card to the cards container
    cardsContainer.appendChild(card);

    closeCustomizeElementModal();
    // Clear the text editor content after creating the card
    document.getElementById('text-input').innerHTML = '';
}










// Function to edit the content of the card without moving its position
function editTextFieldUI() {
    const textEditor = document.getElementById('text-input');
    if (activeEditCard) {
        // Update the content of the active edit card without changing its position
        activeEditCard.innerHTML = textEditor.innerHTML;
        showMessage('Card content updated successfully.', 'success');
        closeCustomizeElementModal(); // Close the editing modal
        activeEditCard.setAttribute('data-design-state', 'design'); // Reset edit state
        activeEditCard = null; // Reset active edit card
    } else {
        showMessage('No card content to edit.', 'error');
    }
}

// Function to delete the text field card
function deleteTextFieldUI() {
    if (activeEditCard) {
        const targetCard = activeEditCard.closest('.textfield-card');
        if (targetCard) {
            targetCard.parentNode.removeChild(targetCard);
            showMessage('Card deleted successfully.', 'success');
            closeCustomizeElementModal();
            activeEditCard.setAttribute('data-design-state', 'design'); // Reset edit state
            activeEditCard = null; // Reset active edit card
        } else {
            showMessage('Card not found.', 'error');
        }
    } else {
        showMessage('No card selected for deletion.', 'error');
    }
}




document.addEventListener('DOMContentLoaded', function () {
    const createTextFieldBtn = document.getElementById('addTextField');
    const saveTextBtn = document.getElementById('save-text');
    const deleteTextBtn = document.getElementById('delete-text');
    const textEditor = document.getElementById('text-input');


    // Add event listener to the button to create a card
    createTextFieldBtn.addEventListener('click', createTextFieldCard);
    saveTextBtn.addEventListener('click', updateTextFieldCard);
    deleteTextBtn.addEventListener('click', deleteTextFieldCard);

    const customizeElementModal = document.getElementById('customizeElementModal');
    // Event listener for clicks outside the modal
    document.addEventListener('click', function (event) {
        if (!customizeElementModal.contains(event.target)) {
            // Click is outside the modal
            if (getComputedStyle(customizeElementModal).display === 'none') {
                // Clear the text input content
                textEditor.innerHTML = '';
                // Reset all cards' design states to 'design'
                const allCards = document.querySelectorAll('.textfield-card .text-content');
                allCards.forEach(card => card.setAttribute('data-design-state', 'design'));
                activeEditCard = null; // Reset active edit card
            }
        }
    });
});




// Function to create a new text field card
async function createTextFieldCard() {
    const textEditor = document.getElementById('text-input'); // Initialize textEditor here
    if (!textEditor) {
        console.error('textEditor is null or not initialized.');
        return;
    }

    const user_id = await getUserId();
    if (!user_id) {
        console.error('User ID not available');
        return;
    }
    const card_id = generateUniqueId(); // Generate a unique ID for the card

    const content = textEditor.innerHTML;


    try {
        const response = await fetch('/api/textfield/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: user_id, TextField_id: card_id, content: content }),
        });

        if (!response.ok) {
            throw new Error('Error creating text field card');
        }

        showMessage('Text field card created successfully!', 'success');
        createCardUI(card_id, content); // Pass the generated card ID to createCardUI
    } catch (error) {
        console.error('Error:', error);
        showMessage('Failed to create text field card. Please try again.', 'error');
    }
}










// Function to retrieve all text field cards for a specific user
async function getAllTextFieldCards() {
    const user_id = await getUserId();
    try {
        const response = await fetch(`/api/textfields/${user_id}`);

        if (!response.ok) {
            throw new Error('Error fetching text field cards');
        }

        const data = await response.json();


        // Assuming data is an array of text field cards
        // Loop through the data and create UI cards using createCardUI function
        data.forEach(card => {
            createCardUI(card.TextField_id, card.content);
        });

    } catch (error) {
        console.error('Error:', error);
        // Handle error messages or UI updates for error cases
    }
}

// Function to update a text field card
async function updateTextFieldCard() {
    const cardId = document.querySelector('.textfield-card .text-content[data-design-state="edit"]').parentNode.dataset.cardId; // Get the card ID from the dataset

    const content = document.getElementById('text-input').innerHTML; // Get the updated content

    try {
        const response = await fetch(`/api/textfields/update/${cardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cardId, content }), // Include cardId in the payload
        });

        if (!response.ok) {
            throw new Error('Error updating text field card');
        }


        // Handle any UI updates or notifications here
        editTextFieldUI();
    } catch (error) {
        console.error('Error:', error);
        // Handle error messages or UI updates for error cases
    }
}





// Function to delete a text field card
async function deleteTextFieldCard() {
    const TextField_id = document.querySelector('.textfield-card .text-content[data-design-state="edit"]').parentNode.dataset.cardId; // Get the card ID from the dataset

    try {
        const response = await fetch(`/api/textfields/delete/${TextField_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ TextField_id: TextField_id }), // Send TextField_id as JSON in the body
        });

        if (!response.ok) {
            throw new Error('Error deleting text field card');
        }
        // Handle any UI updates or notifications here
        deleteTextFieldUI(); // Remove the deleted card from the UI
    } catch (error) {
        console.error('Error:', error);
        // Handle error messages or UI updates for error cases
    }
}





document.addEventListener('DOMContentLoaded', getAllTextFieldCards);